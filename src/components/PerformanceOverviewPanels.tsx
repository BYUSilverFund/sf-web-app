import type { ReactNode } from "react";

import { AllFundsSummary } from "@/components/AllFundsSummary";
import { TopHoldingsSummary } from "@/components/TopHoldingsSummary";
import {
  PERFORMANCE_PAGE_LAYOUT,
  PerformanceChartCard,
} from "@/components/PerformancePageLayout";
import type {
  AllHoldingsSummaryResponse,
  AllPortfoliosSummaryResponse,
} from "@/lib/types";

export function PerformanceGraphPanel({
  children,
  className,
  height = PERFORMANCE_PAGE_LAYOUT.graphPanelHeight,
  width,
}: {
  children: ReactNode;
  className?: string;
  height?: number | string;
  width?: number | string;
}) {
  return (
    // This wrapper keeps the main overview page on the same sizing contract as the shared chart card.
    <PerformanceChartCard className={className} height={height} width={width}>
      {children}
    </PerformanceChartCard>
  );
}

export function PerformanceSummaryPanel({
  isAllFunds,
  fund,
  loading = false,
  allPortfoliosSummary,
  allHoldingsSummary,
  onPortfolioSelect,
  className,
  height = PERFORMANCE_PAGE_LAYOUT.graphPanelHeight,
  width,
}: {
  isAllFunds: boolean;
  fund: string;
  loading?: boolean;
  allPortfoliosSummary: AllPortfoliosSummaryResponse | undefined;
  allHoldingsSummary: AllHoldingsSummaryResponse | undefined;
  onPortfolioSelect?: (portfolio: string) => void;
  className?: string;
  height?: number | string;
  width?: number | string;
}) {
  if (isAllFunds) {
    return (
      // The all-funds landing state shows portfolio-level summaries in the right rail.
      <AllFundsSummary
        allPortfoliosSummary={allPortfoliosSummary}
        loading={loading}
        onPortfolioSelect={onPortfolioSelect}
        className={className}
        height={height}
        width={width}
      />
    );
  }

  return (
    // Portfolio tabs reuse the same slot, but swap in the holdings summary instead.
    <TopHoldingsSummary
      fund={fund}
      allHoldingsSummary={allHoldingsSummary}
      loading={loading}
      className={className}
      height={height}
      width={width}
    />
  );
}
