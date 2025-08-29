"use client";
import { useEffect, useState } from "react";
import {
  AllHoldingsSummaryResponse,
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
import {
  defaultEnd,
  defaultStart,
  formatDate,
  formatPortfolio,
} from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function FundClient() {
  const [start, setStart] = useState<Date>(defaultStart());
  const [end, setEnd] = useState<Date>(defaultEnd());
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
      getPortfolioSummary(portfolioRequest)
        .then(setPortfolioSummary)
        .catch(console.error);
      getBenchmarkSummary({
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      })
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
    {
      name: formatPortfolio(params.fund),
      href: `/performance/${params.fund}`,
    },
  ];

  return (
    <div className="px-24">
      {portfolioSummary &&
        portfolioTimeSeries &&
        benchmarkSummary &&
        allHoldingsSummary && (
          <div className="space-y-4 p-4">
            <Breadcrumbs pages={pages} currentPage={params.fund} />
            <Card className="flex p-4 gap-2 items-center">
              <ViewButton
                start={start}
                end={end}
                setStart={setStart}
                setEnd={setEnd}
              />
              <div>As of {formatDate(portfolioSummary.end)}</div>
            </Card>
            <Card className="flex flex-col h-fit">
              <PortfolioSummaryTable
                portfolio={params.fund}
                portfolioSummary={portfolioSummary}
                benchmarkSummary={benchmarkSummary}
              />
            </Card>
            <Card>
              <ReturnsChart data={portfolioTimeSeries.records} />
            </Card>
            <Card>
              <AllHoldingsSummaryTable
                fund={params.fund}
                allHoldingsSummary={allHoldingsSummary}
              />
            </Card>
          </div>
        )}
    </div>
  );
}
