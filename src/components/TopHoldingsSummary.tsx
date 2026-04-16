import Link from "next/link";
import { ChevronsRight } from "lucide-react";

import type { AllHoldingsSummaryResponse } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

export function TopHoldingsSummary({
  fund,
  allHoldingsSummary,
  loading = false,
  className,
  height,
  width,
}: {
  fund: string;
  allHoldingsSummary: AllHoldingsSummaryResponse | undefined;
  loading?: boolean;
  className?: string;
  height?: number | string;
  width?: number | string;
}) {
  if (loading || !allHoldingsSummary) {
    return (
      // This skeleton keeps the holdings summary on the same fixed-height contract as the graph.
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden rounded border border-gray-300 bg-white px-4 py-3",
          className,
        )}
        style={{ height, width }}
      >
        <div className="mb-1.5 h-7 w-32 rounded bg-gray-100 animate-pulse" />
        <div className="flex min-h-0 flex-1 flex-col">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-gray-200 py-1.5 last:border-b-0"
            >
              <div className="h-4 w-14 rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-20 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="mt-1.5 border-t border-gray-200 pt-1">
          <div className="flex items-center justify-center">
            <div className="h-4 w-32 rounded bg-gray-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const holdings = allHoldingsSummary.holdings.filter(
    (holding) => holding.active,
  );
  const topHoldings = holdings.slice(0, 10);
  const holdingsLabel = topHoldings.length === 1 ? "Holding" : "Holdings";

  return (
    // Portfolio tabs reuse the overview summary slot to show the current fund's top holdings.
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded border border-gray-300 bg-white px-4 py-3",
        className,
      )}
      style={{ height, width }}
    >
      <h2 className="mb-1.5 text-lg font-bold">
        Top {topHoldings.length} {holdingsLabel}
      </h2>

      <div className="flex min-h-0 flex-1 flex-col">
        {topHoldings.map((holding) => {
          return (
            <Link
              key={holding.ticker}
              href={`/performance/${fund}/${holding.ticker}`}
              className="flex items-center justify-between border-b border-gray-200 py-1.5 last:border-b-0 hover:bg-gray-50"
            >
              <div className="text-[15px] font-bold text-[#002E5D]">
                {holding.ticker}
              </div>
              <div className="text-right">
                <div className="text-[15px] font-semibold text-gray-900">
                  {formatCurrency(holding.value)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-1.5 border-t border-gray-200 pt-1">
        <Link
          href={`/performance/${fund}/all-holdings`}
          className="flex items-center justify-center gap-1 text-[15px] text-[#002E5D] hover:underline"
        >
          <span>View all holdings</span>
          <ChevronsRight size={16} />
        </Link>
      </div>
    </div>
  );
}
