import { MetricCard } from "@/components/MetricCard";
import { getHeaderTooltip, getHeaderTooltips } from "@/lib/tabletooltips";
import type { FundMetrics } from "@/lib/types/fundMetrics";

interface MetricsRowProps {
  metrics: FundMetrics;
  mode: "realized" | "annualized";
}

export function MetricsRow({ metrics, mode }: MetricsRowProps) {
  const displayMetrics =
    mode === "annualized" ? metrics.annualized : metrics.realized;
  const isAnnualized = mode === "annualized";

  const sharedTooltips = getHeaderTooltips(isAnnualized, [
    "Value",
    "Volatility",
    "Sharpe Ratio",
    "Dividend Yield",
    "Dividends",
  ] as const);
  const averageReturnsTooltip = getHeaderTooltip(
    isAnnualized,
    "AverageReturns",
  );

  const metricsData = [
    {
      name: "Value",
      fund: metrics.value.fund,
      benchmark: metrics.value.benchmark,
      tooltip: sharedTooltips.Value,
    },
    {
      name: "Average Returns",
      fund: displayMetrics.returnMetric.fund,
      benchmark: displayMetrics.returnMetric.benchmark,
      tooltip: averageReturnsTooltip,
    },
    {
      name: "Volatility",
      fund: displayMetrics.volatility.fund,
      benchmark: displayMetrics.volatility.benchmark,
      tooltip: sharedTooltips.Volatility,
    },
    {
      name: "Sharpe Ratio",
      fund: displayMetrics.sharpeRatio.fund,
      benchmark: displayMetrics.sharpeRatio.benchmark,
      tooltip: sharedTooltips["Sharpe Ratio"],
    },
    {
      name: "Dividend Yield",
      fund: metrics.dividendYield.fund,
      benchmark: metrics.dividendYield.benchmark,
      tooltip: sharedTooltips["Dividend Yield"],
    },
    {
      name: "Dividends",
      fund: metrics.dividendValue.fund,
      benchmark: metrics.dividendValue.benchmark,
      tooltip: sharedTooltips.Dividends,
    },
  ];

  return (
    // The benchmark metrics switch from a horizontal card scroller on small screens to a grid on larger screens.
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-3 shadow-sm">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-700 sm:text-sm">
        Compared To Benchmark Metrics
      </h3>
      <div className="-mx-1 overflow-x-auto pb-1 sm:mx-0 sm:overflow-visible sm:pb-0">
        <div
          className="flex min-w-max gap-3 px-1 sm:grid sm:min-w-0 sm:px-0"
          style={{
            gridTemplateColumns: `repeat(${metricsData.length}, minmax(0, 1fr))`,
          }}
        >
          {metricsData.map((metric) => (
            <MetricCard
              key={metric.name}
              title={metric.name}
              value={metric.fund}
              benchmark={metric.benchmark}
              tooltip={metric.tooltip}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
