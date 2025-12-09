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
import { DashboardWrapper } from "@/components/DashboardWrapper";
import {
  AllPortfoliosRequest,
  AllPortfoliosSummaryResponse,
} from "@/lib/types/allPortfolios";
import { getAllPortfoliosSummary } from "@/lib/api/allPortfolios";
import { AllPortfoliosSummaryTable } from "@/components/AllPortfoliosSummaryTable";
import { getDateFromView } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { DownloadCSVButton } from "@/components/ui/download-csv-button";

export default function Page() {
  const [view, setView] = useState("cohort");
  const [start, setStart] = useState<Date | undefined>(
    getDateFromView(view)[0],
  );
  const [end, setEnd] = useState<Date | undefined>(getDateFromView(view)[1]);
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
    <div className="lg:px-24 md:px-12 sm:px-6">
      <div className="space-y-4 p-4">
        <DashboardWrapper>
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
            <div className="ml-auto flex items-center gap-2">
              {fundSummary && <div>As of {formatDate(fundSummary.end)}</div>}
              <DownloadCSVButton start={start} end={end} />
            </div>
          </Card>
          {/* Row 2 */}
          <Card className="flex flex-col h-fit">
            <FundSummaryTable
              allFundsSummary={fundSummary}
              benchmarkSummary={benchmarkSummary}
            />
          </Card>
          {/* Row 3 */}
          <div className="md:flex flex-1 min-h-0 gap-4 pb-5 space-y-4 md:space-y-0">
            <Card className="min-h-0 flex flex-col md:w-2/3">
              <ReturnsChart
                data={fundTimeSeries && fundTimeSeries["records"]}
                label="All Funds"
              />
            </Card>
            <Card className="overflow-y-auto md:w-1/3 w-full">
              <AllPortfoliosSummaryTable
                allPortfoliosSummary={allPortfoliosSummary}
              />
            </Card>
          </div>
        </DashboardWrapper>
      </div>
    </div>
  );
}
