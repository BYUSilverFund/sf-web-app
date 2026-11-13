import { afterEach, describe, expect, it, vi } from "vitest";
import { ReadableStream } from "node:stream/web";
import { liveAdapter, readChatStream } from "./live";
import { fetchAuthSession } from "aws-amplify/auth";
vi.mock("aws-amplify/auth", () => ({
  fetchAuthSession: vi.fn(async () => ({
    tokens: { accessToken: "test-token" },
  })),
}));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});
const event = (name: string, data: unknown) =>
  `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;
function stream(text: string, size = 1) {
  const bytes = new TextEncoder().encode(text);
  return new ReadableStream({
    start(controller) {
      for (let i = 0; i < bytes.length; i += size)
        controller.enqueue(bytes.slice(i, i + size));
      controller.close();
    },
  }) as unknown as globalThis.ReadableStream<Uint8Array>;
}
describe("verified dev chat contract", () => {
  it("includes the backend request ID without exposing server error details", async () => {
    await expect(
      readChatStream(
        stream(
          event("meta", { requestId: "trace-123" }) +
            event("error", { message: "private backend details" }),
        ),
      ),
    ).rejects.toThrow(
      "The API could not finish the answer. Please retry. Request ID: trace-123",
    );
  });
  it("parses UTF-8 and CRLF split at every byte, publishing incremental answers and real sources", async () => {
    const update = vi.fn();
    const answer = await readChatStream(
      stream(
        (
          event("meta", { requestId: "r" }) +
          event("delta", { text: "Café " }) +
          event("delta", { text: "[1]" }) +
          event("sources", {
            sources: [
              {
                citation: 1,
                documentKey: "manual.pdf",
                page: 4,
                excerpt: "Evidence",
              },
            ],
          }) +
          event("done", {})
        ).replace(/\n/g, "\r\n"),
      ),
      update,
    );
    expect(update).toHaveBeenCalledWith({
      content: "Café ",
      sources: undefined,
    });
    expect(answer).toEqual({
      content: "Café [1]",
      sources: [
        {
          citation: 1,
          documentName: "manual.pdf",
          pages: { start: 4 },
          excerpt: "Evidence",
        },
      ],
    });
    expect(answer.sources?.[0]).not.toHaveProperty("originalPageUrl");
  });
  it.each([
    [event("delta", { text: "partial" }), /connection ended/],
    [
      event("error", { message: "private backend details" }),
      /could not finish/,
    ],
    [event("done", {}), /empty answer/],
    ["event: delta\ndata: invalid\n\n", /JSON|Unexpected/],
  ])(
    "rejects incomplete, failed, empty or malformed streams",
    async (text, message) => {
      await expect(readChatStream(stream(text as string))).rejects.toThrow(
        message,
      );
    },
  );
  it("uses the configured base, current access token, current question only, and abort signal", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(
        new Response(
          stream(
            event("delta", { text: "Answer" }) +
              event("sources", { sources: [] }) +
              event("done", {}),
          ),
          { headers: { "Content-Type": "text/event-stream" } },
        ),
      );
    vi.stubGlobal("fetch", fetch);
    const signal = new AbortController().signal;
    await liveAdapter.ask("Question", { signal, onUpdate: vi.fn() });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/chat\/stream$/),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ message: "Question" }),
        signal,
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      }),
    );
  });
  it("never calls the API without an access token", async () => {
    vi.mocked(fetchAuthSession).mockResolvedValueOnce({} as never);
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    await expect(liveAdapter.ask("Question")).rejects.toThrow(/sign in/);
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each([401, 403, 429, 500])("handles HTTP %i", async (status) => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status })),
    );
    await expect(liveAdapter.ask("Question")).rejects.toThrow(
      status === 429 ? /wait/ : status < 429 ? /sign in/ : /500/,
    );
  });
});

it.each([
  "all_funds",
  "quant",
  "undergrad",
  "grad",
  "quant_paper",
  "brigham_capital",
])("sends structured fund %s with the question", async (fund) => {
  vi.mocked(fetchAuthSession).mockResolvedValue({
    tokens: { accessToken: { toString: () => "token" } },
  } as never);
  const fetcher = vi.fn().mockResolvedValue({
    ok: true,
    headers: new Headers({ "content-type": "text/event-stream" }),
    body: stream(event("delta", { text: "Answer" }) + event("done", {})),
  });
  vi.stubGlobal("fetch", fetcher);
  await liveAdapter.ask("Question", {
    fund,
    signal: new AbortController().signal,
    onUpdate: vi.fn(),
  });
  expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({
    message: "Question",
    fund,
  });
});
