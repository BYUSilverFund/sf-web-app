'use client'
import { AllPortfoliosDataTable } from "@/components/AllPortfoliosDataTable";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { getAllPortfoliosSummary } from "@/lib/api/allPortfolios";
import { AllPortfoliosSummaryResponse, FundRequest } from "@/lib/types";
import { defaultEnd, defaultStart } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function Page() {
  const [start, setStart] = useState<Date>(defaultStart());
  const [end, setEnd] = useState<Date>(defaultEnd());
  const [allPortfoliosSummary, setAllPortfoliosSummary] =
    useState<AllPortfoliosSummaryResponse>();

  useEffect(() => {
    if (start && end) {
      const fundRequest: FundRequest = {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      getAllPortfoliosSummary(fundRequest)
        .then(setAllPortfoliosSummary)
        .catch(console.error);
    }
  }, [start, end]);

  return (
    <div className="px-24">
      {allPortfoliosSummary && (
        <div className="space-y-4 p-4">
          {/* Row 1 */}
          <Card className="flex p-4 gap-2 items-center">
            <ViewButton start={start} end={end} setStart={setStart} setEnd={setEnd} />
            <div>As of {format(allPortfoliosSummary.end, "PPP")}</div>
          </Card>
          {/* Row 2 */}
          <Card>
            <AllPortfoliosDataTable data={allPortfoliosSummary.portfolios}/>
          </Card>
        </div>
      )}
    </div>
  );
}
