import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Answer } from "./Answer";

afterEach(cleanup);
it("renders the API's display equation with adjacent prose, a trailing citation, and inline dollar math", () => {
  const { container } = render(
    <Answer
      content={String.raw`The equation for tracking error is given by:
$$\sigma\_{a,i} = \sqrt{\text{Var}[r_i - r_b]}.$$ [4]
This compares the fund ($r_i$) and benchmark ($r_b$).`}
    />,
  );
  expect(container.querySelectorAll(".katex")).toHaveLength(3);
  expect(container.querySelectorAll(".katex-display")).toHaveLength(1);
  expect(container.querySelector(".katex-error")).toBeNull();
  expect(container.textContent).toContain("[4]");
  expect(container.querySelector("annotation")?.textContent).toBe(
    String.raw`\sigma_{a,i} = \sqrt{\text{Var}[r_i - r_b]}.`,
  );
});
it("preserves currency and code containing math delimiters", () => {
  const { container } = render(
    <Answer
      content={
        "Costs $100 and $200; $5.50 each. Use `$r_i$`.\n\n```tex\n$$x^2$$\n```"
      }
    />,
  );
  expect(container.querySelector(".katex")).toBeNull();
  expect(container.textContent).toContain("Costs $100 and $200; $5.50 each.");
  expect(screen.getByText("$$x^2$$")).toBeInTheDocument();
});
it("supports bracket and parenthesis delimiters, multiline equations, and multiple display expressions", () => {
  const { container } = render(
    <Answer
      content={String.raw`Inline \(x_i\).
\[
x^2 + y^2
\] [2]
And $$z^2$$ [3]`}
    />,
  );
  expect(container.querySelectorAll(".katex")).toHaveLength(3);
  expect(container.querySelectorAll(".katex-display")).toHaveLength(2);
});
it("leaves an incomplete streamed equation as text until its closing delimiter arrives", () => {
  const { container, rerender } = render(
    <Answer content={String.raw`Answer: $$\sigma_i`} />,
  );
  expect(container.querySelector(".katex")).toBeNull();
  rerender(<Answer content={String.raw`Answer: $$\sigma_i$$ [1]`} />);
  expect(container.querySelector(".katex")).not.toBeNull();
});

it("aligns financial table values without changing precision, units or prose", () => {
  const { container } = render(
    <Answer
      content={
        "| Fund | Reported value | Return |\n| --- | --- | --- |\n| Grad | 1,926,941.8800 | -2.50% |\n| Quant | unavailable | 0.00% |\n\nAs of November 11. Currency not specified."
      }
    />,
  );
  expect(screen.getByText("1,926,941.8800")).toHaveClass("sf-numeric");
  expect(screen.getByText("-2.50%")).toHaveClass("sf-numeric");
  expect(screen.getByText("unavailable")).not.toHaveClass("sf-numeric");
  expect(container.textContent).toContain("Currency not specified.");
  expect(container.textContent).not.toContain("$");
});
