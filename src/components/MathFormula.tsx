"use client";

import katex from "katex";
import "katex/dist/katex.min.css";

type MathFormulaProps = {
  formula: string;
  display?: boolean;
  className?: string;
};

export function MathFormula({
  formula,
  display = true,
  className,
}: MathFormulaProps) {
  const html = katex.renderToString(formula, {
    displayMode: display,
    throwOnError: false,
  });

  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
