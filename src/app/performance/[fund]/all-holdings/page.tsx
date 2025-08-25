'use client'
import { AllHoldingsDataTable } from "@/components/AllHoldingsDataTable";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { getAllHoldingsSummary } from "@/lib/api/allHoldings";
import { AllHoldingsSummaryResponse, PortfolioRequest } from "@/lib/types";
import { defaultEnd, defaultStart, formatDate, formatPortfolio } from "@/lib/utils";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [start, setStart] = useState<Date>(defaultStart());
  const [end, setEnd] = useState<Date>(defaultEnd());
  const [allHoldingsSummary, setAllHoldingsSummary] =
    useState<AllHoldingsSummaryResponse>();

  const params = useParams<{ fund: string }>();

  useEffect(() => {
    if (start && end) {
      const portfolioRequest: PortfolioRequest = {
        fund: params.fund,
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      getAllHoldingsSummary(portfolioRequest)
        .then(setAllHoldingsSummary)
        .catch(console.error);
    }
  }, [start, end, params.fund]);

  const pages = [
    {
      name: 'All Funds',
      href: '/performance'
    },
    {
      name: formatPortfolio(params.fund),
      href: `/performance/${params.fund}`
    }
  ]

  return (
    <div className="px-24">
      {allHoldingsSummary && (
        <div className="space-y-4 p-4">
          <Breadcrumbs pages={pages} currentPage="All Holdings"/>
          {/* Row 1 */}
          <Card className="flex p-4 gap-2 items-center">
            <ViewButton start={start} end={end} setStart={setStart} setEnd={setEnd} />
            <div>As of {formatDate(allHoldingsSummary.end)}</div>
          </Card>
          {/* Row 2 */}
          <Card>
            <AllHoldingsDataTable data={allHoldingsSummary.holdings}/>
          </Card>
        </div>
      )}
    </div>
  );
}
