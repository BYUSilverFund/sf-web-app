import {
  formatPercent,
  formatCurrency,
  formatPortfolio,
} from "@/lib/utils";
import { AllPortfoliosSummaryResponse } from "@/lib/types";

import Link from "next/link";

export function AllPortfoliosSummaryTable({
  allPortfoliosSummary,
}: {
  allPortfoliosSummary: AllPortfoliosSummaryResponse;
}) {
  return (
    <div className="flex flex-col">
      <div className="text-center py-4 border-b border-solid">Portfolios</div>
      {allPortfoliosSummary.portfolios.map((portfolio, index) => (
        <Link key={index} className="flex justify-between px-4 hover:bg-secondary py-2" href={`/performance/${portfolio.portfolio}`}>
          <div>{formatPortfolio(portfolio.portfolio)}</div>
          <div className="flex flex-col text-right">
            <div>{formatCurrency(portfolio.value)}</div>
            <div>{formatPercent(portfolio.total_return)}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
