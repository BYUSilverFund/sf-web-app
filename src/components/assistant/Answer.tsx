import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Fragment } from "react";
import { MathFormula } from "@/components/MathFormula";

// Remove Markdown's escaped underscores only inside TeX, where they mean subscripts.
const tex = (formula: string) => formula.replace(/\\_/g, "_");

// Dollar math must start with a non-numeric, non-whitespace character so that
// ordinary currency such as "$100 and $200" remains text.
function inline(text: string) {
  return text
    .split(
      /(\\\([\s\S]*?\\\)|\*\*[^*]+\*\*|`[^`]+`|(?<![\\$])\$(?![\s$\d])[^$\n]*?[^\s\\$]\$(?!\$)|(?<![\\$])\$[^\s$\d]\$(?!\$)|\[[^\]]+\]\(https?:\/\/[^)]+\))/g,
    )
    .map((part, i) => {
      if (part.startsWith("\\("))
        return (
          <MathFormula
            key={i}
            formula={tex(part.slice(2, -2))}
            display={false}
          />
        );
      if (/^\$(?![\s$\d])[^$\n]+\$$/.test(part))
        return (
          <MathFormula
            key={i}
            formula={tex(part.slice(1, -1))}
            display={false}
          />
        );
      if (part.startsWith("**"))
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
      if (link)
        return (
          <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer">
            {link[1]}
          </a>
        );
      if (part.startsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
      return <Fragment key={i}>{part}</Fragment>;
    });
}
const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());

type AnswerBlock = { kind: "text" | "math" | "code"; content: string };

function blocks(content: string): AnswerBlock[] {
  const result: AnswerBlock[] = [];
  // Match code first so that math examples inside code remain literal.
  const tokens =
    /```[\s\S]*?(?:```|$)|`[^`\n]+`|\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]/g;
  let start = 0;
  const text = (value: string) => {
    for (const paragraph of value.split(/\n\s*\n/))
      if (paragraph.trim()) result.push({ kind: "text", content: paragraph });
  };
  for (const match of content.matchAll(tokens)) {
    const token = match[0];
    if (token.startsWith("`") && !token.startsWith("```")) continue;
    text(content.slice(start, match.index));
    result.push(
      token.startsWith("```")
        ? { kind: "code", content: token }
        : { kind: "math", content: token.slice(2, -2) },
    );
    start = match.index! + token.length;
  }
  text(content.slice(start));
  return result;
}

/** Safe text-only Markdown subset with code-aware display and inline TeX. */
export function Answer({ content }: { content: string }) {
  return (
    <div className="sf-answer">
      {blocks(content).map(({ kind, content: block }, i) => {
        if (kind === "math")
          return (
            <div className="sf-equation" key={i}>
              <MathFormula formula={tex(block)} />
            </div>
          );
        const lines = block.split("\n");
        if (block.startsWith("```"))
          return (
            <pre key={i}>
              <code>
                {lines
                  .slice(1, lines.at(-1) === "```" ? -1 : undefined)
                  .join("\n")}
              </code>
            </pre>
          );
        if (/^#{1,6} /.test(block))
          return <h3 key={i}>{inline(block.replace(/^#{1,6} /, ""))}</h3>;
        if (lines.every((line) => /^[-*] /.test(line)))
          return (
            <ul key={i}>
              {lines.map((line, j) => (
                <li key={j}>{inline(line.slice(2))}</li>
              ))}
            </ul>
          );
        if (lines.every((line) => /^\d+\. /.test(line)))
          return (
            <ol key={i}>
              {lines.map((line, j) => (
                <li key={j}>{inline(line.replace(/^\d+\. /, ""))}</li>
              ))}
            </ol>
          );
        if (lines.length > 1 && /^\|?\s*:?-{3,}/.test(lines[1])) {
          return (
            <div
              key={i}
              className="sf-table-scroll"
              role="region"
              aria-label="Answer table"
              tabIndex={0}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    {cells(lines[0]).map((cell, j) => (
                      <TableHead key={j} scope="col">
                        {inline(cell)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.slice(2).map((line, j) => (
                    <TableRow key={j}>
                      {cells(line).map((cell, k) => (
                        <TableCell
                          key={k}
                          className={
                            /^[($€£+−-]?[\d,.]+(?:%|\))?$/.test(
                              cell.replace(/\*\*/g, "").trim(),
                            )
                              ? "sf-numeric"
                              : undefined
                          }
                        >
                          {inline(cell)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        }
        return <p key={i}>{inline(block)}</p>;
      })}
    </div>
  );
}
