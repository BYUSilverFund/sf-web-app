import { formatPercent, formatCurrency, formatPortfolio } from "@/lib/utils";
import { AllPortfoliosSummaryResponse } from "@/lib/types";
import Link from "next/link";
import { ChevronsRight } from "lucide-react";

export function AllPortfoliosSummaryTable({
  allPortfoliosSummary,
}: {
  allPortfoliosSummary: AllPortfoliosSummaryResponse | undefined;
}) {
  return (
    <div className="flex flex-col">
      {allPortfoliosSummary && (
        <>
          <div className="text-center border-b-2 border-solid">
            Portfolios
          </div>

          {allPortfoliosSummary.portfolios.map((portfolio, index) => (
            <Link
              key={index}
              className="flex justify-between px-4 hover:bg-secondary py-2"
              href={`/performance/${portfolio.portfolio}`}
            >
              <div>{formatPortfolio(portfolio.portfolio)}</div>
              <div className="flex flex-col text-right">
                <div>{formatCurrency(portfolio.value)}</div>
                <div>{formatPercent(portfolio.total_return)}</div>
              </div>
            </Link>
          ))}
          <Link href="/performance/all-portfolios">
            <div className="text-center py-4 bg-secondary flex items-center justify-center gap-2">
              <span className="underline">View All</span>
              <ChevronsRight size={18} />
            </div>
          </Link>
        </>
      )}
    </div>
  );
}
