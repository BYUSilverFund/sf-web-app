"use client";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { AllDividendsDataTable } from "@/components/AllDividendsDataTable";
import {
  PerformancePageShell,
  PerformanceSectionCard,
  PerformanceTitleRow,
  PerformanceToolbar,
} from "@/components/PerformancePageLayout";
import { ViewButton } from "@/components/ViewSelect";
import { Button } from "@/components/ui/button";
import { getDividends } from "@/lib/api/holding";
import type { DividendsResponse, HoldingRequest } from "@/lib/types";
import { formatDate, formatPortfolio } from "@/lib/utils";

export default function Page() {
  const params = useParams<{ fund: string; holding: string }>();
  const requestSequence = useRef(0);
  const [view, setView] = useState("max");
  const [start, setStart] = useState<Date | undefined>(new Date("2000-01-01"));
  const [end, setEnd] = useState<Date | undefined>(new Date());
  const [allDividends, setAllDividends] = useState<DividendsResponse>();

  useEffect(() => {
    if (!start || !end) return;
    const requestId = ++requestSequence.current;

    const holdingRequest: HoldingRequest = {
      fund: params.fund,
      ticker: params.holding,
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
    };

    getDividends(holdingRequest)
      .then((dividends) => {
        if (requestSequence.current !== requestId) return;
        setAllDividends(dividends);
      })
      .catch((error) => {
        if (requestSequence.current !== requestId) return;
        console.error(error);
      });
  }, [end, params.fund, params.holding, start]);

  return (
    <PerformancePageShell>
      <PerformanceTitleRow
        title={`${params.holding} - All Dividends`}
        subtitle={
          allDividends ? `as of ${formatDate(allDividends.end)}` : undefined
        }
      />

      <PerformanceToolbar>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors h-auto"
            >
              <Link href={`/performance?tab=${params.fund}`}>
                Portfolio:{" "}
                <span className="font-semibold text-gray-900">
                  {formatPortfolio(params.fund)}
                </span>
              </Link>
            </Button>
            <ChevronRight className="h-4 w-4 text-gray-300" />
            <Button
              asChild
              variant="outline"
              className="px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors h-auto"
            >
              <Link href={`/performance/${params.fund}/${params.holding}`}>
                Ticker:{" "}
                <span className="font-semibold text-gray-900">
                  {params.holding}
                </span>
              </Link>
            </Button>
            <ChevronRight className="h-4 w-4 text-gray-300" />
            <Button
              type="button"
              variant="ghost"
              className="px-4 py-2 !bg-[#002E5D] !border-[#002E5D] border rounded text-sm !text-white hover:!bg-[#002E5D] hover:!text-white h-auto"
            >
              Page: <span className="font-semibold">All Dividends</span>
            </Button>
          </div>

          <ViewButton
            start={start}
            end={end}
            setStart={setStart}
            setEnd={setEnd}
            view={view}
            setView={setView}
            fund={params.fund}
          />
        </div>
      </PerformanceToolbar>

      <PerformanceSectionCard className="px-5 py-4">
        <AllDividendsDataTable dividends={allDividends} />
      </PerformanceSectionCard>
    </PerformancePageShell>
  );
}
