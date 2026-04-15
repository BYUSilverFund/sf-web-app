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
import { formatDate } from "@/lib/utils";

interface ChartDataPoint {
  date: string;
  fund: number;
  benchmark: number;
  value?: number;
  fundLabel?: string;
}

interface PerformanceChartProps {
  data: ChartDataPoint[];
}

// The custom tooltip keeps the chart copy aligned with the surrounding performance cards.
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const point = payload[0]?.payload as ChartDataPoint | undefined;
    return (
      <div className="bg-white border border-gray-300 rounded shadow-lg p-3 text-sm">
        <p className="font-semibold mb-3">
          {point?.date ? formatDate(point.date) : ""}
        </p>
        {typeof point?.value === "number" && (
          <p className="mb-2">
            $
            {point.value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        )}
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-[#1F5F3F]" />
          <p className="text-[#1F5F3F]">
            {point?.fundLabel ?? "Fund"} {payload[0].value}%
          </p>
        </div>
        {payload[1] && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#6B7280]" />
            <p className="text-[#6B7280]">Benchmark {payload[1].value}%</p>
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
        fill="white"
        stroke={stroke}
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={3} fill={stroke} />
    </g>
  );
};

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    // The parent card controls height, so the chart itself always stretches to fill the available slot.
    <div style={{ width: "100%", height: "100%", minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 15, right: 30, left: 20, bottom: 15 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            strokeOpacity={0.5}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="#888"
            tick={{ fill: "#4B5563", fontSize: 12 }}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
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
            type="natural"
            dataKey="fund"
            stroke="#1F5F3F"
            strokeWidth={3.5}
            dot={false}
            activeDot={<ActiveDot />}
            name="Fund"
            isAnimationActive={false}
          />
          <Line
            type="natural"
            dataKey="benchmark"
            stroke="#6B7280"
            strokeWidth={1.8}
            strokeOpacity={0.65}
            dot={false}
            activeDot={<ActiveDot />}
            name="Benchmark"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
