"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const Tooltip = ({ children, openOnClick = false, ...props }: any) => {
  const [open, setOpen] = React.useState(false);

  const childrenWithClick = React.Children.map(children, (child: any) => {
    if (!React.isValidElement(child)) return child;
    if (child.type === TooltipTrigger && openOnClick) {
      const userOnClick = (child.props as any)?.onClick;
      return React.cloneElement(child as any, {
        onClick: (e: any) => {
          userOnClick?.(e);
          setOpen((o: boolean) => !o);
        },
      });
    }
    return child;
  });

  if (openOnClick) {
    return (
      // Click-to-open tooltips need controlled state so the trigger can toggle them explicitly.
      <TooltipPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
        {childrenWithClick}
      </TooltipPrimitive.Root>
    );
  }

  return (
    // Standard hover tooltips are left uncontrolled so Radix can manage pointer interactions normally.
    <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
  );
};
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
        "z-50 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-left text-xs normal-case tracking-normal text-gray-900 shadow-md",
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
