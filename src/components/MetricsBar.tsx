"use client";

import { cn } from "@/lib/utils";

export function MetricsBar({ embedded = false }: { embedded?: boolean }) {
  return (
    // Metric cards intentionally use annualized, total-weight values without mode controls.
    <div
      className={cn(
        "mb-0 flex min-h-[65px] flex-wrap items-center gap-3 bg-white p-3",
        embedded ? "rounded-t-lg" : "border border-gray-300 rounded shadow-sm",
      )}
    >
      <div className="flex w-full items-center">
        <h2 className="text-lg font-bold">Metrics</h2>
      </div>
    </div>
  );
}
