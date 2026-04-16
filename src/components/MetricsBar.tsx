"use client";

import { ActiveWeightsToggle } from "@/components/ActiveWeightsToggle";
import { MetricModeToggle } from "@/components/MetricModeToggle";
import { cn } from "@/lib/utils";

export function MetricsBar({
  metricMode,
  setMetricMode,
  activeRates,
  setActiveRates,
  activeTab,
  embedded = false,
}: {
  metricMode: "realized" | "annualized";
  setMetricMode: (mode: "realized" | "annualized") => void;
  activeRates: boolean;
  setActiveRates: (value: boolean) => void;
  activeTab: string;
  embedded?: boolean;
}) {
  const isAllFunds = activeTab === "all_funds";

  return (
    // The shared metrics header owns the mode toggles while the cards below stay data-focused.
    <div
      className={cn(
        "mb-0 flex min-h-[65px] flex-wrap items-center gap-3 bg-white p-3",
        embedded ? "rounded-t-lg" : "border border-gray-300 rounded shadow-sm",
      )}
    >
      <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-lg font-bold">Metrics</h2>

        <div className="flex flex-wrap items-center gap-3">
          <MetricModeToggle
            metricMode={metricMode}
            setMetricMode={setMetricMode}
          />
          {!isAllFunds && (
            <ActiveWeightsToggle
              activeRates={activeRates}
              setActiveRates={setActiveRates}
            />
          )}
        </div>
      </div>
    </div>
  );
}
