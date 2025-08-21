"use client";
import { useEffect, useState } from "react";
import { getAllFundsSummary, getAllFundsTimeSeries } from "@/lib/api/allFunds";
import { getBenchmarkSummary } from "@/lib/api/benchmark";
import {
  BenchmarkRequest,
  BenchmarkSummaryResponse,
} from "@/lib/types/benchmark";
import {
  AllFundsRequest,
  AllFundsSummaryResponse,
  AllFundsTimeSeriesResponse,
} from "@/lib/types";
import { format } from "date-fns";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { ReturnsChart } from "@/components/ReturnsChart";
import { AllFundsTable } from "@/components/AllFundsTable";

export default function Page() {
  const today = new Date();

  // yesterday
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // yesterday one year ago
  const yesterdayLastYear = new Date();
  yesterdayLastYear.setFullYear(today.getFullYear() - 1);
  yesterdayLastYear.setDate(today.getDate() - 1);

  const [start, setStart] = useState<Date>(yesterdayLastYear);
  const [end, setEnd] = useState<Date>(yesterday);
  const [allFundsSummary, setAllFundsSummary] = useState<AllFundsSummaryResponse>();
  const [benchmarkSummary, setBenchmarkSummary] =useState<BenchmarkSummaryResponse>();
  const [allFundsTimeSeries, setAllFundsTimeSeries] = useState<AllFundsTimeSeriesResponse>();

  useEffect(() => {
    if (start && end) {
      const allFundsRequest: AllFundsRequest = {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      const benchmarkRequest: BenchmarkRequest = {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      getAllFundsSummary(allFundsRequest)
        .then(setAllFundsSummary)
        .catch(console.error);
      getBenchmarkSummary(benchmarkRequest)
        .then(setBenchmarkSummary)
        .catch(console.error);

      getAllFundsTimeSeries(allFundsRequest)
        .then(setAllFundsTimeSeries)
        .catch(console.error);
    }
  }, [start, end]);

  return (
    <div>
      {allFundsSummary && benchmarkSummary && allFundsTimeSeries && (
        <div className="space-y-4 p-4">
          {/* Row 1 */}
          <Card className="flex p-4 gap-2 items-center">
            <ViewButton setStart={setStart} setEnd={setEnd} />
            <div>As of {format(allFundsSummary.end, "PPP")}</div>
          </Card>
          {/* Row 2 */}
          <Card className="flex flex-col">
            <AllFundsTable allFundsSummary={allFundsSummary} benchmarkSummary={benchmarkSummary}/>
          </Card>
          {/* Row 3 */}
          <div className="flex gap-2">
            <Card className="p-4">
              <ReturnsChart data={allFundsTimeSeries["records"]} />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
