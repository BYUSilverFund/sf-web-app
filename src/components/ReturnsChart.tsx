import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { formatPercent, formatCurrency } from "@/lib/utils";

interface TooltipData {
  value: number;
  cummulative_return: number;
  benchmark_cummulative_return: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: TooltipData }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-background border border-border rounded-md p-4 space-y-2">
        <div>{label}</div>
        <div>{formatCurrency(data.value)}</div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#82ca9d]"></span>
          <div>All Funds</div>
          <div>{formatPercent(data.cummulative_return)}</div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#8884d8]"></span>
          <div>Benchmark</div>
          <div>{formatPercent(data.benchmark_cummulative_return)}</div>
        </div>
      </div>
    );
  }

  return null;
}

export function ReturnsChart({ data }: { data: object[] }) {
  const chartConfig = {
    cummulative_return: {
      label: "All Funds",
      color: "var(--chart-1)",
    },
    benchmark_cummulative_return: {
      label: "Benchmark",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-[600px] w-[1000] py-4">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <YAxis tickFormatter={(value) => formatPercent(value, 0)} />
        <Line
          dataKey="cummulative_return"
          stroke="#82ca9d"
          strokeWidth={3}
          dot={false}
        />
        <Line
          dataKey="benchmark_cummulative_return"
          stroke="#8884d8"
          strokeWidth={3}
          dot={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          align="left"
          verticalAlign="top"
          iconType="plainline"
          height={40}
          formatter={(value: string) =>
            ({
              cummulative_return: "All Funds",
              benchmark_cummulative_return: "Benchmark",
            })[value]
          }
        />
      </LineChart>
    </ChartContainer>
  );
}
