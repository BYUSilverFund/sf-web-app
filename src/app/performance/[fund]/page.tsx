"use client";
import { useEffect, useState } from "react";
import {
  AllHoldingsSummaryResponse,
  BenchmarkRequest,
  BenchmarkSummaryResponse,
  PortfolioRequest,
  PortfolioSummaryResponse,
  PortfolioTimeSeriesResponse,
} from "@/lib/types";
import { format } from "date-fns";
import * as React from "react";
import {
  getPortfolioSummary,
  getPortfolioTimeSeries,
} from "@/lib/api/portfolio";

import { useParams } from "next/navigation";
import { getBenchmarkSummary } from "@/lib/api/benchmark";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { PortfolioSummaryTable } from "@/components/PortfolioSummarytable";
import { ReturnsChart } from "@/components/ReturnsChart";
import { AllHoldingsSummaryTable } from "@/components/AllHoldingsSummaryTable";
import { getAllHoldingsSummary } from "@/lib/api/allHoldings";
import { formatDate, formatPortfolio, getDateFromView } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DashboardHeight } from "@/components/DashboardHeight";

export default function Page() {
  const [view, setView] = useState("cohort");
  const [start, setStart] = useState<Date>(getDateFromView(view)[0]);
  const [end, setEnd] = useState<Date>(getDateFromView(view)[1]);
  const [portfolioSummary, setPortfolioSummary] =
    useState<PortfolioSummaryResponse>();
  const [benchmarkSummary, setBenchmarkSummary] =
    useState<BenchmarkSummaryResponse>();
  const [portfolioTimeSeries, setPortfolioTimeSeries] =
    useState<PortfolioTimeSeriesResponse>();
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

      const benchmarkRequest: BenchmarkRequest = {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      getPortfolioSummary(portfolioRequest)
        .then(setPortfolioSummary)
        .catch(console.error);
      getBenchmarkSummary(benchmarkRequest)
        .then(setBenchmarkSummary)
        .catch(console.error);
      getPortfolioTimeSeries(portfolioRequest)
        .then(setPortfolioTimeSeries)
        .catch(console.error);
      getAllHoldingsSummary(portfolioRequest)
        .then(setAllHoldingsSummary)
        .catch(console.error);
    }
  }, [start, end, params.fund]);

  const pages = [
    {
      name: "All Funds",
      href: "/performance",
    },
  ];

  return (
    <div className="lg:px-24 md:px-12 sm:px-6">
      <div className="space-y-4 p-4">
        <DashboardHeight>
          <Breadcrumbs pages={pages} currentPage={formatPortfolio(params.fund)} />
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
            {portfolioSummary && (
              <div>As of {formatDate(portfolioSummary.end)}</div>
            )}
          </Card>
          {/* Row 2 */}
          <Card className="flex flex-col h-fit">
            <PortfolioSummaryTable
              portfolio={params.fund}
              portfolioSummary={portfolioSummary}
              benchmarkSummary={benchmarkSummary}
            />
          </Card>
          {/* Row 3 */}
          <div className="flex flex-1 min-h-0 gap-4 pb-5">
            <Card className="flex-1 min-h-0 flex flex-col md:w-2/3">
              <ReturnsChart
                data={portfolioTimeSeries && portfolioTimeSeries["records"]}
                label={formatPortfolio(params.fund)}
              />
            </Card>
            <Card className="flex-1 min-h-0 flex flex-col p-0 overflow-auto md:w-1/3">
              <AllHoldingsSummaryTable
                fund={params.fund}
                allHoldingsSummary={allHoldingsSummary}
              />
            </Card>
          </div>
        </DashboardHeight>
      </div>
    </div>
  );
}
