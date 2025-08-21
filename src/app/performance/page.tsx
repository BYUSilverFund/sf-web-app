"use client";
import { useEffect, useState } from "react";
import { getAllFundsSummary, getAllFundsTimeSeries } from "@/lib/api/allFunds";
import { getBenchmarkSummary } from "@/lib/api/benchmark";
import {
  BenchmarkRequest,
  BenchmarkSummaryResponse,
} from "@/lib/types/benchmark";
import { AllFundsRequest, AllFundsSummaryResponse, AllFundsTimeSeriesResponse } from "@/lib/types";

import { format } from "date-fns";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
} from "@/components/ui/card";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

function ViewButton() {
  return (
    <Select defaultValue="1year">
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Views</SelectLabel>
          <SelectItem value="cohort">Cohort</SelectItem>
          <SelectItem value="1year">1 Year</SelectItem>
          <SelectItem value="1month">1 Month</SelectItem>
          <SelectItem value="1week">1 Week</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function DateButton({
  date,
  setDate,
  label,
}: {
  date?: Date;
  setDate: (d?: Date) => void;
  label: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatPercent(value: number, fractionDigits: number = 2): string {
  return `${value.toFixed(fractionDigits)}%`;
}

function formatFloat(value: number, fractionDigits: number = 2): string {
  return `${value.toFixed(fractionDigits)}`;
}

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


export default function Page() {
  const today = new Date();

  // yesterday
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // yesterday one year ago
  const yesterdayLastYear = new Date();
  yesterdayLastYear.setFullYear(today.getFullYear() - 1);
  yesterdayLastYear.setDate(today.getDate() - 1);

  const [start, setStart] = useState<Date>(yesterdayLastYear);
  const [end, setEnd] = useState<Date>(yesterday);
  const [allFundsSummary, setAllFundsSummary] =
    useState<AllFundsSummaryResponse>();
  const [benchmarkSummary, setBenchmarkSummary] =
    useState<BenchmarkSummaryResponse>();

  const [allFundsTimeSeries, setAllFundsTimeSeries] =
    useState<AllFundsTimeSeriesResponse>();

  useEffect(() => {
    if (start && end) {
      const allFundsRequest: AllFundsRequest = {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      const benchmarkRequest: BenchmarkRequest = {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      getAllFundsSummary(allFundsRequest)
        .then(setAllFundsSummary)
        .catch(console.error);
      getBenchmarkSummary(benchmarkRequest)
        .then(setBenchmarkSummary)
        .catch(console.error);

      getAllFundsTimeSeries(allFundsRequest)
        .then(setAllFundsTimeSeries)
        .catch(console.error);
    }
  }, [start, end]);

  const chartConfig = {
    cummulative_return: {
      label: "All Funds",
      color: "var(--chart-1)",
    },
    benchmark_cummulative_return: {
      label: "Benchmark",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  return (
    <div>
      {allFundsSummary && benchmarkSummary && allFundsTimeSeries &&(
        <div className="space-y-4 p-4">
          {/* Row 1 */}
          <Card className="flex p-4 gap-2 items-center">
            <ViewButton />
            <div>As of {format(allFundsSummary.end, "PPP")}</div>
          </Card>
          {/* Row 2 */}
          <Card className="flex flex-col">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Total Return</TableHead>
                  <TableHead>Volatility</TableHead>
                  <TableHead>Sharpe Ratio</TableHead>
                  <TableHead>Dividends</TableHead>
                  <TableHead>Dividend Yield</TableHead>
                  <TableHead>Alpha</TableHead>
                  <TableHead>Beta</TableHead>
                  <TableHead>Tracking Error</TableHead>
                  <TableHead>Information Ratio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>All Funds</TableCell>
                  <TableCell>{formatCurrency(allFundsSummary.value)}</TableCell>
                  <TableCell>
                    {formatPercent(allFundsSummary.total_return)}
                  </TableCell>
                  <TableCell>
                    {formatPercent(allFundsSummary.volatility)}
                  </TableCell>
                  <TableCell>
                    {formatFloat(allFundsSummary.sharpe_ratio)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(allFundsSummary.dividends)}
                  </TableCell>
                  <TableCell>
                    {formatPercent(allFundsSummary.dividend_yield)}
                  </TableCell>
                  <TableCell>{formatPercent(allFundsSummary.alpha)}</TableCell>
                  <TableCell>{formatFloat(allFundsSummary.beta)}</TableCell>
                  <TableCell>
                    {formatPercent(allFundsSummary.tracking_error)}
                  </TableCell>
                  <TableCell>
                    {formatFloat(allFundsSummary.information_ratio)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Benchmark</TableCell>
                  <TableCell>
                    {formatCurrency(benchmarkSummary?.adjusted_close)}
                  </TableCell>
                  <TableCell>
                    {formatPercent(benchmarkSummary.total_return)}
                  </TableCell>
                  <TableCell>
                    {formatPercent(benchmarkSummary.volatility)}
                  </TableCell>
                  <TableCell>
                    {formatFloat(benchmarkSummary.sharpe_ratio)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(benchmarkSummary.dividends_per_share)}
                  </TableCell>
                  <TableCell>
                    {formatPercent(benchmarkSummary.dividend_yield)}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
          {/* Row 3 */}
          <div className="flex gap-2">
            <Card className="p-4">
              <ChartContainer config={chartConfig} className="h-[600px] w-full">
                <LineChart
                    accessibilityLayer
                    data={allFundsTimeSeries['records']}
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
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                    />
                    <YAxis
                      tickFormatter={(value) => formatPercent(value, 0)}
                    />
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
                    <Tooltip content={<CustomTooltip />}/>
                    <Legend
                      align="left"
                      verticalAlign="top"
                      iconType="plainline"
                      height={40}
                      formatter={(value: string) => (
                        {
                          cummulative_return: 'All Funds',
                          benchmark_cummulative_return: 'Benchmark'
                        }[value]
                      )}
                    />          
                    </LineChart>
              </ChartContainer>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
