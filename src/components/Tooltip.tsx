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
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help whitespace-nowrap">
            {trigger}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={className}
          onClick={(e) => e.stopPropagation()}
        >
          {description}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
