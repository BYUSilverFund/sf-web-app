import { formatPercent, formatCurrency } from "@/lib/utils";
import { AllHoldingsSummaryResponse } from "@/lib/types";
import { ChevronsRight } from "lucide-react";

import Link from "next/link";

export function AllHoldingsSummaryTable({
  fund,
  allHoldingsSummary,
}: {
  fund: string;
  allHoldingsSummary: AllHoldingsSummaryResponse | undefined;
}) {
  if (!allHoldingsSummary) return "";

  const displayCount =
    allHoldingsSummary.holdings.length < 8
      ? allHoldingsSummary.holdings.length
      : 8;

  return (
    <div className="flex flex-col">
      <div className="text-center border-b-2 border-solid">
        Top {displayCount} by Value
      </div>

      {allHoldingsSummary.holdings
        // .filter((a) => a.active) # TODO: fix
        .slice(0, 8)
        .map((holding, index) => (
          <Link
            key={index}
            className="flex justify-between px-4 hover:bg-secondary py-2"
            href={`/performance/${fund}/${holding.ticker}`}
          >
            <div>{holding.ticker}</div>
            <div className="flex flex-col text-right">
              <div>{formatCurrency(holding.value)}</div>
              <div>{formatPercent(holding.total_return)}</div>
            </div>
          </Link>
        ))}
      <Link href={`${fund}/all-holdings`}>
        <div className="text-center flex items-center justify-center gap-1 hover:bg-secondary mb-2">
          <span>View All</span>
          <ChevronsRight size={18} />
        </div>
      </Link>
    </div>
  );
}
