"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { format } from "date-fns";
import Link from "next/link";
import { ChevronDownIcon, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";

import { DownloadCSVButton } from "@/components/DownloadCSVButton";
import { FactorExposuresButton } from "@/components/forecast/FactorExposuresButton";
import { MetricCard } from "@/components/MetricCard";
import { MetricModeToggle } from "@/components/MetricModeToggle";
import { PerformanceChart } from "@/components/PerformanceChart";
import {
  PERFORMANCE_PAGE_LAYOUT,
  PerformanceChartCard,
  PerformanceFlexSidebarPane,
  PerformanceGraphRow,
  PerformanceMetricsSection,
  PerformancePageShell,
  PerformancePrimaryPane,
  PerformanceSectionCard,
  PerformanceStackedSidebar,
  PerformanceTitleRow,
  PerformanceToolbar,
} from "@/components/PerformancePageLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { getBenchmarkSummary } from "@/lib/api/benchmark";
import { downloadHoldingCSV } from "@/lib/api/csvDownloads";
import {
  getDividends,
  getHoldingSummary,
  getHoldingTimeSeries,
  getTrades,
} from "@/lib/api/holding";
import { calculateSummaryMetrics } from "@/lib/RealizedVsAnnualizedCalculations";
import { getHeaderTooltip, getHeaderTooltips } from "@/lib/tabletooltips";
import type {
  BenchmarkRequest,
  BenchmarkSummaryResponse,
  DividendsResponse,
  HoldingRequest,
  HoldingSummaryResponse,
  HoldingTimeSeriesResponse,
  TradesResponse,
} from "@/lib/types";
import {
  formatDate,
  formatFloat,
  formatCurrency,
  formatPercent,
  formatPortfolio,
  getDateFromView,
} from "@/lib/utils";

const timeFilters = [
  { label: "Cohort", value: "cohort" },
  { label: "1 Week", value: "1week" },
  { label: "1 Month", value: "1month" },
  { label: "3 Months", value: "3months" },
  { label: "1 Year", value: "1year" },
  { label: "Max", value: "max" },
  { label: "Custom", value: "custom" },
] as const;

function getMeanReturn(
  values: number[] | undefined,
  annualized: boolean,
): number | undefined {
  if (!values?.length) return undefined;

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return annualized ? mean * 252 : mean * values.length;
}

function formatOptionalPercent(value: number | undefined): string {
  return typeof value === "number" ? formatPercent(value) : "--";
}

function formatOptionalFloat(value: number | undefined): string {
  return typeof value === "number" ? formatFloat(value) : "--";
}

function formatOptionalCurrency(value: number | undefined): string {
  return typeof value === "number" ? formatCurrency(value) : "--";
}

const HOLDING_LAYOUT = {
  sidebarGap: PERFORMANCE_PAGE_LAYOUT.sidebarStackGap,
  // The final ratio gives trades slightly more room while still leaving space for the latest dividend card.
  dividendRatio: 1.7,
  tradesRatio: 3.3,
} as const;
const holdingBenchmarkMetricCount = 5;
const holdingRiskMetricCount = 2;

function LoadingBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-gray-100 ${className}`} />;
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

function HoldingDateFilterGroup({
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
    // The holding page mirrors the mobile filter behavior from the main performance overview.
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

function HoldingSideCard({
  title,
  children,
  className = "",
  titleClassName = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  return (
    // Both stacked sidebar cards share this wrapper so their typography and chrome stay aligned.
    <div
      className={`flex h-full w-full flex-col rounded border border-gray-300 bg-white shadow-sm ${className}`}
    >
      <h3
        className={`text-[17px] font-semibold leading-tight ${titleClassName}`}
      >
        {title}
      </h3>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

function MetricsCardSkeleton({ count }: { count: number }) {
  return (
    <div className="-mx-1 overflow-x-auto pb-1 sm:mx-0 sm:overflow-visible sm:pb-0">
      <div
        className="flex min-w-max gap-3 px-1 sm:grid sm:min-w-0 sm:px-0"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="h-[110px] w-[160px] shrink-0 animate-pulse rounded-lg border border-gray-200 bg-gray-100 sm:w-full"
          />
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const params = useParams<{ fund: string; holding: string }>();
  const requestSequence = useRef(0);
  const [view, setView] = useState("max");
  const [start, setStart] = useState<Date | undefined>(
    getDateFromView("max", params.fund)[0],
  );
  const [end, setEnd] = useState<Date | undefined>(
    getDateFromView("max", params.fund)[1],
  );
  const [metricMode, setMetricMode] = useState<"realized" | "annualized">(
    "realized",
  );
  const [holdingSummary, setHoldingSummary] =
    useState<HoldingSummaryResponse>();
  const [benchmarkSummary, setBenchmarkSummary] =
    useState<BenchmarkSummaryResponse>();
  const [holdingTimeSeries, setHoldingTimeSeries] =
    useState<HoldingTimeSeriesResponse>();
  const [dividends, setDividends] = useState<DividendsResponse>();
  const [trades, setTrades] = useState<TradesResponse>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (view === "custom") return;

    const [nextStart, nextEnd] = getDateFromView(view, params.fund);
    setStart(nextStart);
    setEnd(nextEnd);
  }, [params.fund, view]);

  useEffect(() => {
    if (!start || !end) return;
    const requestId = ++requestSequence.current;

    const holdingRequest: HoldingRequest = {
      fund: params.fund,
      ticker: params.holding,
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
    };

    setIsLoading(true);

    Promise.all([
      getHoldingSummary(holdingRequest),
      getHoldingTimeSeries(holdingRequest),
      getDividends(holdingRequest),
      getTrades(holdingRequest),
    ])
      .then(async ([summary, timeSeries, dividendsData, tradesData]) => {
        const benchmarkRequest: BenchmarkRequest = {
          start: summary.start,
          end: summary.end,
        };
        const benchmark = await getBenchmarkSummary(benchmarkRequest);
        if (requestSequence.current !== requestId) return;

        setHoldingSummary(summary);
        setHoldingTimeSeries(timeSeries);
        setDividends(dividendsData);
        setTrades(tradesData);
        setBenchmarkSummary(benchmark);
        setIsLoading(false);
      })
      .catch((error) => {
        if (requestSequence.current !== requestId) return;
        console.error(error);
        setIsLoading(false);
      });
  }, [end, params.fund, params.holding, start]);

  const chartData = useMemo(
    () =>
      // The generic chart component expects the holding label to be precomputed by the page.
      holdingTimeSeries?.records.map((record) => ({
        date: record.date,
        fund: Number((record.cummulative_return ?? 0).toFixed(2)),
        benchmark: Number(
          (record.benchmark_cummulative_return ?? 0).toFixed(2),
        ),
        value: record.value,
        fundLabel: params.holding,
      })) ?? [],
    [holdingTimeSeries, params.holding],
  );

  const realizedMetrics = useMemo(
    () =>
      calculateSummaryMetrics(
        false,
        holdingSummary,
        benchmarkSummary,
        view === "1year",
      ),
    [benchmarkSummary, holdingSummary, view],
  );

  const annualizedMetrics = useMemo(
    () =>
      calculateSummaryMetrics(
        true,
        holdingSummary,
        benchmarkSummary,
        view === "1year",
      ),
    [benchmarkSummary, holdingSummary, view],
  );

  const displayMetrics =
    metricMode === "annualized" ? annualizedMetrics : realizedMetrics;
  const isAnnualized = metricMode === "annualized";
  const holdingDailyReturns = holdingTimeSeries?.records.map(
    (record) => record.return_,
  );
  const benchmarkDailyReturns = holdingTimeSeries?.records.map(
    (record) => record.benchmark_return,
  );

  const sharedMetricTooltips = getHeaderTooltips(isAnnualized, [
    "Value",
    "Volatility",
    "Dividends",
    "Dividend Yield",
    "Alpha",
    "Beta",
  ] as const);
  const averageReturnsTooltip = getHeaderTooltip(
    isAnnualized,
    "AverageReturns",
  );

  const metricTooltips = {
    value: sharedMetricTooltips.Value,
    volatility: sharedMetricTooltips.Volatility,
    averageReturns: averageReturnsTooltip,
    dividends: sharedMetricTooltips.Dividends,
    dividendYield: sharedMetricTooltips["Dividend Yield"],
    alpha: sharedMetricTooltips.Alpha,
    beta: sharedMetricTooltips.Beta,
  } as const;

  const latestDividend = useMemo(() => {
    if (!dividends?.dividends?.length) return undefined;

    return [...dividends.dividends].sort((a, b) =>
      b.date.localeCompare(a.date),
    )[0];
  }, [dividends?.dividends]);
  const latestTrades = trades?.trades?.slice(0, 5) ?? [];
  const totalReturnTooltip = getHeaderTooltip(false, "Total Return");
  const displayedHoldingVolatility =
    displayMetrics.fundVol ?? holdingSummary?.volatility;
  const displayedBenchmarkVolatility =
    displayMetrics.benchVol ?? benchmarkSummary?.volatility;
  const displayedHoldingDividends = holdingSummary?.dividends;
  const displayedHoldingDividendYield = holdingSummary?.dividend_yield;
  const displayedHoldingAlpha =
    displayMetrics.fundAlpha ?? holdingSummary?.alpha;
  const displayedHoldingAverageReturn = getMeanReturn(
    holdingDailyReturns,
    isAnnualized,
  );
  const displayedBenchmarkAverageReturn = getMeanReturn(
    benchmarkDailyReturns,
    isAnnualized,
  );

  return (
    <PerformancePageShell>
      <PerformanceTitleRow
        title={params.holding}
        subtitle={
          holdingSummary ? `as of ${formatDate(holdingSummary.end)}` : undefined
        }
      />

      <PerformanceToolbar>
        <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="px-[14px] py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors h-auto"
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
              className="px-[14px] py-2 !bg-[#002E5D] !border-[#002E5D] border rounded text-sm !text-white hover:!bg-[#002E5D] hover:!text-white h-auto"
            >
              Ticker: <span className="font-semibold">{params.holding}</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:shrink-0">
            <FactorExposuresButton
              fund={params.fund}
              holding={params.holding}
              size="default"
              className="px-[14px] py-2 bg-transparent text-[#002E5D] border border-[#002E5D]/30 text-sm rounded hover:bg-[#002E5D]/5 transition-colors h-auto"
            />
            <DownloadCSVButton
              key={`holding-csv-${params.fund}-${params.holding}-${start}-${end}`}
              start={start}
              end={end}
              size="default"
              className="px-[14px] py-2 bg-transparent text-[#002E5D] border border-[#002E5D]/30 text-sm rounded hover:bg-[#002E5D]/5 transition-colors h-auto"
              filenamePrefix={`${params.fund}_${params.holding}`}
              onDownload={(req) =>
                downloadHoldingCSV({
                  ...req,
                  fund: params.fund,
                  ticker: params.holding,
                })
              }
            />
          </div>
        </div>
      </PerformanceToolbar>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <PerformanceGraphRow>
          <PerformancePrimaryPane>
            <PerformanceChartCard>
              {isLoading ? (
                <>
                  {/* The loading card mirrors the final chart/filter composition so the fixed layout stays stable. */}
                  <div className="mb-3">
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
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="w-full sm:hidden">
                      <LoadingBlock className="h-9 w-full" />
                    </div>
                    <div className="hidden flex-wrap items-center gap-2 sm:flex">
                      <LoadingBlock className="h-8 w-20" />
                      <LoadingBlock className="h-8 w-20" />
                      <LoadingBlock className="h-8 w-20" />
                      <LoadingBlock className="h-8 w-24" />
                      <LoadingBlock className="h-8 w-24" />
                      <LoadingBlock className="h-8 w-20" />
                    </div>
                    <LoadingBlock className="h-7 w-40" />
                  </div>
                </>
              ) : (
                <>
                  {/* The chart header remains outside the graph to preserve a consistent chart drawing area. */}
                  <TooltipProvider>
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-semibold">
                          {holdingSummary
                            ? formatCurrency(holdingSummary.value)
                            : "--"}
                        </h2>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex cursor-help items-center gap-1 text-lg font-medium text-gray-900">
                              {holdingSummary
                                ? formatPercent(holdingSummary.total_return)
                                : "--"}
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
                        Benchmark{" "}
                        {benchmarkSummary
                          ? formatCurrency(benchmarkSummary.adjusted_close)
                          : "--"}{" "}
                        |{" "}
                        {benchmarkSummary
                          ? formatPercent(benchmarkSummary.total_return)
                          : "--"}
                      </p>
                    </div>
                  </TooltipProvider>

                  <div className="min-h-0 flex-1">
                    <PerformanceChart data={chartData} />
                  </div>

                  {/* Mobile gets a select-based filter control; desktop keeps the current quick-select buttons. */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <HoldingDateFilterGroup
                      filters={timeFilters}
                      activeFilter={view}
                      onFilterChange={setView}
                      customStartDate={start}
                      customEndDate={end}
                      onCustomStartDateChange={setStart}
                      onCustomEndDateChange={setEnd}
                    />

                    <div className="flex gap-4 rounded border border-gray-300 bg-white/90 px-3 py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-0.5 w-6 bg-[#1F5F3F]" />
                        <span className="text-xs">Ticker</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-0.5 w-6 bg-[#6B7280] opacity-70" />
                        <span className="text-xs">Benchmark</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </PerformanceChartCard>
          </PerformancePrimaryPane>

          <PerformanceStackedSidebar gap={HOLDING_LAYOUT.sidebarGap}>
            <PerformanceFlexSidebarPane ratio={HOLDING_LAYOUT.tradesRatio}>
              <HoldingSideCard
                title="Last 5 Trades"
                className="px-4 py-3"
                titleClassName="mb-2"
              >
                {isLoading ? (
                  <>
                    {/* This skeleton matches the final five-row trade card so the sidebar split does not jump. */}
                    <div className="min-h-0 flex-1 space-y-0">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2 border-b border-gray-200 py-2.5 last:border-b-0"
                        >
                          <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                          <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 border-t border-gray-200 pt-2">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                    </div>
                  </>
                ) : latestTrades.length === 0 ? (
                  <div className="text-sm text-gray-500">None</div>
                ) : (
                  <>
                    {/* Trade rows intentionally keep the date fixed-width so the action text can flex beside it. */}
                    <div className="min-h-0 flex-1 space-y-0">
                      {latestTrades.map((trade, index) => (
                        <div
                          key={`${trade.date}-${index}`}
                          className="flex items-center justify-between gap-2 border-b border-gray-200 py-2.5 last:border-b-0"
                        >
                          <div className="shrink-0 text-sm font-semibold leading-tight text-[#002E5D]">
                            {trade.date}
                          </div>
                          <div className="min-w-0 text-sm leading-tight text-right text-gray-900">
                            {trade.type} {trade.shares} at{" "}
                            {formatCurrency(trade.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 border-t border-gray-200 pt-2">
                      <Link
                        href={`/performance/${params.fund}/${params.holding}/trades`}
                        className="text-sm text-[#002E5D] hover:underline"
                      >
                        View all trades
                      </Link>
                    </div>
                  </>
                )}
              </HoldingSideCard>
            </PerformanceFlexSidebarPane>

            <PerformanceFlexSidebarPane ratio={HOLDING_LAYOUT.dividendRatio}>
              <HoldingSideCard
                title="Last Dividend Received"
                className="px-4 py-3"
                titleClassName="mb-1.5"
              >
                {isLoading ? (
                  <>
                    {/* The dividend skeleton uses the same compressed spacing as the final card. */}
                    <div className="h-7 w-20 animate-pulse rounded bg-gray-100" />
                    <div className="mt-1.5 flex-1 space-y-1.5">
                      <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                      <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
                    </div>
                    <div className="mt-auto border-t border-gray-200 pt-2">
                      <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                    </div>
                  </>
                ) : latestDividend ? (
                  <>
                    <div className="text-lg font-semibold leading-tight text-gray-900">
                      {formatCurrency(latestDividend.dividends)}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-tight text-gray-500">
                      Paid on {latestDividend.date} at{" "}
                      {formatCurrency(latestDividend.dividends_per_share)} per
                      share.
                    </p>
                    <div className="mt-auto border-t border-gray-200 pt-2">
                      <Link
                        href={`/performance/${params.fund}/${params.holding}/dividends`}
                        className="text-sm text-[#002E5D] hover:underline"
                      >
                        View all dividends
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">None</div>
                )}
              </HoldingSideCard>
            </PerformanceFlexSidebarPane>
          </PerformanceStackedSidebar>
        </PerformanceGraphRow>

        <PerformanceMetricsSection
          header={
            <PerformanceToolbar className="border-0 rounded-none shadow-none">
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold">Metrics</h2>
                <MetricModeToggle
                  metricMode={metricMode}
                  setMetricMode={setMetricMode}
                />
              </div>
            </PerformanceToolbar>
          }
        >
          {/* Mobile stacks the two metric groups, while larger screens restore the dashboard split. */}
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-stretch">
            <div
              className="min-w-0 w-full max-w-[1100px] lg:max-w-none"
              style={{
                flex: `${holdingBenchmarkMetricCount} ${holdingBenchmarkMetricCount} 0%`,
              }}
            >
              <PerformanceSectionCard className="px-4 py-3 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700">
                  Compared To Benchmark Metrics
                </h3>
                {isLoading ? (
                  <MetricsCardSkeleton count={holdingBenchmarkMetricCount} />
                ) : (
                  <div className="-mx-1 overflow-x-auto pb-1 sm:mx-0 sm:overflow-visible sm:pb-0">
                    <div
                      className="flex min-w-max gap-3 px-1 sm:grid sm:min-w-0 sm:px-0"
                      style={{
                        gridTemplateColumns: `repeat(${holdingBenchmarkMetricCount}, minmax(0, 1fr))`,
                      }}
                    >
                      <MetricCard
                        title="Value"
                        tooltip={metricTooltips.value}
                        value={
                          holdingSummary
                            ? formatCurrency(holdingSummary.value)
                            : "--"
                        }
                        benchmark={
                          benchmarkSummary
                            ? formatCurrency(benchmarkSummary.adjusted_close)
                            : "--"
                        }
                      />
                      <MetricCard
                        title="Average Returns"
                        tooltip={metricTooltips.averageReturns}
                        value={formatOptionalPercent(
                          displayedHoldingAverageReturn,
                        )}
                        benchmark={formatOptionalPercent(
                          displayedBenchmarkAverageReturn,
                        )}
                      />
                      <MetricCard
                        title="Volatility"
                        tooltip={metricTooltips.volatility}
                        value={formatOptionalPercent(
                          displayedHoldingVolatility,
                        )}
                        benchmark={formatOptionalPercent(
                          displayedBenchmarkVolatility,
                        )}
                      />
                      <MetricCard
                        title="Dividends"
                        tooltip={metricTooltips.dividends}
                        value={formatOptionalCurrency(
                          displayedHoldingDividends,
                        )}
                        benchmark={
                          benchmarkSummary
                            ? formatCurrency(
                                benchmarkSummary.dividends_per_share,
                              )
                            : "--"
                        }
                      />
                      <MetricCard
                        title="Dividend Yield"
                        tooltip={metricTooltips.dividendYield}
                        value={formatOptionalPercent(
                          displayedHoldingDividendYield,
                        )}
                        benchmark={
                          benchmarkSummary
                            ? formatPercent(benchmarkSummary.dividend_yield)
                            : "--"
                        }
                      />
                    </div>
                  </div>
                )}
              </PerformanceSectionCard>
            </div>

            <div
              className="min-w-0 w-full max-w-[1100px] lg:max-w-none"
              style={{
                flex: `${holdingRiskMetricCount} ${holdingRiskMetricCount} 0%`,
              }}
            >
              <PerformanceSectionCard className="px-4 py-3 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700">
                  Relative Risk Metrics
                </h3>
                {isLoading ? (
                  <MetricsCardSkeleton count={2} />
                ) : (
                  <div className="-mx-1 overflow-x-auto pb-1 sm:mx-0 sm:overflow-visible sm:pb-0">
                    <div
                      className="flex min-w-max gap-3 px-1 sm:grid sm:min-w-0 sm:px-0"
                      style={{
                        gridTemplateColumns: `repeat(${holdingRiskMetricCount}, minmax(0, 1fr))`,
                      }}
                    >
                      <MetricCard
                        title="Alpha"
                        tooltip={metricTooltips.alpha}
                        value={formatOptionalPercent(displayedHoldingAlpha)}
                      />
                      <MetricCard
                        title="Beta"
                        tooltip={metricTooltips.beta}
                        value={formatOptionalFloat(holdingSummary?.beta)}
                      />
                    </div>
                  </div>
                )}
              </PerformanceSectionCard>
            </div>
          </div>
        </PerformanceMetricsSection>
      </div>
    </PerformancePageShell>
  );
}
