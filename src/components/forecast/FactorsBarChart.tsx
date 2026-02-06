"use client";
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TopNSelector, ViewSelector } from "../ChartControls";
import { FactorData } from "@/app/forecast/[fund]/page";
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
  headerTitle,
  view,
  onViewChange,
}: {
  chartData: FactorData[];
  showTop?: number;
  setShowTop?: (v: number) => void;
  onFactorClick?: (factor: string) => void;
  contributionMode?: boolean;
  headerTitle?: React.ReactNode;
  // optional chart controls
  view?: string;
  onViewChange?: (v: string) => void;
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
    <div className="h-auto">
      <CardHeader>
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-4">
            {headerTitle ? (
              <div className="inline-flex items-center gap-2 whitespace-nowrap text-lg font-semibold">
                {headerTitle}
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {view !== undefined && onViewChange ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block">Display</span>
                <ViewSelector
                  view={view}
                  onValueChange={(v) => onViewChange(v)}
                />
              </div>
            ) : null}
            <TopNSelector
              topN={displayTop}
              onValueChange={(v) => handleTopChange(v)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-auto">
        <ChartContainer config={chartConfigEffective} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={displayedData}
            layout="horizontal"
            barSize={60}
            onClick={(e) => {
              if (!onFactorClick) return;
              const factor = e?.activePayload?.[0]?.payload?.factor;
              if (factor) onFactorClick(String(factor));
            }}
            style={{ cursor: onFactorClick ? "pointer" : undefined }}
          >
            <CartesianGrid vertical={true} />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  formatter={(value) => {
                    const num = Number(value ?? 0);
                    return contributionMode
                      ? `${formatExposures(num * 100, 2, true)}%`
                      : formatExposures(num, 2, true);
                  }}
                />
              }
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
                formatter={(v: string) => {
                  const num = Number(v ?? 0);
                  return contributionMode
                    ? `${formatExposures(num * 100, 2, true)}%`
                    : formatExposures(num, 2, true);
                }}
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
    </div>
  );
}

export default FactorsBarChart;
