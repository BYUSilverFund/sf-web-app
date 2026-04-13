import Link from "next/link";
import { ChevronsRight } from "lucide-react";

import type { AllPortfoliosSummaryResponse } from "@/lib/types";
import { cn, formatCurrency, formatPortfolio } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AllFundsSummary({
  allPortfoliosSummary,
  loading = false,
  onPortfolioSelect,
  className,
  height,
  width,
}: {
  allPortfoliosSummary: AllPortfoliosSummaryResponse | undefined;
  loading?: boolean;
  onPortfolioSelect?: (portfolio: string) => void;
  className?: string;
  height?: number | string;
  width?: number | string;
}) {
  if (loading || !allPortfoliosSummary) {
    return (
      // The loading state mirrors the final summary card so the right rail does not jump on load.
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden rounded border border-gray-300 bg-white px-5 py-4",
          className,
        )}
        style={{ height, width }}
      >
        <div className="mb-3 h-8 w-28 rounded bg-gray-100 animate-pulse" />
        <div className="flex min-h-0 flex-1 flex-col">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-gray-200 py-2.5 last:border-b-0"
            >
              <div className="h-5 w-24 rounded bg-gray-100 animate-pulse" />
              <div className="space-y-1.5 text-right">
                <div className="h-5 w-24 rounded bg-gray-100 animate-pulse" />
                <div className="h-4 w-14 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center border-t border-gray-200 pt-2">
          <div className="h-5 w-32 rounded bg-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    // The all-funds summary stays in the shared overview slot and deep-links into fund tabs.
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded border border-gray-300 bg-white px-5 py-4",
        className,
      )}
      style={{ height, width }}
    >
      <h2 className="mb-3 text-xl font-bold">All Funds</h2>

      <div className="flex min-h-0 flex-1 flex-col">
        {allPortfoliosSummary.portfolios.map((portfolio) => (
          <Button
            key={portfolio.portfolio}
            asChild
            variant="ghost"
            className="h-auto justify-between rounded-none border-b border-gray-200 px-0 py-2.5 last:border-b-0 hover:bg-gray-50"
          >
            <Link
              href={`/performance?tab=${portfolio.portfolio}`}
              onClick={() => onPortfolioSelect?.(portfolio.portfolio)}
            >
              <div className="text-sm font-bold text-[#002E5D]">
                {formatPortfolio(portfolio.portfolio) ?? portfolio.portfolio}
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(portfolio.value)}
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-2">
        <Link
          href="/performance/all-portfolios"
          className="text-sm text-[#002E5D] hover:underline flex items-center justify-center gap-1"
        >
          <span>View all portfolios</span>
          <ChevronsRight size={18} />
        </Link>
      </div>
    </div>
  );
}
