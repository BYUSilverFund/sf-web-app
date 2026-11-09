"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ArrowUpRight,
  SquarePen,
  Maximize2,
  MessageCircle,
  Minimize2,
  X,
} from "lucide-react";
import {
  type AssistantAdapter,
  type AssistantMessage,
} from "@/lib/assistant/adapter";
import { fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { liveAdapter } from "@/lib/assistant/live";
import { Answer } from "./Answer";
import "./assistant.css";

function safeLink(url?: string) {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol)
      ? parsed.href
      : undefined;
  } catch {
    return undefined;
  }
}

export default function SilverFundAssistant({
  adapter: suppliedAdapter,
}: {
  adapter?: AssistantAdapter;
}) {
  const adapter = suppliedAdapter ?? liveAdapter;
  const [signedIn, setSignedIn] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    let active = true;
    let version = 0;
    const check = () => {
      const current = ++version;
      void fetchAuthSession()
        .then((session) => {
          if (active && current === version)
            setSignedIn(Boolean(session.tokens?.accessToken));
        })
        .catch(() => {
          if (active && current === version) setSignedIn(false);
        });
    };
    check();
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedOut") {
        version++;
        request.current++;
        controller.current?.abort();
        setBusy(false);
        setSignedIn(false);
        setMessages([]);
        setDraft("");
        setError("");
        setFailedQuestion("");
        setOpen(false);
      } else check();
    });
    const interval = setInterval(check, 60000);
    return () => {
      clearInterval(interval);
      active = false;
      unsubscribe();
      controller.current?.abort();
    };
  }, []);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [failedQuestion, setFailedQuestion] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messageList = useRef<HTMLElement>(null);
  useEffect(() => {
    const list = messageList.current;
    if (list && list.scrollHeight - list.scrollTop - list.clientHeight < 180)
      list.scrollTop = list.scrollHeight;
  }, [messages]);
  const composing = useRef(false);
  const request = useRef(0);
  const input = useRef<HTMLTextAreaElement>(null);
  const canSend =
    adapter.connected && !busy && !!draft.trim() && draft.trim().length <= 4000;

  async function send(retry?: string) {
    if ((!retry && !canSend) || busy || composing.current) return;
    const question = retry ?? draft.trim();
    if (question.length > 4000) return;
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    setFailedQuestion("");
    setStreaming(false);
    setDraft("");
    setError("");
    if (!retry)
      setMessages((previous) => [
        ...previous,
        { id: crypto.randomUUID(), role: "user", content: question },
      ]);
    setBusy(true);
    const current = ++request.current;
    const answerId = crypto.randomUUID();
    const update = (answer: Omit<AssistantMessage, "id" | "role">) => {
      if (current !== request.current) return;
      setStreaming(Boolean(answer.content));
      setMessages((previous) => [
        ...previous.filter((message) => message.id !== answerId),
        { ...answer, id: answerId, role: "assistant" },
      ]);
    };
    const timeout = setTimeout(() => abort.abort(), 120000);
    try {
      const answer = await adapter.ask(question, {
        signal: abort.signal,
        onUpdate: update,
      });
      update(answer);
    } catch (failure) {
      if (current === request.current) {
        setMessages((previous) =>
          previous.filter((message) => message.id !== answerId),
        );
        setFailedQuestion(question);
        setError(
          abort.signal.aborted
            ? "Request stopped or timed out. You can retry."
            : failure instanceof Error
              ? failure.message
              : "Unable to get an answer. Please retry.",
        );
      }
    } finally {
      clearTimeout(timeout);
      if (current === request.current) {
        setBusy(false);
        setStreaming(false);
      }
    }
  }

  if (!suppliedAdapter && !signedIn) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="sf-launcher" aria-label="Open Silver Fund Assistant">
          <MessageCircle aria-hidden="true" />
          <span>Ask Silver Fund</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        overlayClassName={`sf-chat-backdrop ${expanded ? "sf-expanded" : ""}`}
        className={`sf-chat ${expanded ? "sf-expanded" : ""}`}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          input.current?.focus();
        }}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <header className="sf-chat-header">
          <Button
            variant="ghost"
            size="icon"
            aria-label="New chat"
            title="New chat"
            onClick={() => {
              controller.current?.abort();
              request.current++;
              setBusy(false);
              setMessages([]);
              setDraft("");
              setError("");
              setFailedQuestion("");
              input.current?.focus();
            }}
          >
            <SquarePen aria-hidden="true" />
            <span className="sr-only">New chat</span>
          </Button>
          <DialogTitle>Ask Silver Fund</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="sf-expand"
            aria-label={expanded ? "Minimize assistant" : "Expand assistant"}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? (
              <Minimize2 aria-hidden="true" />
            ) : (
              <Maximize2 aria-hidden="true" />
            )}
          </Button>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label="Close assistant">
              <X aria-hidden="true" />
            </Button>
          </DialogClose>
        </header>
        <DialogDescription className="sr-only">
          Ask each question in full. Earlier messages aren’t sent with it.
        </DialogDescription>
        {!adapter.connected && (
          <div className="sf-chat-intro">
            <p role="status">Not connected yet</p>
          </div>
        )}
        <section
          ref={messageList}
          className="sf-messages"
          aria-busy={busy}
          aria-label="Messages"
          tabIndex={0}
        >
          {!messages.length && (
            <div className="sf-chat-empty">
              <h3>How can we help?</h3>
              <p>
                {adapter.connected
                  ? "Ask about fund research and documents. Read the sources included with each answer."
                  : "Research is currently unavailable. Your draft will stay here."}
              </p>
              {adapter.connected && (
                <div className="sf-starters" aria-label="Suggested questions">
                  {[
                    "Summarize the Microsoft research report",
                    "How does the Quant Fund strategy work?",
                    "What risks are discussed in the fund documents?",
                  ].map((question) => (
                    <Button
                      variant="outline"
                      type="button"
                      key={question}
                      onClick={() => {
                        setDraft(question);
                        input.current?.focus();
                      }}
                    >
                      <span>{question}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
          {messages
            .filter(
              (message) =>
                message.role === "user" ||
                message.content ||
                message.sources?.length,
            )
            .map((message) => (
              <article
                key={message.id}
                className={`sf-message sf-${message.role}`}
                aria-label={
                  message.role === "user" ? "Your question" : "Assistant answer"
                }
              >
                <p className="sf-message-label">
                  {message.role === "user" ? "You" : "Silver Fund"}
                </p>
                {message.role === "assistant" ? (
                  <Answer content={message.content} />
                ) : (
                  <p className="sf-question">{message.content}</p>
                )}
                {!!message.sources?.length && (
                  <details className="sf-sources">
                    <summary>Show sources ({message.sources.length})</summary>
                    {message.sources.map((source, index) => (
                      <div key={index}>
                        <strong>
                          {source.citation ? `[${source.citation}] ` : ""}
                          {source.documentName}
                        </strong>
                        {source.pages && (
                          <p>
                            PDF pages {source.pages.start}
                            {source.pages.end &&
                            source.pages.end !== source.pages.start
                              ? `–${source.pages.end}`
                              : ""}
                          </p>
                        )}
                        <blockquote>
                          <Answer content={source.excerpt} />
                        </blockquote>
                        {safeLink(source.originalPageUrl) && (
                          <a
                            href={safeLink(source.originalPageUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open original page{" "}
                            <span className="sr-only">(new tab)</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </details>
                )}
              </article>
            ))}
          {busy && !streaming && (
            <div className="sf-message sf-assistant sf-typing" role="status">
              <p className="sf-message-label">Silver Fund</p>
              <span className="sr-only">Waiting for an answer…</span>
              <div className="sf-typing-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </section>
        <form
          className="sf-composer"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          {error && (
            <div role="alert">
              <p>{error}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => void send(failedQuestion)}
              >
                Retry last question
              </Button>
            </div>
          )}
          <p role="status" aria-live="polite">
            {busy && streaming ? "Receiving answer…" : ""}
          </p>
          <Label htmlFor="sf-question">Your question</Label>
          <textarea
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
            id="sf-question"
            ref={input}
            value={draft}
            rows={2}
            maxLength={4000}
            placeholder="Ask about fund research or documents…"
            onChange={(event) => setDraft(event.target.value)}
            onCompositionStart={() => {
              composing.current = true;
            }}
            onCompositionEnd={() => {
              composing.current = false;
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing &&
                !composing.current &&
                event.keyCode !== 229
              ) {
                event.preventDefault();
                void send();
              }
            }}
          />
          <div className="sf-send-row">
            <small>
              {!adapter.connected
                ? "Sending unavailable until connected"
                : "Enter to send · Shift+Enter for newline"}
            </small>
            {busy && (
              <Button
                type="button"
                variant="outline"
                onClick={() => controller.current?.abort()}
              >
                Stop
              </Button>
            )}
            <Button type="submit" disabled={!canSend}>
              <span>Send</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
