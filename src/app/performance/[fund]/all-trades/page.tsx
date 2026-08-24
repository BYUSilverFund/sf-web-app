"use client";
import Link from "next/link";
import { ViewButton } from "@/components/ViewSelect";
import { AllTradesDataTable } from "@/components/AllTradesDataTable";
import { getPortfolioTrades } from "@/lib/api/portfolio";
import { PortfolioRequest, TradesResponse } from "@/lib/types";
import { formatPortfolio, getDateFromView } from "@/lib/utils";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  PerformancePageShell,
  PerformanceSectionCard,
  PerformanceTitleRow,
  PerformanceToolbar,
} from "@/components/PerformancePageLayout";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Page() {
  const params = useParams<{ fund: string }>();
  const requestSequence = useRef(0);
  const [view, setView] = useState("cohort");
  const [start, setStart] = useState<Date | undefined>(
    getDateFromView(view, params.fund)[0],
  );
  const [end, setEnd] = useState<Date | undefined>(
    getDateFromView(view, params.fund)[1],
  );
  const [trades, setTrades] = useState<TradesResponse>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!start || !end) return;
    const requestId = ++requestSequence.current;

    const portfolioRequest: PortfolioRequest = {
      fund: params.fund,
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
    };

    setIsLoading(true);

    getPortfolioTrades(portfolioRequest)
      .then((data) => {
        if (requestSequence.current !== requestId) return;
        setTrades(data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (requestSequence.current !== requestId) return;
        console.error(error);
        setIsLoading(false);
      });
  }, [start, end, params.fund]);

  return (
    <PerformancePageShell>
      <PerformanceTitleRow
        title={`${formatPortfolio(params.fund)} - All Trades`}
      />

      <PerformanceToolbar>
        <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
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
              type="button"
              variant="ghost"
              className="px-4 py-2 !bg-[#002E5D] !border-[#002E5D] border rounded text-sm !text-white hover:!bg-[#002E5D] hover:!text-white h-auto"
            >
              Page: <span className="font-semibold">All Trades</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
        </div>
      </PerformanceToolbar>

      <PerformanceSectionCard className="px-5 py-4">
        <AllTradesDataTable trades={trades} loading={isLoading} />
      </PerformanceSectionCard>
    </PerformancePageShell>
  );
}
