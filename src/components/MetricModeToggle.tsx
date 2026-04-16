"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MetricToggleSwitch } from "@/components/ui/MetricToggleSwitch";

export function MetricModeToggle({
  metricMode,
  setMetricMode,
}: {
  metricMode: "realized" | "annualized";
  setMetricMode: (mode: "realized" | "annualized") => void;
}) {
  const checked = metricMode === "annualized";

  return (
    // This toggle maps the boolean switch control back onto the realized/annualized labels users see.
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 rounded border border-gray-300 bg-white px-2 py-1.5">
            <span
              className={`text-sm transition-colors ${
                metricMode === "realized"
                  ? "text-[#002E5D] font-medium"
                  : "text-gray-400"
              }`}
            >
              Realized
            </span>
            <MetricToggleSwitch
              checked={checked}
              onCheckedChange={(nextChecked) =>
                setMetricMode(nextChecked ? "annualized" : "realized")
              }
            />
            <span
              className={`text-sm transition-colors ${
                metricMode === "annualized"
                  ? "text-[#002E5D] font-medium"
                  : "text-gray-400"
              }`}
            >
              Annualized
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border border-gray-200 bg-white px-2 py-1.5 text-left text-xs normal-case tracking-normal text-gray-900 shadow-md"
        >
          {metricMode === "realized"
            ? "Viewing realized metrics: Actual performance values for the selected time period."
            : "Viewing annualized metrics: Performance values scaled to annual terms for year-over-year comparison."}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
