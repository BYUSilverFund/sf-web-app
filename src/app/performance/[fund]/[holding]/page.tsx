"use client";
import { useEffect, useState } from "react";
import {
  BenchmarkRequest,
  BenchmarkSummaryResponse,
  DividendsResponse,
  HoldingRequest,
  HoldingSummaryResponse,
  HoldingTimeSeriesResponse,
} from "@/lib/types";
import { format } from "date-fns";
import * as React from "react";

import { useParams } from 'next/navigation'
import { getBenchmarkSummary } from "@/lib/api/benchmark";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { ReturnsChart } from "@/components/ReturnsChart";
import { getDividends, getHoldingSummary, getHoldingTimeSeries } from "@/lib/api/holding";
import { HoldingSummaryTable } from "@/components/HoldingSummaryTable";
import { DividendsTable } from "@/components/DividendsTable";
import { defaultEnd, defaultStart, formatPortfolio } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function Page() {
  const [start, setStart] = useState<Date>(defaultStart());
  const [end, setEnd] = useState<Date>(defaultEnd());
  const [holdingSummary, setHoldingSummary] = useState<HoldingSummaryResponse>();
  const [benchmarkSummary, setBenchmarkSummary] = useState<BenchmarkSummaryResponse>();
  const [holdingTimeSeries, setHoldingTimeSeries] = useState<HoldingTimeSeriesResponse>();
  const [dividends, setDividends] = useState<DividendsResponse>();

  const params = useParams<{ fund: string, holding: string}>()

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
      }

      getHoldingSummary(holdingRequest)
        .then(setHoldingSummary)
        .catch(console.error);
      getBenchmarkSummary(benchmarkRequest)
        .then(setBenchmarkSummary)
        .catch(console.error)
      getHoldingTimeSeries(holdingRequest)
        .then(setHoldingTimeSeries)
        .catch(console.error)
      getDividends(holdingRequest)
        .then(setDividends)
        .catch(console.error)
    }
  }, [start, end, params.fund, params.holding]);

  const pages = [
    {
      name: 'Fund',
      href: '/performance'
    },
    {
      name: formatPortfolio(params.fund),
      href: `/performance/${params.fund}`
    }
  ]

  return (
    <div className="px-24">
      {holdingSummary && holdingTimeSeries && benchmarkSummary && dividends &&(
        <div className="space-y-4 p-4">
          <Breadcrumbs pages={pages} currentPage={params.holding}/>
          {/* Row 1 */}
          <Card className="flex p-4 gap-2 items-center">
            <ViewButton start={start} end={end} setStart={setStart} setEnd={setEnd} />
            <div>As of {format(holdingSummary.end, "PPP")}</div>
          </Card>
          {/* Row 2 */}
          <Card className="flex flex-col h-fit">
            <HoldingSummaryTable ticker={params.holding} holdingSummary={holdingSummary} benchmarkSummary={benchmarkSummary}/>
          </Card>
          {/* Row 3 */}
          <div className="flex gap-4">
            <Card className="px-4">
              <ReturnsChart data={holdingTimeSeries.records} />
            </Card>
            <div className="flex flex-col gap-4 w-full">
                <Card className="flex flex-col">
                    <div className="text-center py-4 border-b border-solid">Dividends</div>
                    <DividendsTable dividends={dividends}/>
                </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
