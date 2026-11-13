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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import {
  ArrowUp,
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
import { Sources } from "./Sources";
import { EquationEditor } from "./EquationEditor";
import "./assistant.css";
import { fundKeys } from "@/components/FundTabsBar";
import { formatPortfolio } from "@/lib/utils";

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
        setEquationOpen(false);
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
  const [fund, setFund] = useState<string>("all_funds");
  const [failedFund, setFailedFund] = useState<string>("all_funds");
  const [draft, setDraft] = useState("");
  const [equationOpen, setEquationOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [failedQuestion, setFailedQuestion] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messageList = useRef<HTMLElement>(null);
  const followAnswer = useRef(true);
  useEffect(() => {
    const list = messageList.current;
    if (list && followAnswer.current) list.scrollTop = list.scrollHeight;
  }, [messages, busy, open, expanded]);
  const composing = useRef(false);
  const request = useRef(0);
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textarea = input.current;
    if (!textarea || !open) return;
    const fitContent = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };
    fitContent();
    // Refit wrapped lines when the popup or viewport changes width.
    let width = textarea.getBoundingClientRect().width;
    const observer = new ResizeObserver(() => {
      const nextWidth = textarea.getBoundingClientRect().width;
      if (nextWidth !== width) {
        width = nextWidth;
        fitContent();
      }
    });
    observer.observe(textarea);
    return () => observer.disconnect();
  }, [draft, open, expanded]);
  const canSend =
    adapter.connected && !busy && !!draft.trim() && draft.trim().length <= 4000;

  async function send(retry?: string) {
    if ((!retry && !canSend) || busy || composing.current) return;
    const question = retry ?? draft.trim();
    const requestFund = retry ? failedFund : fund;
    if (question.length > 4000) return;
    // Each submission (including retry) brings the new exchange into view.
    followAnswer.current = true;
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    setFailedQuestion("");
    setStreaming(false);
    setDraft("");
    setEquationOpen(false);
    setError("");
    if (!retry)
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "user",
          content: question,
          fund: requestFund,
        },
      ]);
    setBusy(true);
    const current = ++request.current;
    const answerId = crypto.randomUUID();
    const update = (answer: Omit<AssistantMessage, "id" | "role">) => {
      if (current !== request.current) return;
      setStreaming(Boolean(answer.content));
      setMessages((previous) => [
        ...previous.filter((message) => message.id !== answerId),
        { ...answer, id: answerId, role: "assistant", fund: requestFund },
      ]);
    };
    const timeout = setTimeout(() => abort.abort(), 120000);
    try {
      const answer = await adapter.ask(question, {
        signal: abort.signal,
        fund: requestFund,
        onUpdate: update,
      });
      update(answer);
    } catch (failure) {
      if (current === request.current) {
        setMessages((previous) =>
          previous.filter((message) => message.id !== answerId),
        );
        setFailedQuestion(question);
        setFailedFund(requestFund);
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
          <div className="sf-assistant-mark" aria-hidden="true">
            <img src="/sf-logo-white.png" alt="" width={30} height={30} />
          </div>
          <div className="sf-header-identity">
            <DialogTitle>Silver Fund</DialogTitle>
            <p>Assistant</p>
          </div>
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
              setEquationOpen(false);
              setError("");
              setFailedQuestion("");
              input.current?.focus();
            }}
          >
            <SquarePen aria-hidden="true" />
            <span className="sr-only">New chat</span>
          </Button>
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
          onScroll={(event) => {
            const list = event.currentTarget;
            followAnswer.current =
              list.scrollHeight - list.scrollTop - list.clientHeight < 40;
          }}
          aria-busy={busy}
          aria-label="Messages"
          tabIndex={0}
        >
          <div
            className={`sf-conversation ${!messages.length ? "sf-conversation-empty" : ""}`}
          >
            {!messages.length && (
              <div className="sf-chat-empty">
                <h3>Ask Silver Fund</h3>
                <p>
                  {adapter.connected
                    ? "Questions about portfolios, research, and fund documents."
                    : "Research is currently unavailable. Your draft will stay here."}
                </p>
                {adapter.connected && (
                  <div className="sf-example-questions">
                    <p id="sf-example-label">Example questions</p>
                    <div
                      className="sf-starters"
                      role="group"
                      aria-labelledby="sf-example-label"
                    >
                      {(fund === "all_funds"
                        ? [
                            "Which fund has the highest reported portfolio value?",
                            "How is tracking error defined in the fund documents?",
                            "What investment risks are described in the research reports?",
                          ]
                        : [
                            `Which ${formatPortfolio(fund)} holdings have the highest value?`,
                            `What was the latest dividend received by ${formatPortfolio(fund)}?`,
                            `What risks are discussed in the ${formatPortfolio(fund)} documents?`,
                          ]
                      ).map((question) => (
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
                        </Button>
                      ))}
                    </div>
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
                    message.role === "user"
                      ? "Your question"
                      : "Assistant answer"
                  }
                >
                  <p className="sf-message-label">
                    {message.role === "user" ? "You" : "Silver Fund"}
                    {message.fund && ` · ${formatPortfolio(message.fund)}`}
                  </p>
                  {message.role === "assistant" ? (
                    <Answer content={message.content} />
                  ) : (
                    <div className="sf-question">
                      <Answer content={message.content} />
                    </div>
                  )}
                  {!!message.sources?.length && (
                    <Sources sources={message.sources} />
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
          </div>
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
          <div className="sf-composer-inner">
            {equationOpen && !busy && (
              <div className="sf-equation-popover">
                <EquationEditor
                  available={4000 - draft.length}
                  onCancel={() => {
                    setEquationOpen(false);
                    input.current?.focus();
                  }}
                  onInsert={(formula) => {
                    const start = input.current?.selectionStart ?? draft.length;
                    const end = input.current?.selectionEnd ?? start;
                    const equation = `\n\n\\[\n${formula}\n\\]\n\n`;
                    const next =
                      draft.slice(0, start) + equation + draft.slice(end);
                    if (next.length > 4000) return;
                    setDraft(next);
                    setEquationOpen(false);
                    requestAnimationFrame(() => {
                      input.current?.focus();
                      input.current?.setSelectionRange(
                        start + equation.length,
                        start + equation.length,
                      );
                    });
                  }}
                />
              </div>
            )}
            <p role="status" aria-live="polite" className="sf-stream-status">
              {busy && streaming ? "Receiving answer…" : ""}
            </p>
            <div className="sf-composer-card">
              <Label htmlFor="sf-question" className="sr-only">
                Your question
              </Label>
              <textarea
                className="sf-question-input"
                id="sf-question"
                ref={input}
                value={draft}
                rows={2}
                maxLength={4000}
                placeholder="Ask Silver Fund a question…"
                aria-describedby="sf-fund-help sf-composer-help"
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
                <div className="sf-fund-control">
                  <span className="sf-fund-caption">Answer scope</span>
                  <Select
                    value={fund}
                    disabled={busy}
                    onValueChange={(value) => {
                      if (!busy) setFund(value);
                    }}
                  >
                    <SelectTrigger
                      aria-label="Fund"
                      aria-describedby="sf-fund-help"
                      className="sf-fund-trigger"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      side="top"
                      align="start"
                      sideOffset={8}
                      className="sf-fund-menu"
                    >
                      <SelectGroup>
                        <SelectLabel className="sf-fund-menu-label">
                          Search across funds
                        </SelectLabel>
                        <SelectItem
                          value="all_funds"
                          className="sf-fund-option"
                        >
                          All Funds
                        </SelectItem>
                      </SelectGroup>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel className="sf-fund-menu-label">
                          Focus on a fund
                        </SelectLabel>
                        {fundKeys
                          .filter((key) => key !== "all_funds")
                          .map((key) => (
                            <SelectItem
                              key={key}
                              value={key}
                              className="sf-fund-option"
                            >
                              {formatPortfolio(key)}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {!busy && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-expanded={equationOpen}
                    onClick={() => setEquationOpen((value) => !value)}
                  >
                    Equation
                  </Button>
                )}
                {busy && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => controller.current?.abort()}
                  >
                    Stop
                  </Button>
                )}
                <Button
                  type="submit"
                  className="sf-send-button"
                  disabled={!canSend}
                  aria-label="Send"
                >
                  <ArrowUp aria-hidden="true" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
            <p id="sf-fund-help" className="sf-fund-help">
              {fund === "all_funds"
                ? "Compare funds and search all available research."
                : `Focus on ${formatPortfolio(fund)} documents and portfolio.`}
            </p>
            <p id="sf-composer-help" className="sf-composer-hint">
              {!adapter.connected
                ? "Sending unavailable until connected"
                : "Enter to send · Shift+Enter for newline"}
            </p>
            <p className="sf-disclaimer">
              Verify figures and sources. Ask each question in full.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
