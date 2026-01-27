"use client";
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TopNSelector } from "./ChartControls";
import { FactorData } from "@/app/factor-exposures/[fund]/page";
import { formatExposures, formatFactors } from "./FactorsDataTable";

export const description = "A bar chart with a custom label";

const chartConfig = {
  factor: {
    label: "factor",
    color: "#0047BA",
  },
  exposure: {
    label: "exposure",
    color: "#002E5D",
  },
} satisfies ChartConfig;

export function FactorsBarChart({
  chartData,
  showTop,
  setShowTop,
  onFactorClick,
  contributionMode,
}: {
  chartData: FactorData[];
  showTop?: number;
  setShowTop?: (v: number) => void;
  onFactorClick?: (factor: string) => void;
  contributionMode?: boolean;
}) {
  const [internalTopN, setInternalTopN] = useState<number>(showTop ?? 20);
  // keep internal in sync if parent-controlled value changes
  useEffect(() => {
    if (typeof showTop === "number") setInternalTopN(showTop);
  }, [showTop]);
  const displayTop = typeof showTop === "number" ? showTop : internalTopN;
  const displayNum = displayTop === 0 ? chartData.length : displayTop;
  const displayedData = chartData.slice(0, displayNum).map((d) => ({
    ...d,
    absExposure: Math.abs(d.exposure),
  }));
  const handleTopChange = (v: number) => {
    if (setShowTop) setShowTop(v);
    else setInternalTopN(v);
  };

  const chartConfigEffective = contributionMode
    ? {
        factor: { label: "holding", color: "#0047BA" },
        exposure: { label: "contribution", color: "#002E5D" },
      }
    : chartConfig;

  return (
    <Card className="background-muted h-[700px]">
      <CardHeader>
        <div className="flex w-full justify-end">
          <div className="flex items-center gap-2">
            <TopNSelector
              topN={displayTop}
              onValueChange={(v) => handleTopChange(v)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-5/6">
        <ChartContainer
          config={chartConfigEffective}
          className={` h-full w-full ${
            onFactorClick
              ? "[&_.recharts-rectangle.recharts-tooltip-cursor]:cursor-pointer [&_.recharts-bar-rectangle]:cursor-pointer"
              : ""
          }`}
        >
          <BarChart
            accessibilityLayer
            data={displayedData}
            layout="horizontal"
            barSize={60}
            onClick={(e: any) => {
              if (!onFactorClick) return;
              // Try several possible locations for the clicked payload/label
              const activePayload = e?.activePayload ?? e?.payload ?? null;
              const payload =
                Array.isArray(activePayload) && activePayload[0]
                  ? activePayload[0].payload
                  : (activePayload?.payload ?? activePayload);

              let factor: string | undefined;
              if (payload && typeof payload === "object") {
                factor = (payload as any).factor ?? (payload as any).name;
              } else if (typeof e?.activeLabel === "string") {
                factor = e.activeLabel;
              }

              if (factor) onFactorClick(String(factor));
            }}
            style={{ cursor: onFactorClick ? "pointer" : undefined }}
          >
            <CartesianGrid vertical={true} />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent />}
              labelFormatter={(v: string) =>
                contributionMode ? String(v) : formatFactors(String(v))
              }
            />
            <Bar
              dataKey="exposure"
              radius={4}
              barSize={100}
              label="position-top"
              fill="var(--color-exposure)"
              onClick={(data) => {
                const payload = data?.payload ?? data;
                const factor = payload?.factor ?? payload?.name;
                if (factor && typeof onFactorClick === "function")
                  onFactorClick(String(factor));
              }}
              style={{ cursor: onFactorClick ? "pointer" : undefined }}
            >
              <LabelList
                dataKey="exposure"
                position={
                  Math.min(...displayedData.map((d) => d.exposure)) < 0
                    ? "bottom"
                    : "top"
                }
                offset={6}
                className="font-bold fill-foreground"
                fontSize={10}
                formatter={(v: number) => formatExposures(v, 2)}
              />
            </Bar>
            <XAxis
              dataKey="factor"
              type="category"
              angle={-90}
              tick={{ textAnchor: "end" }}
              height={60}
              tickFormatter={(v: string) =>
                contributionMode ? String(v) : formatFactors(String(v))
              }
              interval={0}
              fontSize={10}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default FactorsBarChart;
