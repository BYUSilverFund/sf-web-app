"use client";

import * as React from "react";
import {
  Tooltip as TooltipRoot,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type Props = {
  icon?: React.ReactNode;
  description: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
};

export default function Tooltip({
  icon,
  description,
  side = "top",
  align = "center",
  className,
}: Props) {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="info"
            className="text-sm text-muted-foreground"
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className={className}>
          {description}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
