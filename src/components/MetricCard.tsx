import { type ReactNode } from "react";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function TitleWithTooltip({
  title,
  tooltip,
}: {
  title: string;
  tooltip?: ReactNode;
}) {
  if (!tooltip) {
    return <span>{title}</span>;
  }

  const normalizedTitle = title.trim().toUpperCase();
  const forceSecondLineWithIcon =
    normalizedTitle === "AVERAGE RETURNS" ||
    normalizedTitle === "INFORMATION RATIO";

  const titleWords = title.trim().split(/\s+/);
  const firstLine = titleWords[0] ?? title;
  const secondLine = titleWords.slice(1).join(" ");

  // For normal layout: bind icon to last word
  const words = title.trim().split(/\s+/);
  const lastWord = words.pop();
  const rest = words.join(" ");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {forceSecondLineWithIcon ? (
            <span className="inline-block cursor-help leading-tight text-center">
              <span className="block">{firstLine}</span>

              <span className="block">
                <span className="whitespace-nowrap inline-flex items-center">
                  {secondLine}
                  <InfoIcon className="ml-0.5 h-3 w-3 text-muted-foreground" />
                </span>
              </span>
            </span>
          ) : (
            <span className="inline leading-tight cursor-help text-center">
              <span className="whitespace-normal break-words">
                {rest && `${rest} `}
                <span className="whitespace-nowrap inline-flex items-center">
                  {lastWord}
                  <InfoIcon className="ml-0.5 h-3 w-3 text-muted-foreground" />
                </span>
              </span>
            </span>
          )}
        </TooltipTrigger>

        <TooltipContent
          side="top"
          className="border border-gray-200 bg-white px-2 py-1.5 text-left text-xs normal-case tracking-normal text-gray-900 shadow-md"
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function MetricCard({
  title,
  value,
  benchmark,
  tooltip,
}: {
  title: string;
  value: string;
  benchmark?: string | null;
  tooltip?: ReactNode;
}) {
  return (
    <div className="flex min-h-[94px] w-[160px] shrink-0 snap-start flex-col rounded border border-gray-200 bg-gray-50 px-2 py-2 text-center sm:w-full sm:min-w-0 lg:min-h-[100px]">
      <div className="flex min-h-[28px] items-start justify-center text-[10px] font-semibold uppercase tracking-[0.06em] text-gray-500 sm:min-h-[32px] sm:text-[11px]">
        <TitleWithTooltip title={title} tooltip={tooltip} />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="leading-none text-[clamp(0.9rem,1.35vw,1.18rem)] font-bold text-gray-900">
          {value}
        </div>
      </div>

      <div className="flex min-h-[16px] items-end justify-center text-[10px] text-gray-400 sm:text-[11px]">
        {benchmark ? `Benchmark ${benchmark}` : "\u00A0"}
      </div>
    </div>
  );
}
