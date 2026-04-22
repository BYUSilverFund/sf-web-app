import { MetricCard } from "@/components/MetricCard";
import { getHeaderTooltips } from "@/lib/tabletooltips";
import type { FundMetrics } from "@/lib/types/fundMetrics";

interface RiskMetricsProps {
  metrics: FundMetrics;
  mode: "realized" | "annualized";
}

export function RiskMetrics({ metrics, mode }: RiskMetricsProps) {
  const displayMetrics =
    mode === "annualized" ? metrics.annualized : metrics.realized;
  const isAnnualized = mode === "annualized";
  const tooltips = getHeaderTooltips(isAnnualized, [
    "Alpha",
    "Beta",
    "Tracking Error",
    "Information Ratio",
  ] as const);

  return (
    // Risk metrics follow the same mobile scrolling pattern as the benchmark metrics to keep cards readable.
    <div className="rounded-lg bg-white px-3 py-3">
      <h3 className="border-b mb-2 text-xs font-semibold uppercase tracking-wider text-gray-700 sm:text-sm">
        Relative Risk Metrics
      </h3>

      <div className="-mx-1 overflow-x-auto pb-1 sm:mx-0 sm:overflow-visible sm:pb-0">
        <div
          className="flex min-w-max gap-3 px-1 sm:grid sm:min-w-0 sm:px-0"
          style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
        >
          {[
            { name: "Alpha", value: displayMetrics.alpha },
            { name: "Beta", value: metrics.beta },
            { name: "Tracking Error", value: displayMetrics.trackingError },
            {
              name: "Information Ratio",
              value: displayMetrics.informationRatio,
            },
          ].map((metric) => (
            <MetricCard
              key={metric.name}
              title={metric.name}
              value={metric.value}
              tooltip={tooltips[metric.name as keyof typeof tooltips]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
