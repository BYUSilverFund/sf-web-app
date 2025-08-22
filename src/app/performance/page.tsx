"use client";
import { useEffect, useState } from "react";
import { getFundSummary, getFundTimeSeries } from "@/lib/api/fund";
import { getBenchmarkSummary } from "@/lib/api/benchmark";
import {
  BenchmarkRequest,
  BenchmarkSummaryResponse,
} from "@/lib/types/benchmark";
import {
  FundRequest,
  FundSummaryResponse,
  FundTimeSeriesResponse,
} from "@/lib/types";
import { format } from "date-fns";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { ReturnsChart } from "@/components/ReturnsChart";
import { FundSummaryTable } from "@/components/FundSummaryTable";
import { AllPortfoliosRequest, AllPortfoliosSummaryResponse } from "@/lib/types/allPortfolios";
import { getAllPortfoliosSummary } from "@/lib/api/allPortfolios";
import { AllPortfoliosSummaryTable } from "@/components/AllPortfoliosSummaryTable copy";
import { defaultEnd, defaultStart } from "@/lib/utils";

export default function Page() {
  const [start, setStart] = useState<Date>(defaultStart());
  const [end, setEnd] = useState<Date>(defaultEnd());
  const [fundSummary, setFundSummary] = useState<FundSummaryResponse>();
  const [benchmarkSummary, setBenchmarkSummary] =useState<BenchmarkSummaryResponse>();
  const [fundTimeSeries, setFundTimeSeries] = useState<FundTimeSeriesResponse>();
  const [allPortfoliosSummary, setAllPortfoliosSummary] = useState<AllPortfoliosSummaryResponse>();

  useEffect(() => {
    if (start && end) {
      const fundRequest: FundRequest = {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      const benchmarkRequest: BenchmarkRequest = {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      const allPortfoliosRequest: AllPortfoliosRequest = {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),      
      }

      getFundSummary(fundRequest)
        .then(setFundSummary)
        .catch(console.error);
      getBenchmarkSummary(benchmarkRequest)
        .then(setBenchmarkSummary)
        .catch(console.error);
      getFundTimeSeries(fundRequest)
        .then(setFundTimeSeries)
        .catch(console.error);
      getAllPortfoliosSummary(allPortfoliosRequest)
        .then(setAllPortfoliosSummary)
        .catch(console.error);
    }
  }, [start, end]);

  return (
    <div className="px-24">
      {fundSummary && benchmarkSummary && fundTimeSeries && allPortfoliosSummary &&(
        <div className="space-y-4 p-4">
          {/* Row 1 */}
          <Card className="flex p-4 gap-2 items-center">
            <ViewButton start={start} end={end} setStart={setStart} setEnd={setEnd} />
            <div>As of {format(fundSummary.end, "PPP")}</div>
          </Card>
          {/* Row 2 */}
          <Card className="flex flex-col h-fit">
            <FundSummaryTable allFundsSummary={fundSummary} benchmarkSummary={benchmarkSummary}/>
          </Card>
          {/* Row 3 */}
          <div className="flex gap-4">
            <Card className="px-4">
              <ReturnsChart data={fundTimeSeries["records"]} />
            </Card>
            <Card className="h-fit w-full">
              <AllPortfoliosSummaryTable allPortfoliosSummary={allPortfoliosSummary}/>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
