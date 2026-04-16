"use client";
import Link from "next/link";
import { PortfolioSummaryResponse } from "@/lib/types";
import { AllHoldingsDataTable } from "@/components/AllHoldingsDataTable";
import { ViewButton } from "@/components/ViewSelect";
import { getAllHoldingsSummary } from "@/lib/api/allHoldings";
import { AllHoldingsSummaryResponse, PortfolioRequest } from "@/lib/types";
import { formatDate, formatPortfolio, getDateFromView } from "@/lib/utils";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActiveSwitch } from "@/components/ActiveSwitch";
import { getPortfolioSummary } from "@/lib/api/portfolio";
import { downloadAllHoldingsCSV } from "@/lib/api/csvDownloads";
import { DownloadCSVButton } from "@/components/DownloadCSVButton";
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
  const [active, setActive] = useState(false);
  const [view, setView] = useState("cohort");
  const [start, setStart] = useState<Date | undefined>(
    getDateFromView(view, params.fund)[0],
  );
  const [portfolioSummary, setPortfolioSummary] =
    useState<PortfolioSummaryResponse>();
  const [allHoldingsSummary, setAllHoldingsSummary] = useState<
    AllHoldingsSummaryResponse | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const [end, setEnd] = useState<Date | undefined>(
    getDateFromView(view, params.fund)[1],
  );

  useEffect(() => {
    if (!start || !end) return;
    const requestId = ++requestSequence.current;

    const portfolioRequest: PortfolioRequest = {
      fund: params.fund,
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
    };

    setIsLoading(true);

    Promise.all([
      getAllHoldingsSummary(portfolioRequest),
      getPortfolioSummary(portfolioRequest),
    ])
      .then(([holdingsData, portfolioData]) => {
        if (requestSequence.current !== requestId) return;
        setAllHoldingsSummary(holdingsData);
        setPortfolioSummary(portfolioData);
        setIsLoading(false);
      })
      .catch((error) => {
        if (requestSequence.current !== requestId) return;
        console.error(error);
        setIsLoading(false);
      });
  }, [start, end, params.fund]);

  const holdings = useMemo(() => {
    // The active toggle is applied locally so the table can reuse the fetched holdings payload.
    if (!allHoldingsSummary?.holdings) return [];
    if (active) {
      return allHoldingsSummary.holdings.filter((holding) => holding.active);
    }
    return allHoldingsSummary.holdings;
  }, [allHoldingsSummary?.holdings, active]);

  return (
    <PerformancePageShell>
      {/* The all-holdings page uses the shared performance shell and toolbar instead of page-local spacing. */}
      <PerformanceTitleRow
        title={`${formatPortfolio(params.fund)} - All Holdings`}
        subtitle={
          !isLoading && allHoldingsSummary
            ? `as of ${formatDate(allHoldingsSummary.end)}`
            : undefined
        }
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
              Page: <span className="font-semibold">All Holdings</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ActiveSwitch active={active} setActive={setActive} />
            <ViewButton
              start={start}
              end={end}
              setStart={setStart}
              setEnd={setEnd}
              view={view}
              setView={setView}
              fund={params.fund}
            />
            <DownloadCSVButton
              key={`all-holdings-csv-${params.fund}-${start}-${end}`}
              start={start}
              end={end}
              size="default"
              className="px-[14px] py-2 bg-transparent text-[#002E5D] border border-[#002E5D]/30 text-sm rounded hover:bg-[#002E5D]/5 transition-colors h-auto"
              filenamePrefix={`all_holdings_${params.fund}`}
              onDownload={(req) =>
                downloadAllHoldingsCSV({
                  ...req,
                  fund: params.fund,
                })
              }
            />
          </div>
        </div>
      </PerformanceToolbar>

      <PerformanceSectionCard className="px-5 py-4">
        {/* The section card keeps the table chrome aligned with the other performance subpages. */}
        <AllHoldingsDataTable
          data={holdings}
          portfolioSummary={portfolioSummary}
          loading={isLoading}
        />
      </PerformanceSectionCard>
    </PerformancePageShell>
  );
}
