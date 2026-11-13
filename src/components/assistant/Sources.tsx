import { ChevronDown, ExternalLink } from "lucide-react";
import type { AssistantSource } from "@/lib/assistant/adapter";
import { Answer } from "./Answer";

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

/** Native disclosure keeps evidence accessible without overwhelming the answer. */
export function Sources({ sources }: { sources: AssistantSource[] }) {
  return (
    <details className="sf-sources">
      <summary>
        <span>Show sources ({sources.length})</span>
        <ChevronDown aria-hidden="true" className="sf-source-chevron" />
      </summary>
      <div className="sf-source-list">
        {sources.map((source, index) => (
          <div className="sf-source-card" key={index}>
            <div className="sf-source-heading">
              <strong>
                {source.citation ? `[${source.citation}] ` : ""}
                {source.documentName}
              </strong>
            </div>
            {source.pages && (
              <p className="sf-source-pages">
                PDF pages {source.pages.start}
                {source.pages.end && source.pages.end !== source.pages.start
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
                Open original page <ExternalLink aria-hidden="true" />
                <span className="sr-only">(new tab)</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </details>
  );
}
