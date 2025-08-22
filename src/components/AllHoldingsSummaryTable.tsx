import {
  formatPercent,
  formatCurrency,
} from "@/lib/utils";
import { AllHoldingsSummaryResponse } from "@/lib/types";

import Link from "next/link";

export function AllHoldingsSummaryTable({
  fund,
  allHoldingsSummary,
}: {
  fund: string
  allHoldingsSummary: AllHoldingsSummaryResponse;
}) {
  console.log(allHoldingsSummary)
  return (
    <div className="flex flex-col">
      <div className="text-center py-4 border-b border-solid">Top 5 Holdings by Value</div>
      <Link href={`${fund}/all-holdings`}>
        <div className="text-center py-4 bg-secondary">View All</div>
      </Link>
      {allHoldingsSummary.holdings
      .filter((a) => a.active)
      .slice(0, 5)
      .map((holding, index) => (
        <Link key={index} className="flex justify-between px-4 hover:bg-secondary py-2" href={`/performance/${fund}/${holding.ticker}`}>
          <div>{holding.ticker}</div>
          <div className="flex flex-col text-right">
            <div>{formatCurrency(holding.value)}</div>
            <div>{formatPercent(holding.total_return)}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
