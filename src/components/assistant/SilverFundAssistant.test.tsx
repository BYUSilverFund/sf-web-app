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
