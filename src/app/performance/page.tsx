"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { format } from "date-fns";
import { ChevronDownIcon, HelpCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FundTabsBar } from "@/components/FundTabsBar";
import { PerformanceChart } from "@/components/PerformanceChart";
import { MetricsBar } from "@/components/MetricsBar";
import { MetricsRow } from "@/components/MetricsRow";
import { RiskMetrics } from "@/components/RiskMetrics";
import { DownloadCSVButton } from "@/components/DownloadCSVButton";
import { FactorExposuresButton } from "@/components/forecast/FactorExposuresButton";
import {
  PerformanceGraphPanel,
  PerformanceSummaryPanel,
} from "@/components/PerformanceOverviewPanels";
import {
  PERFORMANCE_PAGE_LAYOUT,
  PerformanceGraphRow,
  PerformanceMetricsSection,
  PerformancePageShell,
  PerformancePrimaryPane,
  PerformanceSidebar,
  PerformanceTitleRow,
} from "@/components/PerformancePageLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { getBenchmarkSummary } from "@/lib/api/benchmark";
import { getFundSummary, getFundTimeSeries } from "@/lib/api/fund";
import {
  getActivePortfolioSummary,
  getPortfolioSummary,
  getPortfolioTimeSeries,
} from "@/lib/api/portfolio";
import { getAllPortfoliosSummary } from "@/lib/api/allPortfolios";
import { getAllHoldingsSummary } from "@/lib/api/allHoldings";
import {
  downloadAllFundsCSV,
  downloadPortfolioCSV,
} from "@/lib/api/csvDownloads";

import type {
  AllHoldingsSummaryResponse,
  AllPortfoliosRequest,
  AllPortfoliosSummaryResponse,
  BenchmarkRequest,
  BenchmarkSummaryResponse,
  FundRequest,
  FundSummaryResponse,
  FundTimeSeriesResponse,
  PortfolioRequest,
  PortfolioSummaryResponse,
  PortfolioTimeSeriesResponse,
} from "@/lib/types";
import {
  calculateAverageDailyReturn,
  calculateSummaryMetrics,
} from "@/lib/RealizedVsAnnualizedCalculations";

import {
  formatDate,
  formatFloat,
  formatCurrency,
  formatMillions,
  formatPercent,
  formatPortfolio,
  getDateFromView,
} from "@/lib/utils";
import { getHeaderTooltips } from "@/lib/tabletooltips";

const ALL_FUNDS_KEY = "all_funds";

const timeFilters = [
  { label: "Cohort", value: "cohort" },
  { label: "1 Week", value: "1week" },
  { label: "1 Month", value: "1month" },
  { label: "3 Months", value: "3months" },
  { label: "1 Year", value: "1year" },
  { label: "Max", value: "max" },
  { label: "Custom", value: "custom" },
] as const;
const benchmarkMetricCount = 6;
const riskMetricCount = 4;

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestSequence = useRef(0);
  const [view, setView] = useState("cohort");
  const [start, setStart] = useState<Date | undefined>(
    getDateFromView(view)[0],
  );
  const [end, setEnd] = useState<Date | undefined>(getDateFromView(view)[1]);
  const [metricMode, setMetricMode] = useState<"realized" | "annualized">(
    "realized",
  );
  const [activeRates, setActiveRates] = useState(false);

  const [fundSummary, setFundSummary] = useState<FundSummaryResponse>();
  const [fundTimeSeries, setFundTimeSeries] =
    useState<FundTimeSeriesResponse>();
  const [portfolioSummary, setPortfolioSummary] =
    useState<PortfolioSummaryResponse>();
  const [activePortfolioSummary, setActivePortfolioSummary] =
    useState<PortfolioSummaryResponse>();
  const [portfolioTimeSeries, setPortfolioTimeSeries] =
    useState<PortfolioTimeSeriesResponse>();
  const [allHoldingsSummary, setAllHoldingsSummary] =
    useState<AllHoldingsSummaryResponse>();
  const [allPortfoliosSummary, setAllPortfoliosSummary] =
    useState<AllPortfoliosSummaryResponse>();
  const [benchmarkSummary, setBenchmarkSummary] =
    useState<BenchmarkSummaryResponse>();
  const [isLoading, setIsLoading] = useState(true);

  const activeTab = searchParams.get("tab") || ALL_FUNDS_KEY;
  const isAllFunds = activeTab === ALL_FUNDS_KEY;
  const selectedFund = isAllFunds ? "" : activeTab;
  const selectedSummary = isAllFunds
    ? fundSummary
    : activeRates
      ? activePortfolioSummary
      : portfolioSummary;
  const selectedTimeSeries = isAllFunds ? fundTimeSeries : portfolioTimeSeries;

  const handleActiveTabChange = (nextTab: string) => {
    // The fund selector keeps the current route and only rewrites the tab query param.
    const params = new URLSearchParams(searchParams.toString());
    if (nextTab === ALL_FUNDS_KEY) {
      params.delete("tab");
    } else {
      params.set("tab", nextTab);
    }

    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  useEffect(() => {
    if (view === "custom") return;

    // Non-custom ranges always derive their dates from the selected filter and active fund.
    const [nextStart, nextEnd] = getDateFromView(view, selectedFund);
    setStart(nextStart);
    setEnd(nextEnd);
  }, [selectedFund, view]);

  useEffect(() => {
    if (!start || !end) return;

    const requestId = ++requestSequence.current;
    const startStr = format(start, "yyyy-MM-dd");
    const endStr = format(end, "yyyy-MM-dd");
    setIsLoading(true);

    if (isAllFunds) {
      // The all-funds tab uses the fund-level summary plus portfolio summaries for the right rail.
      const fundRequest: FundRequest = {
        start: startStr,
        end: endStr,
      };
      const allPortfoliosRequest: AllPortfoliosRequest = {
        start: startStr,
        end: endStr,
      };

      Promise.all([
        getAllPortfoliosSummary(allPortfoliosRequest),
        getFundTimeSeries(fundRequest),
        getFundSummary(fundRequest).then(async (summary) => {
          const benchmarkRequest: BenchmarkRequest = {
            start: summary.start,
            end: summary.end,
          };

          const benchmark = await getBenchmarkSummary(benchmarkRequest);
          return { summary, benchmark };
        }),
      ])
        .then(([portfolios, timeSeries, summaryData]) => {
          if (requestSequence.current !== requestId) return;

          setAllPortfoliosSummary(portfolios);
          setFundTimeSeries(timeSeries);
          setFundSummary(summaryData.summary);
          setBenchmarkSummary(summaryData.benchmark);
          setPortfolioSummary(undefined);
          setActivePortfolioSummary(undefined);
          setPortfolioTimeSeries(undefined);
          setAllHoldingsSummary(undefined);
          setIsLoading(false);
        })
        .catch((error) => {
          if (requestSequence.current !== requestId) return;
          console.error(error);
          setIsLoading(false);
        });
      return;
    }

    const portfolioRequest: PortfolioRequest = {
      fund: activeTab,
      start: startStr,
      end: endStr,
    };

    Promise.all([
      getAllHoldingsSummary(portfolioRequest),
      getPortfolioTimeSeries(portfolioRequest),
      getPortfolioSummary(portfolioRequest),
      getActivePortfolioSummary(portfolioRequest),
    ])
      .then(async ([holdings, timeSeries, summary, activeSummary]) => {
        const benchmarkRequest: BenchmarkRequest = {
          start: summary.start,
          end: summary.end,
        };

        const benchmark = await getBenchmarkSummary(benchmarkRequest);

        if (requestSequence.current !== requestId) return;

        setAllHoldingsSummary(holdings);
        setPortfolioTimeSeries(timeSeries);
        setPortfolioSummary(summary);
        setActivePortfolioSummary(activeSummary);
        setBenchmarkSummary(benchmark);
        setFundSummary(undefined);
        setFundTimeSeries(undefined);
        setAllPortfoliosSummary(undefined);
        setIsLoading(false);
      })
      .catch((error) => {
        if (requestSequence.current !== requestId) return;
        console.error(error);
        setIsLoading(false);
      });
  }, [activeTab, end, isAllFunds, start]);

  const chartData = useMemo(
    () =>
      // The chart normalizes labels here so the rendering component can stay generic.
      selectedTimeSeries?.records.map((record) => ({
        date: record.date,
        fund: Number((record.cummulative_return ?? 0).toFixed(2)),
        benchmark: Number(
          (record.benchmark_cummulative_return ?? 0).toFixed(2),
        ),
        value: record.value,
        fundLabel: isAllFunds
          ? "All Funds"
          : (formatPortfolio(activeTab) ?? activeTab),
      })) ?? [],
    [activeTab, isAllFunds, selectedTimeSeries],
  );

  const metrics = useMemo(
    () => ({
      currentValue: selectedSummary
        ? formatCurrency(selectedSummary.value)
        : "--",
      returnPercent: selectedSummary
        ? formatPercent(selectedSummary.total_return)
        : "--",
      benchmarkValue: benchmarkSummary
        ? formatCurrency(benchmarkSummary.adjusted_close)
        : "--",
      benchmarkReturn: benchmarkSummary
        ? formatPercent(benchmarkSummary.total_return)
        : "--",
    }),
    [benchmarkSummary, selectedSummary],
  );

  const annualizedMetrics = useMemo(
    () =>
      calculateSummaryMetrics(
        true,
        selectedSummary,
        benchmarkSummary,
        view === "1year",
      ),
    [benchmarkSummary, selectedSummary, view],
  );

  const realizedMetrics = useMemo(
    () =>
      calculateSummaryMetrics(
        false,
        selectedSummary,
        benchmarkSummary,
        view === "1year",
      ),
    [benchmarkSummary, selectedSummary, view],
  );

  const fundMetrics = useMemo(() => {
    if (!selectedSummary || !benchmarkSummary) return undefined;

    const fundDailyReturns = selectedTimeSeries?.records.map(
      (record) => record.return_,
    );
    const benchmarkDailyReturns = selectedTimeSeries?.records.map(
      (record) => record.benchmark_return,
    );

    return {
      realized: {
        returnMetric: {
          fund: formatPercent(
            calculateAverageDailyReturn(fundDailyReturns, false) ?? 0,
          ),
          benchmark: formatPercent(
            calculateAverageDailyReturn(benchmarkDailyReturns, false) ?? 0,
          ),
        },
        volatility: {
          fund: formatPercent(realizedMetrics.fundVol ?? 0),
          benchmark: formatPercent(realizedMetrics.benchVol ?? 0),
        },
        sharpeRatio: {
          fund: formatFloat(realizedMetrics.fundSharpe ?? 0),
          benchmark: formatFloat(realizedMetrics.benchSharpe ?? 0),
        },
        alpha: formatPercent(realizedMetrics.fundAlpha ?? 0),
        trackingError: formatPercent(realizedMetrics.fundTE ?? 0),
        informationRatio: formatFloat(realizedMetrics.fundIR ?? 0),
      },
      annualized: {
        returnMetric: {
          fund: formatPercent(
            calculateAverageDailyReturn(fundDailyReturns, true) ?? 0,
          ),
          benchmark: formatPercent(
            calculateAverageDailyReturn(benchmarkDailyReturns, true) ?? 0,
          ),
        },
        volatility: {
          fund: formatPercent(annualizedMetrics.fundVol ?? 0),
          benchmark: formatPercent(annualizedMetrics.benchVol ?? 0),
        },
        sharpeRatio: {
          fund: formatFloat(annualizedMetrics.fundSharpe ?? 0),
          benchmark: formatFloat(annualizedMetrics.benchSharpe ?? 0),
        },
        alpha: formatPercent(annualizedMetrics.fundAlpha ?? 0),
        trackingError: formatPercent(annualizedMetrics.fundTE ?? 0),
        informationRatio: formatFloat(annualizedMetrics.fundIR ?? 0),
      },
      value: {
        fund: formatMillions(selectedSummary.value),
        benchmark: formatCurrency(benchmarkSummary.adjusted_close),
      },
      dividendValue: {
        fund: formatCurrency(selectedSummary.dividends),
        benchmark: formatCurrency(benchmarkSummary.dividends_per_share),
      },
      dividendYield: {
        fund: formatPercent(selectedSummary.dividend_yield),
        benchmark: formatPercent(benchmarkSummary.dividend_yield),
      },
      beta: formatFloat(selectedSummary.beta),
    };
  }, [
    annualizedMetrics,
    benchmarkSummary,
    realizedMetrics,
    selectedSummary,
    selectedTimeSeries,
  ]);

  const showMetricsSkeleton = isLoading || !fundMetrics;
  const totalReturnTooltip = getHeaderTooltips(false, [
    "Total Return",
  ] as const)["Total Return"];

  return (
    <PerformancePageShell>
      <PerformanceTitleRow
        title="Performance Metrics"
        subtitle={
          !isLoading && selectedSummary
            ? `as of ${formatDate(selectedSummary.end)}`
            : undefined
        }
      />

      <FundTabsBar
        activeTab={activeTab}
        onTabChange={handleActiveTabChange}
        actions={
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <FactorExposuresButton
                      fund={isAllFunds ? ALL_FUNDS_KEY : activeTab}
                      size="default"
                      className="px-[14px] py-2 text-sm"
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="border border-gray-200 bg-white px-2 py-1.5 text-left text-xs normal-case tracking-normal text-gray-900 shadow-md"
                >
                  Generate future performance forecasts based on historical data
                  and current trends.
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <DownloadCSVButton
                      start={start}
                      end={end}
                      size="default"
                      className="px-[14px] py-2 text-sm"
                      filenamePrefix={
                        isAllFunds ? "all_funds" : `portfolio_${activeTab}`
                      }
                      onDownload={(request) =>
                        isAllFunds
                          ? downloadAllFundsCSV(request)
                          : downloadPortfolioCSV({
                              ...request,
                              fund: activeTab,
                            })
                      }
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="border border-gray-200 bg-white px-2 py-1.5 text-left text-xs normal-case tracking-normal text-gray-900 shadow-md"
                >
                  Export the currently selected fund data to a CSV file for
                  external analysis.
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <PerformanceGraphRow>
          <PerformancePrimaryPane
            height={PERFORMANCE_PAGE_LAYOUT.graphPanelHeight}
          >
            <PerformanceGraphPanel
              height={PERFORMANCE_PAGE_LAYOUT.graphPanelHeight}
            >
              {isLoading ? (
                <ChartCardSkeleton />
              ) : (
                <>
                  {/* The chart header stays outside the chart so the plot area can use the remaining fixed height. */}
                  <TooltipProvider>
                    <div className="mb-2">
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-semibold">
                          {metrics.currentValue}
                        </h2>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex cursor-help items-center gap-1 text-lg font-medium text-gray-900">
                              {metrics.returnPercent}
                              <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="border border-gray-200 bg-white px-2 py-1.5 text-left text-xs normal-case tracking-normal text-gray-900 shadow-md"
                          >
                            {totalReturnTooltip}
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        Benchmark {metrics.benchmarkValue} |{" "}
                        {metrics.benchmarkReturn}
                      </p>
                    </div>
                  </TooltipProvider>

                  <div className="min-h-0 flex-1">
                    <PerformanceChart data={chartData} />
                  </div>

                  {/* Filters collapse to a select on mobile, but keep button tabs on larger screens. */}
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <DateFilterGroup
                      filters={timeFilters}
                      activeFilter={view}
                      onFilterChange={(nextView) => {
                        setView(nextView);
                        if (nextView !== "custom") {
                          const [nextStart, nextEnd] = getDateFromView(
                            nextView,
                            selectedFund,
                          );
                          setStart(nextStart);
                          setEnd(nextEnd);
                        }
                      }}
                      customStartDate={start}
                      customEndDate={end}
                      onCustomStartDateChange={setStart}
                      onCustomEndDateChange={setEnd}
                    />

                    <div className="flex gap-4 rounded border border-gray-300 bg-white/90 px-3 py-1.5 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-0.5 w-6 bg-[#1F5F3F]" />
                        <span className="text-xs">
                          {isAllFunds
                            ? "Fund"
                            : (formatPortfolio(activeTab) ?? "Fund")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-0.5 w-6 bg-[#6B7280] opacity-70" />
                        <span className="text-xs">Benchmark</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </PerformanceGraphPanel>
          </PerformancePrimaryPane>

          <PerformanceSidebar height={PERFORMANCE_PAGE_LAYOUT.graphPanelHeight}>
            {/* The right rail swaps summary content by tab, but always keeps the same slot size. */}
            <PerformanceSummaryPanel
              isAllFunds={isAllFunds}
              fund={activeTab}
              allPortfoliosSummary={allPortfoliosSummary}
              allHoldingsSummary={allHoldingsSummary}
              loading={isLoading}
              onPortfolioSelect={handleActiveTabChange}
              height={PERFORMANCE_PAGE_LAYOUT.graphPanelHeight}
            />
          </PerformanceSidebar>
        </PerformanceGraphRow>

        <PerformanceMetricsSection
          header={
            <MetricsBar
              metricMode={metricMode}
              setMetricMode={setMetricMode}
              activeRates={activeRates}
              setActiveRates={setActiveRates}
              activeTab={activeTab}
              embedded
            />
          }
        >
          {showMetricsSkeleton ? (
            <MetricsGridSkeleton />
          ) : (
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-stretch">
              <div
                className="min-w-0 w-full max-w-[1100px] lg:max-w-none"
                style={{
                  flex: `${benchmarkMetricCount} ${benchmarkMetricCount} 0%`,
                }}
              >
                <MetricsRow metrics={fundMetrics!} mode={metricMode} />
              </div>
              <div
                className="min-w-0 w-full max-w-[1100px] lg:max-w-none"
                style={{
                  flex: `${riskMetricCount} ${riskMetricCount} 0%`,
                }}
              >
                <RiskMetrics metrics={fundMetrics!} mode={metricMode} />
              </div>
            </div>
          )}
        </PerformanceMetricsSection>
      </div>
    </PerformancePageShell>
  );
}

function LoadingBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-gray-100 ${className}`} />;
}

function ChartCardSkeleton() {
  return (
    <>
      {/* The loading card mirrors the final fixed-height layout so the page does not shift after data loads. */}
      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <LoadingBlock className="h-8 w-48" />
          <LoadingBlock className="h-5 w-20" />
        </div>
        <LoadingBlock className="mt-1 h-4 w-40" />
      </div>

      <div className="min-h-0 flex-1 rounded border border-gray-100 bg-gray-50 px-3 py-3">
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-8">
            <LoadingBlock className="h-px w-full" />
            <LoadingBlock className="h-px w-full" />
            <LoadingBlock className="h-px w-full" />
            <LoadingBlock className="h-px w-full" />
          </div>
          <LoadingBlock className="h-36 w-full" />
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:hidden">
          <LoadingBlock className="h-9 w-full" />
        </div>
        <div className="hidden flex-wrap items-center gap-2 sm:flex">
          <LoadingBlock className="h-8 w-20" />
          <LoadingBlock className="h-8 w-20" />
          <LoadingBlock className="h-8 w-24" />
          <LoadingBlock className="h-8 w-24" />
          <LoadingBlock className="h-8 w-20" />
          <LoadingBlock className="h-8 w-20" />
        </div>
        <LoadingBlock className="h-7 w-44" />
      </div>
    </>
  );
}

function MetricsGridSkeleton() {
  return (
    // Mobile stacks the metric groups, while larger screens restore the side-by-side layout.
    <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-stretch">
      <div
        className="min-w-0 w-full max-w-[1100px] lg:max-w-none"
        style={{
          flex: `${benchmarkMetricCount} ${benchmarkMetricCount} 0%`,
        }}
      >
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
          <LoadingBlock className="mb-3 h-4 w-56" />
          <div className="-mx-1 overflow-x-auto pb-1 sm:mx-0 sm:overflow-visible sm:pb-0">
            <div
              className="flex min-w-max gap-3 px-1 sm:grid sm:min-w-0 sm:px-0"
              style={{
                gridTemplateColumns: `repeat(${benchmarkMetricCount}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: benchmarkMetricCount }).map((_, index) => (
                <LoadingBlock
                  key={index}
                  className="h-[110px] w-[160px] shrink-0 sm:w-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className="min-w-0 w-full max-w-[1100px] lg:max-w-none"
        style={{
          flex: `${riskMetricCount} ${riskMetricCount} 0%`,
        }}
      >
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
          <LoadingBlock className="mb-3 h-4 w-40" />
          <div className="-mx-1 overflow-x-auto pb-1 sm:mx-0 sm:overflow-visible sm:pb-0">
            <div
              className="flex min-w-max gap-3 px-1 sm:grid sm:min-w-0 sm:px-0"
              style={{
                gridTemplateColumns: `repeat(${riskMetricCount}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: riskMetricCount }).map((_, index) => (
                <LoadingBlock
                  key={index}
                  className="h-[110px] w-[160px] shrink-0 sm:w-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DateFilterGroup({
  filters,
  activeFilter,
  onFilterChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
}: {
  filters: readonly { label: string; value: string }[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  customStartDate: Date | undefined;
  customEndDate: Date | undefined;
  onCustomStartDateChange: Dispatch<SetStateAction<Date | undefined>>;
  onCustomEndDateChange: Dispatch<SetStateAction<Date | undefined>>;
}) {
  return (
    // Small screens get a compact select; larger screens keep the direct-access filter buttons.
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-full sm:hidden">
        <Select value={activeFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="h-9 w-full border-gray-300 bg-white text-sm">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {filters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden flex-wrap items-center gap-2 sm:flex">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className={
              activeFilter === filter.value
                ? "bg-[#002E5D] text-white hover:bg-[#002E5D] hover:text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {activeFilter === "custom" && (
        <>
          <InlineDateButton
            date={customStartDate}
            setDate={onCustomStartDateChange}
          />
          <InlineDateButton
            date={customEndDate}
            setDate={onCustomEndDateChange}
          />
        </>
      )}
    </div>
  );
}

function InlineDateButton({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-between font-normal"
        >
          {date ? date.toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          captionLayout="dropdown"
          onSelect={(nextDate) => {
            if (nextDate) {
              setDate(nextDate);
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
