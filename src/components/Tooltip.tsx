"use client";

import * as React from "react";
import {
  Tooltip as TooltipRoot,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type Props = {
  trigger?: React.ReactNode;
  description: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
};

export default function Tooltip({
  trigger,
  description,
  side = "top",
  align = "center",
  className,
}: Props) {
  return (
    // This wrapper keeps simple tooltip usage consistent while still allowing interactive content like guide links.
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <span className="inline-flex flex-wrap items-center justify-center gap-1 cursor-help whitespace-normal text-center">
            {trigger}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={[
            "pointer-events-auto max-w-xs whitespace-normal border border-gray-200 bg-white px-2 py-1.5 text-left text-xs normal-case tracking-normal text-gray-900 shadow-md",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          {description}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
