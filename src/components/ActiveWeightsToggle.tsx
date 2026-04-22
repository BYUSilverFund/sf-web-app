"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MetricToggleSwitch } from "@/components/ui/MetricToggleSwitch";

export function ActiveWeightsToggle({
  activeRates,
  setActiveRates,
}: {
  activeRates: boolean;
  setActiveRates: (value: boolean) => void;
}) {
  return (
    // The active-weight toggle only appears on portfolio tabs, so its copy stays portfolio-specific.
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 rounded border border-gray-300 bg-white px-2 py-1.5">
            <span
              className={`text-sm transition-colors ${
                !activeRates ? "text-[#002E5D] font-medium" : "text-gray-400"
              }`}
            >
              Total
            </span>
            <MetricToggleSwitch
              checked={activeRates}
              onCheckedChange={setActiveRates}
            />
            <span
              className={`text-sm transition-colors ${
                activeRates ? "text-[#002E5D] font-medium" : "text-gray-400"
              }`}
            >
              Active Weights
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border border-gray-200 bg-white px-2 py-1.5 text-left text-xs normal-case tracking-normal text-gray-900 shadow-md"
        >
          {activeRates
            ? "Viewing active weights: Metrics adjusted by subtracting IWV values."
            : "Viewing total weights: Raw metric values without IWV adjustments."}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
