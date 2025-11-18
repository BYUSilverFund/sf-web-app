"use client";
import { useEffect, useState } from "react";
import {
  BenchmarkRequest,
  BenchmarkSummaryResponse,
  DividendsResponse,
  HoldingRequest,
  HoldingSummaryResponse,
  HoldingTimeSeriesResponse,
  TradesResponse,
} from "@/lib/types";
import { format } from "date-fns";
import * as React from "react";

import { useParams } from "next/navigation";
import { getBenchmarkSummary } from "@/lib/api/benchmark";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { ReturnsChart } from "@/components/ReturnsChart";
import {
  getDividends,
  getHoldingSummary,
  getHoldingTimeSeries,
  getTrades,
} from "@/lib/api/holding";
import { HoldingSummaryTable } from "@/components/HoldingSummaryTable";
import { DividendsTable } from "@/components/DividendsTable";
import {
  defaultEnd,
  defaultStart,
  formatDate,
  formatPortfolio,
} from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TradesTable } from "@/components/TradesTable";
import { DashboardHeight } from "@/components/DashboardHeight";

export default function Page() {
  const [view, setView] = useState("max");
  const [start, setStart] = useState<Date>(defaultStart(view));
  const [end, setEnd] = useState<Date>(defaultEnd(view));
  const [holdingSummary, setHoldingSummary] =
    useState<HoldingSummaryResponse>();
  const [benchmarkSummary, setBenchmarkSummary] =
    useState<BenchmarkSummaryResponse>();
  const [holdingTimeSeries, setHoldingTimeSeries] =
    useState<HoldingTimeSeriesResponse>();
  const [dividends, setDividends] = useState<DividendsResponse>();
  const [trades, setTrades] = useState<TradesResponse>();

  const params = useParams<{ fund: string; holding: string }>();

  useEffect(() => {
    if (start && end) {
      const holdingRequest: HoldingRequest = {
        fund: params.fund,
        ticker: params.holding,
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      const benchmarkRequest: BenchmarkRequest = {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      getHoldingSummary(holdingRequest)
        .then(setHoldingSummary)
        .catch(console.error);
      getBenchmarkSummary(benchmarkRequest)
        .then(setBenchmarkSummary)
        .catch(console.error);
      getHoldingTimeSeries(holdingRequest)
        .then(setHoldingTimeSeries)
        .catch(console.error);
      getDividends(holdingRequest).then(setDividends).catch(console.error);
      getTrades(holdingRequest).then(setTrades).catch(console.error);
    }
  }, [start, end, params.fund, params.holding]);

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
  const tradeDisplayCount =
    trades?.trades && trades.trades.length === 0
      ? null
      : Math.min(trades?.trades?.length ?? 5, 5);

  return (
    <div className="lg:px-24 md:px-12 sm:px-6">
      {/* {holdingSummary && holdingTimeSeries && benchmarkSummary && trades && ( */}
      <div className="space-y-4 p-4">
        <DashboardHeight>
          <Breadcrumbs pages={pages} currentPage={params.holding} />
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
            {holdingSummary && <div>As of {formatDate(holdingSummary.end)}</div>}
          </Card>
          {/* Row 2 */}
          <Card className="flex flex-col h-fit">
            <HoldingSummaryTable
              ticker={params.holding}
              holdingSummary={holdingSummary}
              benchmarkSummary={benchmarkSummary}
            />
          </Card>
          {/* Row 3 */}
          <div className="flex min-h-0 gap-4 pb-5">
            <Card className=" min-h-0 flex flex-col w-full">
              <ReturnsChart
                data={holdingTimeSeries?.records}
                label={params.holding}
              />
            </Card>
            <div className=" min-h-0 flex flex-col w-2/3 gap-4">
              <Card className=" min-h-0 flex flex-col overflow-y-auto w-full">
                <div className="text-center border-b-2 border-solid">
                  Dividends
                </div>
                <DividendsTable dividends={dividends} />
              </Card>
              <Card className=" min-h-0 flex flex-col overflow-y-auto w-full">
                <div className="text-center border-b-2 border-solid">
                  {tradeDisplayCount === null
                    ? null
                    : "Last " + tradeDisplayCount}{" "}
                  Trades
                </div>
                <TradesTable trades={trades} />
              </Card>
            </div>
          </div>
        </DashboardHeight>
      </div>
      {/* )} */}
    </div>
  );
}
