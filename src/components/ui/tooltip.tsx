"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const Tooltip = TooltipPrimitive.Root;
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipPortal = TooltipPrimitive.Portal;

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof TooltipPrimitive.Content>
>(({ className, side = "top", align = "center", ...props }, ref) => (
  <TooltipPortal>
    <TooltipPrimitive.Content
      ref={ref}
      side={side}
      align={align}
      className={cn(
        "z-50 rounded-md border border-border bg-background px-2 py-1.5 text-xs text-muted-foreground shadow-md",
        className
      )}
      {...props}
    >
      {props.children}
      <TooltipPrimitive.Arrow className="fill-background" />
    </TooltipPrimitive.Content>
  </TooltipPortal>
));
TooltipContent.displayName = "TooltipContent";

export {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
};

export default Tooltip;
