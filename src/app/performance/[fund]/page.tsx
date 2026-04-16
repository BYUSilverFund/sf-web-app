"use client";
import { useEffect, useState, useMemo, startTransition, Suspense } from "react";
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
  getActivePortfolioSummary,
  getPortfolioSummary,
  getPortfolioTimeSeries,
} from "@/lib/api/portfolio";

import { useParams } from "next/navigation";
import { getBenchmarkSummary } from "@/lib/api/benchmark";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { PortfolioSummaryTable } from "@/components/PortfolioSummaryTable";
import { ReturnsChart } from "@/components/ReturnsChart";
import { AllHoldingsSummaryTable } from "@/components/AllHoldingsSummaryTable";
import { getAllHoldingsSummary } from "@/lib/api/allHoldings";
import { formatDate, formatPortfolio, getDateFromView } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { downloadPortfolioCSV } from "@/lib/api/csvDownloads";
import { DownloadCSVButton } from "@/components/DownloadCSVButton";
import { FactorExposuresButton } from "@/components/forecast/FactorExposuresButton";
import {
  PerformancePageShell,
  PerformanceTitleRow,
} from "@/components/PerformancePageLayout";

export default function Page() {
  const { fund } = useParams<{ fund: string }>();
  const [view, setView] = useState("cohort");
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [portfolioSummary, setPortfolioSummary] =
    useState<PortfolioSummaryResponse>();
  const [weightMode, setWeightMode] = useState<"total" | "active">("total");
  const [benchmarkSummary, setBenchmarkSummary] =
    useState<BenchmarkSummaryResponse>();
  const [summaryCache, setSummaryCache] = useState<
    Record<
      string,
      Partial<Record<"total" | "active", PortfolioSummaryResponse>>
    >
  >({});
  const [benchmarkCache, setBenchmarkCache] = useState<
    Record<string, BenchmarkSummaryResponse>
  >({});
  const [portfolioTimeSeries, setPortfolioTimeSeries] =
    useState<PortfolioTimeSeriesResponse>();
  const [allHoldingsSummary, setAllHoldingsSummary] =
    useState<AllHoldingsSummaryResponse>();

  // The date range follows the selected view so the table and chart stay in sync.
  const dates = useMemo(() => {
    if (!fund) return undefined;
    return getDateFromView(view, fund);
  }, [view, fund]);

  useEffect(() => {
    if (!dates) return;
    startTransition(() => {
      setStart(dates[0]);
      setEnd(dates[1]);
    });
  }, [dates]);

  const requestKey = useMemo(() => {
    if (!start || !end || !fund) return undefined;
    return `${fund}|${format(start, "yyyy-MM-dd")}|${format(end, "yyyy-MM-dd")}`;
  }, [start, end, fund]);

  const setBenchmarkForSummary = React.useCallback(
    (summary: PortfolioSummaryResponse) => {
      // Benchmark requests are cached because summary toggles can reuse the same date range.
      const benchmarkKey = `${summary.start}|${summary.end}`;
      const cachedBenchmark = benchmarkCache[benchmarkKey];
      if (cachedBenchmark) {
        setBenchmarkSummary(cachedBenchmark);
        return;
      }

      const benchmarkRequest: BenchmarkRequest = {
        start: summary.start,
        end: summary.end,
      };

      getBenchmarkSummary(benchmarkRequest)
        .then((benchmark) => {
          setBenchmarkSummary(benchmark);
          setBenchmarkCache((prev) => ({
            ...prev,
            [benchmarkKey]: benchmark,
          }));
        })
        .catch(console.error);
    },
    [benchmarkCache],
  );

  useEffect(() => {
    if (requestKey && start && end && fund) {
      const cachedSummary = summaryCache[requestKey]?.[weightMode];
      if (cachedSummary) {
        setPortfolioSummary(cachedSummary);
        setBenchmarkForSummary(cachedSummary);
        return;
      }

      const portfolioRequest: PortfolioRequest = {
        fund: fund,
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      const getSummary =
        weightMode === "active"
          ? getActivePortfolioSummary
          : getPortfolioSummary;

      getSummary(portfolioRequest)
        .then((summary) => {
          setPortfolioSummary(summary);
          setSummaryCache((prev) => ({
            ...prev,
            [requestKey]: {
              ...(prev[requestKey] ?? {}),
              [weightMode]: summary,
            },
          }));
          setBenchmarkForSummary(summary);
        })
        .catch(console.error);
    }
  }, [
    requestKey,
    start,
    end,
    fund,
    weightMode,
    summaryCache,
    setBenchmarkForSummary,
  ]);

  useEffect(() => {
    if (start && end && fund) {
      const portfolioRequest: PortfolioRequest = {
        fund: fund,
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      getPortfolioTimeSeries(portfolioRequest)
        .then(setPortfolioTimeSeries)
        .catch(console.error);
      getAllHoldingsSummary(portfolioRequest)
        .then(setAllHoldingsSummary)
        .catch(console.error);
    }
  }, [start, end, fund]);

  const pages = [
    {
      name: "All Funds",
      href: "/performance",
    },
  ];

  return (
    <PerformancePageShell>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {/* The portfolio detail page now uses the shared shell/title rhythm from the main performance area. */}
        <Suspense fallback={null}>
          <Breadcrumbs pages={pages} currentPage={formatPortfolio(fund)} />
        </Suspense>
        <PerformanceTitleRow
          title={formatPortfolio(fund)}
          subtitle={
            portfolioSummary
              ? `as of ${formatDate(portfolioSummary.end)}`
              : undefined
          }
        />
        <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <ViewButton
            start={start}
            end={end}
            setStart={setStart}
            setEnd={setEnd}
            view={view}
            setView={setView}
            fund={fund}
          />
          <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
            <FactorExposuresButton fund={fund} />
            <DownloadCSVButton
              start={start}
              end={end}
              filenamePrefix={`portfolio_${fund}`}
              onDownload={(req) =>
                downloadPortfolioCSV({
                  ...req,
                  fund: fund,
                })
              }
            />
          </div>
        </Card>
        <Card className="flex flex-col h-fit">
          <PortfolioSummaryTable
            portfolio={fund}
            portfolioSummary={portfolioSummary}
            benchmarkSummary={benchmarkSummary}
            weightMode={weightMode}
            onWeightModeChange={setWeightMode}
            view_1yr={view === "1year"}
          />
        </Card>
        <div className="min-h-0 flex flex-col gap-4 md:flex-1 md:flex-row md:space-y-0">
          {/* The chart and holdings summary stay side by side on desktop, but stack naturally on smaller screens. */}
          <Card className="flex min-h-0 flex-col md:w-2/3">
            <ReturnsChart
              data={portfolioTimeSeries && portfolioTimeSeries["records"]}
              label={formatPortfolio(fund)}
            />
          </Card>
          <Card className="flex min-h-0 w-full flex-col overflow-hidden md:w-2/6">
            <div className="min-h-0 flex-1">
              <AllHoldingsSummaryTable
                fund={fund}
                allHoldingsSummary={allHoldingsSummary}
              />
            </div>
          </Card>
        </div>
      </div>
    </PerformancePageShell>
  );
}
