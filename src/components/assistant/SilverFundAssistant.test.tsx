import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SilverFundAssistant from "./SilverFundAssistant";
import { disconnectedAdapter } from "@/lib/assistant/adapter";
import { Answer } from "./Answer";

async function chooseFund(label: string) {
  const trigger = screen.getByRole("combobox", { name: "Fund" });
  // Exercise Radix's real form-control change path without JSDOM popup layout.
  const select = trigger.closest("form")!.querySelector("select")!;
  expect(select.options).toHaveLength(6);
  const option = Array.from(select.options).find(
    (item) => item.text === label,
  )!;
  fireEvent.change(select, { target: { value: option.value } });
  await waitFor(() => expect(trigger).toHaveTextContent(label));
}

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});
function open() {
  fireEvent.click(
    screen.getByRole("button", { name: "Open Silver Fund Assistant" }),
  );
}

describe("Silver Fund Assistant", () => {
  it("opens disconnected, preserves drafts across resize and close, and restores focus", async () => {
    render(<SilverFundAssistant adapter={disconnectedAdapter} />);
    const launcher = screen.getByRole("button", {
      name: "Open Silver Fund Assistant",
    });
    open();
    expect(screen.getByText("Not connected yet")).toBeVisible();
    const input = screen.getByRole("textbox", { name: "Your question" });
    expect(input).toHaveFocus();
    fireEvent.change(input, { target: { value: "My draft" } });
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(input).toHaveValue("My draft");
    fireEvent.click(screen.getByRole("button", { name: "Expand assistant" }));
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(input).toHaveValue("My draft");
    fireEvent.click(screen.getByRole("button", { name: "Minimize assistant" }));
    fireEvent.click(screen.getByRole("button", { name: "Close assistant" }));
    await waitFor(() => expect(launcher).toHaveFocus());
    open();
    expect(screen.getByRole("textbox", { name: "Your question" })).toHaveValue(
      "My draft",
    );
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("sends only independent questions, respecting Shift+Enter and composition", async () => {
    const ask = vi.fn().mockResolvedValue({ content: "An answer" });
    render(<SilverFundAssistant adapter={{ connected: true, ask }} />);
    open();
    const input = screen.getByRole("textbox", { name: "Your question" });
    fireEvent.change(input, { target: { value: "Question one" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
    fireEvent.compositionStart(input);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(ask).not.toHaveBeenCalled();
    fireEvent.compositionEnd(input);
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });
    expect(ask).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: "Enter" });
    await screen.findByText("An answer");
    expect(ask).toHaveBeenCalledWith(
      "Question one",
      expect.objectContaining({ onUpdate: expect.any(Function) }),
    );
    fireEvent.change(input, { target: { value: "Question two" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() =>
      expect(ask).toHaveBeenLastCalledWith("Question two", expect.any(Object)),
    );
    fireEvent.click(screen.getByRole("button", { name: "New chat" }));
    expect(screen.queryByText("Question one")).not.toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("does not offer developer preview in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    render(<SilverFundAssistant adapter={disconnectedAdapter} />);
    open();
    expect(screen.queryByText("Developer preview")).not.toBeInTheDocument();
    expect(screen.queryByText("Load local preview")).not.toBeInTheDocument();
  });

  it("keeps focus inside the modal", () => {
    render(
      <>
        <button>Outside</button>
        <SilverFundAssistant adapter={disconnectedAdapter} />
      </>,
    );
    const outside = screen.getByRole("button", { name: "Outside" });
    open();
    outside.focus();
    expect(screen.getByRole("dialog")).toContainElement(
      document.activeElement as HTMLElement,
    );
  });

  it("does not expose preview in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    render(<SilverFundAssistant adapter={disconnectedAdapter} />);
    open();
    expect(
      screen.queryByRole("button", { name: "Load local preview" }),
    ).not.toBeInTheDocument();
  });

  it("renders tables and explicit math while preserving currency", () => {
    render(
      <Answer
        content={String.raw`Costs $100 and $200.

| Symbol | Meaning |
| --- | --- |
| R | Return |

\[R = 1\]`}
      />,
    );
    expect(screen.getByText("Costs $100 and $200.")).toBeVisible();
    expect(screen.getByRole("table")).toBeVisible();
    expect(document.querySelector(".katex")).toBeInTheDocument();
  });
});

it("shows incremental content, removes failed partial output, retries without duplicating questions, and resets safely", async () => {
  let fail: (reason: Error) => void = () => {};
  const ask = vi
    .fn()
    .mockImplementationOnce(
      (_question, options) =>
        new Promise((_resolve, reject) => {
          fail = reject;
          options.onUpdate({ content: "Partial response" });
        }),
    )
    .mockResolvedValueOnce({ content: "Complete response", sources: [] });
  render(<SilverFundAssistant adapter={{ connected: true, ask }} />);
  open();
  const input = screen.getByRole("textbox", { name: "Your question" });
  fireEvent.change(input, { target: { value: "My question" } });
  fireEvent.keyDown(input, { key: "Enter" });
  await screen.findByText("Partial response");
  expect(screen.getByText("Receiving answer…")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Expand assistant" }));
  expect(screen.getByText("Partial response")).toBeVisible();
  fail(new Error("Stream interrupted"));
  await screen.findByRole("alert");
  expect(screen.queryByText("Partial response")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Retry last question" }));
  await screen.findByText("Complete response");
  expect(screen.getAllByText("My question")).toHaveLength(1);
  expect(screen.queryByText(/Show sources/)).not.toBeInTheDocument();
});

it("renders equations and tables inside collapsed source excerpts", async () => {
  const ask = vi.fn().mockResolvedValue({
    content: "See the tracking-error definition [4].",
    sources: [
      {
        citation: 4,
        documentName: "Quant Manual.pdf",
        pages: { start: 12 },
        excerpt: String.raw`Tracking error compares fund ($r_i$) and benchmark ($r_b$).
$$\sigma\_{a,i} = \sqrt{\text{Var}[r_i - r_b]}.$$ [4]

| Symbol | Meaning |
| --- | --- |
| $r_i$ | Fund return |`,
      },
    ],
  });
  render(<SilverFundAssistant adapter={{ connected: true, ask }} />);
  open();
  fireEvent.change(screen.getByRole("textbox", { name: "Your question" }), {
    target: { value: "Define tracking error" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
  const summary = await screen.findByText("Show sources (1)");
  const disclosure = summary.closest("details")!;
  expect(disclosure).not.toHaveAttribute("open");
  fireEvent.click(summary);
  expect(disclosure).toHaveAttribute("open");
  expect(disclosure.querySelectorAll("blockquote .katex")).toHaveLength(4);
  expect(disclosure.querySelector("blockquote .katex-display")).not.toBeNull();
  expect(disclosure.querySelector("blockquote .katex-error")).toBeNull();
  expect(screen.getByRole("table")).toBeVisible();
  expect(screen.getByText("[4] Quant Manual.pdf")).toBeVisible();
  expect(screen.getByText("PDF pages 12")).toBeVisible();
});

describe("fund selection", () => {
  it("keeps selection across views, locks during streaming, and labels history", async () => {
    let resolveAnswer!: (value: { content: string }) => void;
    const ask = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveAnswer = resolve;
        }),
    );
    render(<SilverFundAssistant adapter={{ connected: true, ask }} />);
    open();
    const selector = screen.getByRole("combobox", { name: "Fund" });
    expect(selector).toHaveTextContent("All Funds");
    await chooseFund("Quant");
    fireEvent.click(screen.getByRole("button", { name: "Expand assistant" }));
    expect(selector).toHaveTextContent("Quant");
    fireEvent.change(screen.getByRole("textbox", { name: "Your question" }), {
      target: { value: "My positions?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(selector).toBeDisabled();
    expect(ask).toHaveBeenCalledWith(
      "My positions?",
      expect.objectContaining({ fund: "quant" }),
    );
    resolveAnswer({ content: "Answer" });
    await waitFor(() => expect(selector).toBeEnabled());
    await chooseFund("Grad");
    expect(screen.getByText("You · Quant")).toBeVisible();
    expect(screen.getByText("Silver Fund · Quant")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Minimize assistant" }));
    expect(selector).toHaveTextContent("Grad");
  });

  it("retries with the original fund even after changing the selector", async () => {
    const ask = vi
      .fn()
      .mockRejectedValueOnce(new Error("Temporary error"))
      .mockResolvedValue({ content: "Answer" });
    render(<SilverFundAssistant adapter={{ connected: true, ask }} />);
    open();
    await chooseFund("Undergrad");
    fireEvent.change(screen.getByRole("textbox", { name: "Your question" }), {
      target: { value: "Holdings?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await screen.findByRole("alert");
    await chooseFund("Grad");
    fireEvent.click(
      screen.getByRole("button", { name: "Retry last question" }),
    );
    await screen.findByText("Answer");
    expect(ask.mock.calls[1][1].fund).toBe("undergrad");
  });
});

it("adapts financial starter questions to the selected scope without sending automatically", async () => {
  const ask = vi.fn().mockResolvedValue({ content: "Answer" });
  render(<SilverFundAssistant adapter={{ connected: true, ask }} />);
  open();
  expect(
    screen.getByRole("button", {
      name: "Which fund has the highest reported portfolio value?",
    }),
  ).toBeVisible();
  expect(
    screen.getByRole("group", { name: "Example questions" }),
  ).toBeVisible();
  expect(
    screen.queryByRole("button", { name: /latest dividend/ }),
  ).not.toBeInTheDocument();
  await chooseFund("Grad");
  expect(
    screen.getByRole("button", {
      name: "What was the latest dividend received by Grad?",
    }),
  ).toBeVisible();
  expect(
    screen.queryByRole("button", {
      name: "Which fund has the highest reported portfolio value?",
    }),
  ).not.toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", {
      name: "Which Grad holdings have the highest value?",
    }),
  );
  expect(screen.getByRole("textbox", { name: "Your question" })).toHaveValue(
    "Which Grad holdings have the highest value?",
  );
  expect(screen.getByRole("textbox", { name: "Your question" })).toHaveFocus();
  expect(ask).not.toHaveBeenCalled();
});

it("previews LaTeX and inserts it into the question without sending", async () => {
  const ask = vi.fn().mockResolvedValue({ content: "Answer" });
  render(<SilverFundAssistant adapter={{ connected: true, ask }} />);
  open();
  const question = screen.getByRole("textbox", {
    name: "Your question",
  }) as HTMLTextAreaElement;
  fireEvent.change(question, { target: { value: "Explain this equation:" } });
  question.setSelectionRange(question.value.length, question.value.length);
  fireEvent.click(screen.getByRole("button", { name: "Equation" }));
  const latex = screen.getByRole("textbox", { name: "LaTeX equation" });
  expect(latex).toHaveFocus();
  const formula = String.raw`\frac{r_p-r_f}{\sigma_p}`;
  fireEvent.change(latex, { target: { value: formula } });
  expect(
    screen.getByLabelText("Equation preview").querySelector(".katex"),
  ).not.toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Insert equation" }));
  const expected = `Explain this equation:\n\n\\[\n${formula}\n\\]\n\n`;
  expect(question).toHaveValue(expected);
  expect(ask).not.toHaveBeenCalled();
  await waitFor(() => expect(question).toHaveFocus());
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
  await screen.findByText("Answer");
  expect(ask).toHaveBeenCalledWith(expected.trim(), expect.any(Object));
  expect(
    screen
      .getByRole("article", { name: "Your question" })
      .querySelector(".katex"),
  ).not.toBeNull();
});

it("rejects invalid or oversized equations and lets the user cancel without losing the draft", () => {
  render(<SilverFundAssistant adapter={{ connected: true, ask: vi.fn() }} />);
  open();
  const question = screen.getByRole("textbox", { name: "Your question" });
  const draft = "a".repeat(3990);
  fireEvent.change(question, { target: { value: draft } });
  fireEvent.click(screen.getByRole("button", { name: "Equation" }));
  const insert = screen.getByRole("button", { name: "Insert equation" });
  expect(insert).toBeDisabled();
  const latex = screen.getByRole("textbox", { name: "LaTeX equation" });
  fireEvent.change(latex, { target: { value: String.raw`\frac{` } });
  expect(insert).toBeDisabled();
  expect(latex).toHaveAttribute("aria-invalid", "true");
  fireEvent.change(latex, { target: { value: "x+y" } });
  expect(screen.getByText(/would exceed/)).toBeVisible();
  expect(insert).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(question).toHaveValue(draft);
  expect(question).toHaveFocus();
});

it("scrolls on submission and large streamed updates, but respects scrolling up", async () => {
  let update: (answer: { content: string }) => void = () => {};
  let finish: (answer: { content: string }) => void = () => {};
  const ask = vi.fn().mockImplementation(
    (_question, options) =>
      new Promise((resolve) => {
        update = options.onUpdate;
        finish = resolve;
      }),
  );
  render(<SilverFundAssistant adapter={{ connected: true, ask }} />);
  open();
  const list = screen.getByRole("region", { name: "Messages" });
  let height = 1200;
  Object.defineProperties(list, {
    scrollHeight: { configurable: true, get: () => height },
    clientHeight: { configurable: true, value: 300 },
  });
  fireEvent.scroll(list, { target: { scrollTop: 0 } });
  fireEvent.change(screen.getByRole("textbox", { name: "Your question" }), {
    target: { value: "Question" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
  await waitFor(() => expect(list.scrollTop).toBe(1200));
  height = 2400;
  update({ content: "A large streamed answer" });
  await waitFor(() => expect(list.scrollTop).toBe(2400));
  fireEvent.scroll(list, { target: { scrollTop: 200 } });
  height = 3000;
  update({ content: "More of the streamed answer" });
  await screen.findByText("More of the streamed answer");
  expect(list.scrollTop).toBe(200);
  fireEvent.scroll(list, { target: { scrollTop: 2700 } });
  height = 3600;
  finish({ content: "Complete answer" });
  await screen.findByText("Complete answer");
  await waitFor(() => expect(list.scrollTop).toBe(3600));
});
