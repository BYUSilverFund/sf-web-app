import { FundSummaryResponse, BenchmarkSummaryResponse } from "@/lib/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatPercent, formatCurrency, formatFloat } from "@/lib/utils";
import Tooltip from "./Tooltip";
import { InfoIcon } from "lucide-react";
import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getHeaderTooltips } from "@/lib/tabletooltips";
import { calculateSummaryMetrics } from "@/lib/RealizedVsAnnualizedCalculations";

export function FundSummaryTable({
  allFundsSummary,
  benchmarkSummary,
  view_1yr,
}: {
  allFundsSummary: FundSummaryResponse | undefined;
  benchmarkSummary: BenchmarkSummaryResponse | undefined;
  view_1yr?: boolean;
}) {
  const makeHeader = (label: string, description?: React.ReactNode) => {
    if (description === undefined) return <span>{label}</span>;
    return (
      <Tooltip
        trigger={
          <>
            {label}
            <InfoIcon size={14} className="text-muted-foreground" />
          </>
        }
        description={description}
        side="top"
      />
    );
  };
  // false = Realized, true = Annualized
  const [annualized, setAnnualized] = React.useState(false);
  const {
    fundVol,
    fundSharpe,
    fundTE,
    fundAlpha,
    fundIR,
    benchVol,
    benchSharpe,
  } = calculateSummaryMetrics(
    annualized,
    allFundsSummary,
    benchmarkSummary,
    view_1yr,
  );
  const columns = [
    "Value",
    "Total Return",
    "Volatility",
    "Sharpe Ratio",
    "Dividends",
    "Dividend Yield",
    "Alpha",
    "Beta",
    "Tracking Error",
    "Information Ratio",
  ] as const;
  const headerTooltips = getHeaderTooltips(annualized, columns);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="align-middle whitespace-nowrap">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="annualized-toggle"
                className="text-xs text-muted-foreground"
              >
                Realized
              </Label>
              <Switch
                id="annualized-toggle"
                checked={annualized}
                onCheckedChange={setAnnualized}
              />
              <Label htmlFor="annualized-toggle" className="text-xs">
                Annualized
              </Label>
            </div>
          </TableHead>
          {columns.map((label) => (
            <TableHead key={label} className="whitespace-nowrap align-middle">
              {makeHeader(label, headerTooltips[label])}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>All Funds</TableCell>
          {allFundsSummary && (
            <>
              <TableCell>{formatCurrency(allFundsSummary.value)}</TableCell>
              <TableCell>
                {formatPercent(allFundsSummary.total_return)}
              </TableCell>
              <TableCell>{formatPercent(fundVol ?? 0)}</TableCell>
              <TableCell>{formatFloat(fundSharpe ?? 0)}</TableCell>
              <TableCell>{formatCurrency(allFundsSummary.dividends)}</TableCell>
              <TableCell>
                {formatPercent(allFundsSummary.dividend_yield)}
              </TableCell>
              <TableCell>{formatPercent(fundAlpha ?? 0)}</TableCell>
              <TableCell>{formatFloat(allFundsSummary.beta)}</TableCell>
              <TableCell>{formatPercent(fundTE ?? 0)}</TableCell>
              <TableCell>{formatFloat(fundIR ?? 0)}</TableCell>
            </>
          )}
        </TableRow>
        <TableRow>
          <TableCell>Benchmark</TableCell>
          {benchmarkSummary && (
            <>
              <TableCell>
                {formatCurrency(benchmarkSummary.adjusted_close)}
              </TableCell>
              <TableCell>
                {formatPercent(benchmarkSummary.total_return)}
              </TableCell>
              <TableCell>{formatPercent(benchVol ?? 0)}</TableCell>
              <TableCell>{formatFloat(benchSharpe ?? 0)}</TableCell>
              <TableCell>
                {formatCurrency(benchmarkSummary.dividends_per_share)}
              </TableCell>
              <TableCell>
                {formatPercent(benchmarkSummary.dividend_yield)}
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </>
          )}
        </TableRow>
      </TableBody>
    </Table>
  );
}
