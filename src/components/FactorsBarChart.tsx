"use client";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { formatPortfolio } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FundSelector, TopNSelector } from "./ChartControls";

export const description = "A bar chart with a custom label";

const chartConfig = {
  absExposure: {
    label: "exposure",
    color: "#002E5D",
  },
  factor: {
    label: "factor",
    color: "#0047BA",
  },
  exposure: {
    label: "exposure",
    color: "#002E5D",
  },
} satisfies ChartConfig;

function formatExposures(n: number, decimals = 3) {
  if (n === 0) return "0";
  if (n === 1) return "1";
  const s = n.toFixed(decimals).replace(/\.?0+$/, "");
  return Math.abs(n) < 1 ? s.replace(/^(-?)0\./, "$1.") : s;
}

function formatFactors(factor: string) {
  return (
    factor
      .replace(/^USSLOWL_/, "")
      .charAt(0)
      .toUpperCase() +
    factor
      .replace(/^USSLOWL_/, "")
      .slice(1)
      .toLowerCase()
  );
}

export function FactorsBarChart({
  fund,
  chartData,
  funds,
  excludedHoldings,
}: {
  fund: string;
  chartData: { factor: string; exposure: number }[];
  funds?: string[];
  excludedHoldings?: string[];
}) {
  const router = useRouter();
  const [topN, setTopN] = useState<string>("20");
  const displayNum = topN === "all" ? chartData.length : Number(topN ?? 20);
  const displayedData = chartData.slice(0, displayNum).map((d) => ({
    ...d,
    absExposure: Math.abs(d.exposure),
  }));
  const chartHeight = 450;
  const chartBarWidth = 60;
  const chartWidth = Math.max(800, displayedData.length * chartBarWidth);
  const fundKeys = [
    "all_funds",
    "grad",
    "undergrad",
    "quant",
    "brigham_capital",
    "quant_paper",
  ];
  return (
    <Card className="background-muted h-[700px]">
      <CardHeader className="rounded-xl border bg-card text-card-foreground shadow sm:m-2 sm:flex space-y-2 sm:space-y-0 p-4 gap-2 items-center">
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle>
              <div className="flex items-center gap-3">
                <span>Factor Exposures for</span>
                <FundSelector
                  fund={fund}
                  funds={funds}
                  onValueChange={(v) => router.push(`/factor-exposures/${v}`)}
                />
              </div>
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <TopNSelector topN={topN} onValueChange={(v) => setTopN(v)} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-5/6">
        <ChartContainer
          config={chartConfig}
          className=" h-full w-full rounded-xl border bg-card text-card-foreground shadow sm:flex space-y-2 sm:space-y-0 p-4 gap-2 items-center"
        >
          <BarChart
            accessibilityLayer
            data={displayedData}
            layout="horizontal"
            barSize={60}
          >
            <CartesianGrid vertical={true} />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent />}
              labelFormatter={(v: string) => formatFactors(v)}
            />
            <Bar
              dataKey="exposure"
              radius={4}
              barSize={100}
              label="position-top"
              fill="var(--color-exposure)"
            >
              <LabelList
                dataKey="exposure"
                position="bottom"
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
              tickFormatter={(v: string) => formatFactors(v)}
              interval={0}
              fontSize={10}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {excludedHoldings && excludedHoldings.length > 0 ? (
          <div className="text-sm">
            <strong>Excluded holdings ({excludedHoldings.length}):</strong>{" "}
            {excludedHoldings.join(", ")}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            All holdings included
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default FactorsBarChart;
