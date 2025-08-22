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
import { getPortfolioSummary, getPortfolioTimeSeries } from "@/lib/api/portfolio";

import { useParams } from 'next/navigation'
import { getBenchmarkSummary } from "@/lib/api/benchmark";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { PortfolioSummaryTable } from "@/components/PortfolioSummarytable";
import { ReturnsChart } from "@/components/ReturnsChart";
import { AllHoldingsSummaryTable } from "@/components/AllHoldingsSummaryTable";
import { getAllHoldingsSummary } from "@/lib/api/allHoldings";

export default function Page() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const yesterdayLastYear = new Date();
  yesterdayLastYear.setFullYear(yesterday.getFullYear() - 1);

  const [start, setStart] = useState<Date>(yesterdayLastYear);
  const [end, setEnd] = useState<Date>(yesterday);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummaryResponse>();
  const [benchmarkSummary, setBenchmarkSummary] = useState<BenchmarkSummaryResponse>();
  const [portfolioTimeSeries, setPortfolioTimeSeries] = useState<PortfolioTimeSeriesResponse>();
  const [allHoldingsSummary, setAllHoldingsSummary] = useState<AllHoldingsSummaryResponse>();

  const params = useParams<{ fund: string}>()

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
      }

      getPortfolioSummary(portfolioRequest)
        .then(setPortfolioSummary)
        .catch(console.error);
      getBenchmarkSummary(benchmarkRequest)
        .then(setBenchmarkSummary)
        .catch(console.error)
      getPortfolioTimeSeries(portfolioRequest)
        .then(setPortfolioTimeSeries)
        .catch(console.error)
      getAllHoldingsSummary(portfolioRequest)
        .then(setAllHoldingsSummary)
        .catch(console.error)
    }
  }, [start, end, params.fund]);

  return (
    <div className="px-24">
      {portfolioSummary && benchmarkSummary && portfolioTimeSeries && allHoldingsSummary &&(
        <div className="space-y-4 p-4">
          {/* Row 1 */}
          <Card className="flex p-4 gap-2 items-center">
            <ViewButton setStart={setStart} setEnd={setEnd} />
            <div>As of {format(portfolioSummary.end, "PPP")}</div>
          </Card>
          {/* Row 2 */}
          <Card className="flex flex-col h-fit">
            <PortfolioSummaryTable portfolio={params.fund} portfolioSummary={portfolioSummary} benchmarkSummary={benchmarkSummary}/>
          </Card>
          {/* Row 3 */}
          <div className="flex gap-4">
            <Card className="px-4">
              <ReturnsChart data={portfolioTimeSeries["records"]} />
            </Card>
            <Card className="h-fit w-full">
              <AllHoldingsSummaryTable allHoldingsSummary={allHoldingsSummary}/>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
