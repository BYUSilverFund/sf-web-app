"use client";

import { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getFundBetaChart } from "@/lib/api/betaChart";
import type { FundBetaChartData } from "@/lib/types";

const DOMAIN: [number, number] = [-0.03, 0.03];
const TICKS = [-0.03, -0.015, 0, 0.015, 0.03];

const toPercent = (v: number) => `${(v * 100).toFixed(0)}%`;

const tooltipFormatter = (value: unknown, name: string | number) => {
  const label = name === "fund_return" ? "Fund" : "Benchmark";
  const pct = ((value as number) * 100).toFixed(2) + "%";
  return (
    <span>
      {label}: {pct}
    </span>
  );
};

export function UndergradBetaChart() {
  const [data, setData] = useState<FundBetaChartData | null>(null);

  useEffect(() => {
    getFundBetaChart()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  return (
    <div className="w-full">
      <p className="mb-2 text-center text-xs font-medium text-foreground">
        Regression Line for the Daily Excess Returns of All Funds vs IWV
      </p>

      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl">
          {/* Y-axis label */}
          <div className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-[11px] text-muted-foreground">
            Portfolio Daily Excess Return
          </div>

          {/* Legend */}
          <div className="absolute left-20 top-4 z-[1] rounded border border-black/10 bg-white/90 px-2 py-1 text-[10px] leading-[1.4] text-muted-foreground">
            <div>
              {data.start} – {data.end}
            </div>
            <div className="font-semibold text-foreground">
              β = {data.beta.toFixed(2)}
            </div>
          </div>

          <ChartContainer config={{}} className="h-80 w-full">
            <ScatterChart margin={{ top: 16, right: 32, bottom: 40, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.07)" />

              <XAxis
                type="number"
                dataKey="benchmark_return"
                domain={DOMAIN}
                ticks={TICKS}
                tickFormatter={toPercent}
                tick={{ fontSize: 11 }}
                label={{
                  value: "IWV Daily Excess Return",
                  position: "insideBottom",
                  offset: -18,
                  style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
                }}
              />

              <YAxis
                type="number"
                dataKey="fund_return"
                domain={DOMAIN}
                ticks={TICKS}
                tickFormatter={toPercent}
                tick={{ fontSize: 11 }}
                width={40}
              />

              <ChartTooltip
                content={<ChartTooltipContent formatter={tooltipFormatter} />}
              />

              <Scatter
                data={data.points}
                fill="rgba(0,38,84,0.25)"
                stroke="rgba(0,38,84,0.85)"
                strokeWidth={0.5}
              />

              <ReferenceLine
                segment={[
                  { x: DOMAIN[0], y: DOMAIN[0] * data.beta },
                  { x: DOMAIN[1], y: DOMAIN[1] * data.beta },
                ]}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1.5}
                strokeDasharray="5 3"
              />
            </ScatterChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
