import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardHeightProps = {
  children: ReactNode;
  fillViewport?: boolean;
};

export function DashboardWrapper({
  children,
  fillViewport = true,
}: DashboardHeightProps) {
  return (
    // Dashboard pages can fill the viewport or grow naturally, but both paths now share the same outer wrapper.
    <div
      className={cn(
        "w-full flex flex-col",
        fillViewport ? "md:h-[calc(100vh-100px)]" : "h-auto",
      )}
    >
      <div
        className={cn("flex flex-col gap-4", fillViewport && "flex-1 min-h-0")}
      >
        {children}
      </div>
    </div>
  );
}
