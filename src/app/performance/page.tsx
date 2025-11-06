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
import {
  AllPortfoliosRequest,
  AllPortfoliosSummaryResponse,
} from "@/lib/types/allPortfolios";
import { getAllPortfoliosSummary } from "@/lib/api/allPortfolios";
import { AllPortfoliosSummaryTable } from "@/components/AllPortfoliosSummaryTable";
import { getDateFromView } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

export default function Page() {
  const [view, setView] = useState("cohort");
  const [start, setStart] = useState<Date>(getDateFromView(view)[0]);
  const [end, setEnd] = useState<Date>(getDateFromView(view)[1]);
  const [fundSummary, setFundSummary] = useState<FundSummaryResponse>();
  const [benchmarkSummary, setBenchmarkSummary] =
    useState<BenchmarkSummaryResponse>();
  const [fundTimeSeries, setFundTimeSeries] =
    useState<FundTimeSeriesResponse>();
  const [allPortfoliosSummary, setAllPortfoliosSummary] =
    useState<AllPortfoliosSummaryResponse>();

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
      };

      getFundSummary(fundRequest).then(setFundSummary).catch(console.error);
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
    <div className="lg:px-24 md:px-12 sm:px-6 pt-[14vh] min-h-screen flex flex-col">
      <div className="space-y-4 p-4">
        {/* Row 1 */}
        <Card className="sm:flex space-y-2 sm:space-y-0 p-4 gap-2 items-center">
          <ViewButton
            start={start}
            end={end}
            setStart={setStart}
            setEnd={setEnd}
            view={view}
            setView={setView}
          />
          {fundSummary && <div>As of {formatDate(fundSummary.end)}</div>}
        </Card>
        {/* Row 2 */}
        <Card className="flex flex-col h-fit">
          <FundSummaryTable
            allFundsSummary={fundSummary}
            benchmarkSummary={benchmarkSummary}
          />
        </Card>
        {/* Row 3 */}
        <div className="md:flex space-y-2 md:space-y-0 gap-4">
          <Card className="px-4 w-full">
            <ReturnsChart
              data={fundTimeSeries && fundTimeSeries["records"]}
              label="All Funds"
            />
          </Card>
          <Card className="h-fit md:w-2/6 w-full">
            <AllPortfoliosSummaryTable
              allPortfoliosSummary={allPortfoliosSummary}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
