import { useState } from "react";
import katex from "katex";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function EquationEditor({
  onInsert,
  onCancel,
  available,
}: {
  onInsert: (formula: string) => void;
  onCancel: () => void;
  available: number;
}) {
  const [formula, setFormula] = useState("");
  let preview = "";
  let invalid = false;
  if (formula.trim()) {
    try {
      preview = katex.renderToString(formula, {
        displayMode: true,
        throwOnError: true,
        trust: false,
        maxExpand: 1000,
        maxSize: 8,
      });
    } catch {
      invalid = true;
    }
  }
  const tooLong = formula.trim().length + 10 > available;
  return (
    <section
      className="sf-equation-editor"
      aria-label="Equation editor"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          onCancel();
        }
      }}
    >
      <Label htmlFor="sf-latex">LaTeX equation</Label>
      <p id="sf-latex-help">
        Type LaTeX without delimiters, then insert it into your question.
      </p>
      <textarea
        id="sf-latex"
        autoFocus
        rows={2}
        maxLength={2000}
        value={formula}
        onChange={(event) => setFormula(event.target.value)}
        placeholder={String.raw`\frac{r_p - r_f}{\sigma_p}`}
        aria-describedby="sf-latex-help sf-latex-status"
        aria-invalid={invalid || tooLong}
      />
      <div className="sf-latex-preview" aria-label="Equation preview">
        {preview ? (
          <div dangerouslySetInnerHTML={{ __html: preview }} />
        ) : (
          <span>Equation preview</span>
        )}
      </div>
      <p id="sf-latex-status" role="status">
        {invalid
          ? "Check your LaTeX syntax to see a preview."
          : tooLong
            ? "This equation would exceed the question’s 4,000-character limit."
            : ""}
      </p>
      <div className="sf-equation-actions">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!preview || tooLong}
          onClick={() => onInsert(formula.trim())}
        >
          Insert equation
        </Button>
      </div>
    </section>
  );
}
