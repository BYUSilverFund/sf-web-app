import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts";
import { cn, formatCurrency } from "@/lib/utils";

export const PERFORMANCE_CHART_FUND_COLOR = "#002E5D";
export const PERFORMANCE_CHART_BENCHMARK_COLOR = "#4F6F8F";
const PERFORMANCE_CHART_FUND_LINE_COLOR = "#1F5F3F";
const PERFORMANCE_CHART_BENCHMARK_LINE_COLOR = "#6B7280";

const CHART_MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const CHART_FULL_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export interface PerformanceChartDataPoint {
  date: string;
  fund: number;
  benchmark: number;
  value?: number;
  fundLabel?: string;
}

interface ChartPoint extends PerformanceChartDataPoint {
  index: number;
}

interface PerformanceChartProps {
  data: PerformanceChartDataPoint[];
  preferredTickCount?: number;
}

interface PerformanceChartLegendProps {
  fundLabel?: string;
  benchmarkLabel?: string;
  className?: string;
}

function getXAxisTicks(
  chartData: ChartPoint[],
  preferredTickCount?: number,
  isShortRange?: boolean,
): number[] {
  if (chartData.length <= 1) {
    return chartData.map((point) => point.index);
  }

  const defaultTickCount = isShortRange
    ? chartData.length <= 8
      ? chartData.length
      : 6
    : chartData.length <= 10
      ? chartData.length
      : chartData.length <= 21
        ? 8
        : chartData.length <= 42
          ? 9
          : 10;

  const resolvedTickCount = Math.min(
    preferredTickCount ?? defaultTickCount,
    chartData.length,
  );
  const lastIndex = chartData.length - 1;

  return Array.from({ length: resolvedTickCount }, (_, index) =>
    resolvedTickCount === 1 ? 0 : (index * lastIndex) / (resolvedTickCount - 1),
  );
}

function parseChartDate(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function formatTooltipDate(date: string): string {
  if (!date) return "";
  return CHART_FULL_DATE_FORMATTER.format(new Date(parseChartDate(date)));
}

function formatChartAxisDate(date: string, isShortRange: boolean): string {
  if (!date) return "";
  const d = new Date(parseChartDate(date));
  return isShortRange
    ? CHART_FULL_DATE_FORMATTER.format(d)
    : CHART_MONTH_YEAR_FORMATTER.format(d);
}

function getChartDateForTick(
  chartData: ChartPoint[],
  tickValue: number,
): string {
  const nearestIndex = Math.max(
    0,
    Math.min(chartData.length - 1, Math.round(tickValue)),
  );
  return chartData[nearestIndex]?.date ?? "";
}

function formatTooltipPercent(value: unknown): string {
  return typeof value === "number" ? `${value.toFixed(2)}%` : `${value}%`;
}

// The custom tooltip keeps the chart copy aligned with the surrounding performance cards.
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const point = payload[0]?.payload as ChartPoint | undefined;
    const labelValue =
      typeof label === "string"
        ? formatTooltipDate(label)
        : point?.date
          ? formatTooltipDate(point.date)
          : "";

    return (
      <div className="bg-white border border-gray-300 rounded shadow-lg p-3 text-sm">
        <p className="font-semibold mb-3">{labelValue}</p>
        {typeof point?.value === "number" && (
          <p className="mb-2">{formatCurrency(point.value)}</p>
        )}
        <div className="flex items-center gap-2 mb-1">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: PERFORMANCE_CHART_FUND_LINE_COLOR }}
          />
          <p className="text-[#1F5F3F]">
            {point?.fundLabel ?? "Fund"}{" "}
            {formatTooltipPercent(payload[0].value)}
          </p>
        </div>
        {payload[1] && (
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: PERFORMANCE_CHART_BENCHMARK_LINE_COLOR,
              }}
            />
            <p className="text-[#6B7280]">
              Benchmark {formatTooltipPercent(payload[1].value)}
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// The active dot makes hover states easier to see without adding noise to the resting chart.
const ActiveDot = ({
  cx,
  cy,
  stroke,
}: {
  cx?: number;
  cy?: number;
  stroke?: string;
}) => {
  if (cx === undefined || cy === undefined || !stroke) {
    return null;
  }

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={PERFORMANCE_CHART_FUND_COLOR}
        stroke="white"
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={2.5} fill="white" />
    </g>
  );
};

export function PerformanceChart({
  data,
  preferredTickCount,
}: PerformanceChartProps) {
  const chartData: ChartPoint[] = data.map((point, index) => ({
    ...point,
    index,
  }));
  const isShortRange =
    chartData.length < 2 ||
    parseChartDate(chartData[chartData.length - 1].date) -
      parseChartDate(chartData[0].date) <
      93 * 24 * 60 * 60 * 1000;
  const xAxisTicks = getXAxisTicks(chartData, preferredTickCount, isShortRange);

  return (
    // The parent card controls height, so the chart itself always stretches to fill the available slot.
    <div style={{ width: "100%", height: "100%", minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 15, right: 30, left: 20, bottom: 15 }}
          style={{ shapeRendering: "geometricPrecision" }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            strokeOpacity={0.5}
            vertical={false}
          />
          <XAxis
            dataKey="index"
            type="number"
            domain={[0, Math.max(chartData.length - 1, 0)]}
            ticks={xAxisTicks}
            interval={0}
            axisLine={{ stroke: "#888", strokeWidth: 1 }}
            tickLine={{ stroke: "#888", strokeWidth: 1 }}
            tickSize={6}
            tickMargin={8}
            minTickGap={0}
            stroke="#888"
            tick={{ fill: "#4B5563", fontSize: 12 }}
            tickFormatter={(value) =>
              formatChartAxisDate(
                getChartDateForTick(chartData, Number(value)),
                isShortRange,
              )
            }
          />
          <YAxis
            stroke="#888"
            tick={{ fill: "#4B5563", fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#002E5D",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
          />
          <Line
            type="linear"
            dataKey="fund"
            stroke={PERFORMANCE_CHART_FUND_LINE_COLOR}
            strokeWidth={3.5}
            dot={false}
            activeDot={<ActiveDot />}
            name="Fund"
            strokeLinecap="square"
            strokeLinejoin="miter"
            isAnimationActive={false}
          />
          <Line
            type="linear"
            dataKey="benchmark"
            stroke={PERFORMANCE_CHART_BENCHMARK_LINE_COLOR}
            strokeWidth={2.2}
            dot={false}
            activeDot={<ActiveDot />}
            name="Benchmark"
            strokeLinecap="square"
            strokeLinejoin="miter"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PerformanceChartLegend({
  fundLabel = "Fund",
  benchmarkLabel = "Benchmark",
  className,
}: PerformanceChartLegendProps) {
  return (
    <div
      className={cn(
        "flex gap-4 rounded border border-gray-300 bg-white/90 px-3 py-1.5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: PERFORMANCE_CHART_FUND_LINE_COLOR }}
        />
        <span className="text-xs">{fundLabel}</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: PERFORMANCE_CHART_BENCHMARK_LINE_COLOR }}
        />
        <span className="text-xs">{benchmarkLabel}</span>
      </div>
    </div>
  );
}
