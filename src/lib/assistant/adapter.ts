/** UI-owned boundary, not Ben's wire format. Send only the current question. */
export interface AssistantSource {
  citation?: number;
  documentName: string;
  pages?: { start: number; end?: number };
  excerpt: string;
  originalPageUrl?: string;
}
export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: AssistantSource[];
  fund?: string;
}
export interface AssistantAdapter {
  connected: boolean;
  ask(
    question: string,
    options?: {
      signal: AbortSignal;
      fund?: string;
      onUpdate: (answer: Omit<AssistantMessage, "id" | "role">) => void;
    },
  ): Promise<Omit<AssistantMessage, "id" | "role">>;
}
export const disconnectedAdapter: AssistantAdapter = {
  connected: false,
  async ask() {
    throw new Error("Not connected yet");
  },
};
