'use client'
import { AllHoldingsDataTable } from "@/components/AllHoldingsDataTable";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { getAllHoldingsSummary } from "@/lib/api/allHoldings";
import { AllHoldingsSummaryResponse, PortfolioRequest } from "@/lib/types";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const yesterdayLastYear = new Date();
  yesterdayLastYear.setFullYear(yesterday.getFullYear() - 1);

  const [start, setStart] = useState<Date>(yesterdayLastYear);
  const [end, setEnd] = useState<Date>(yesterday);
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

  return (
    <div className="px-24">
      {allHoldingsSummary && (
        <div className="space-y-4 p-4">
          {/* Row 1 */}
          <Card className="flex p-4 gap-2 items-center">
            <ViewButton setStart={setStart} setEnd={setEnd} />
            <div>As of {format(allHoldingsSummary.end, "PPP")}</div>
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
