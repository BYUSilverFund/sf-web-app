import { fetchAuthSession } from "aws-amplify/auth";
import { API_BASE_URL } from "@/lib/variables";
import type { AssistantAdapter, AssistantSource } from "./adapter";

export const liveAdapter: AssistantAdapter = {
  connected: Boolean(process.env.NEXT_PUBLIC_FASTAPI_URL),
  async ask(question, options) {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();
    if (!token) throw new Error("Please sign in again to use the assistant.");
    const response = await fetch(`${API_BASE_URL}chat/stream`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ message: question }),
      signal: options?.signal,
    });
    if (!response.ok) {
      if ([401, 403].includes(response.status))
        throw new Error("Please sign in again to use the assistant.");
      if (response.status === 429)
        throw new Error("Too many requests. Please wait before retrying.");
      throw new Error(
        `Chat request failed (HTTP ${response.status}). Please retry.`,
      );
    }
    if (
      !response.headers.get("content-type")?.includes("text/event-stream") ||
      !response.body
    )
      throw new Error("The API did not return a chat stream.");
    return readChatStream(response.body, options?.onUpdate);
  },
};

/** Parse the sf-web-api dev SSE contract, independently of network chunk boundaries. */
export async function readChatStream(
  body: ReadableStream<Uint8Array>,
  onUpdate?: (answer: { content: string; sources?: AssistantSource[] }) => void,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "",
    content = "",
    done = false;
  let sources: AssistantSource[] | undefined;
  let requestId: string | undefined;
  const validRequestId = (value: unknown): value is string =>
    typeof value === "string" && /^[a-zA-Z0-9-]{1,80}$/.test(value);
  function frame(value: string) {
    let event = "message";
    const data: string[] = [];
    for (const line of value.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
    }
    if (!data.length) return;
    const payload = JSON.parse(data.join("\n"));
    if (event === "meta" && validRequestId(payload.requestId))
      requestId = payload.requestId;
    if (event === "error") {
      const id = validRequestId(payload.requestId)
        ? payload.requestId
        : requestId;
      throw new Error(
        `The API could not finish the answer. Please retry.${id ? ` Request ID: ${id}` : ""}`,
      );
    }
    if (event === "delta") {
      if (typeof payload.text !== "string")
        throw new Error("Invalid chat response.");
      content += payload.text;
    }
    if (event === "sources") {
      if (!Array.isArray(payload.sources))
        throw new Error("Invalid source response.");
      sources = payload.sources.map((source: Record<string, unknown>) => {
        if (
          typeof source.documentKey !== "string" ||
          typeof source.excerpt !== "string" ||
          !Number.isInteger(source.citation)
        )
          throw new Error("Invalid document source.");
        return {
          citation: source.citation as number,
          documentName: source.documentKey,
          excerpt: source.excerpt,
          pages:
            typeof source.page === "number" && source.page > 0
              ? { start: source.page }
              : undefined,
        };
      });
    }
    if (event === "done") done = true;
    onUpdate?.({ content, sources });
  }
  try {
    while (!done) {
      const chunk = await reader.read();
      buffer += decoder.decode(chunk.value, { stream: !chunk.done });
      // Normalize only complete CRLF pairs; a trailing CR may cross chunks.
      buffer = buffer.replace(/\r\n/g, "\n");
      let boundary: number;
      while ((boundary = buffer.indexOf("\n\n")) >= 0) {
        const value = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        frame(value);
        if (done) break;
      }
      if (chunk.done) break;
    }
    if (!done)
      throw new Error(
        "The connection ended before the answer finished. Please retry.",
      );
    if (!content.trim())
      throw new Error("The API returned an empty answer. Please retry.");
    return { content, sources };
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
