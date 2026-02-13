import {
  BenchmarkSummaryResponse,
  PortfolioSummaryResponse,
} from "@/lib/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  formatPercent,
  formatCurrency,
  formatFloat,
  formatPortfolio,
} from "@/lib/utils";

import Tooltip from "./Tooltip";
import { InfoIcon } from "lucide-react";
import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getHeaderTooltips } from "@/lib/tabletooltips";
import { calculateSummaryMetrics } from "@/lib/RealizedVsAnnualizedCalculations";

export function PortfolioSummaryTable({
  portfolio,
  portfolioSummary,
  benchmarkSummary,
}: {
  portfolio: string;
  portfolioSummary: PortfolioSummaryResponse | undefined;
  benchmarkSummary: BenchmarkSummaryResponse | undefined;
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
  const {
    fundVol,
    fundSharpe,
    fundAlpha,
    fundTE,
    fundIR,
    benchVol,
    benchSharpe,
  } = calculateSummaryMetrics(annualized, portfolioSummary, benchmarkSummary);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="align-middle whitespace-nowrap">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="annualized-toggle-portfolio"
                className="text-xs text-muted-foreground"
              >
                Realized
              </Label>
              <Switch
                id="annualized-toggle-portfolio"
                checked={annualized}
                onCheckedChange={setAnnualized}
              />
              <Label htmlFor="annualized-toggle-portfolio" className="text-xs">
                Ann.
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
          {portfolio && <TableCell>{formatPortfolio(portfolio)}</TableCell>}
          {portfolioSummary && (
            <>
              <TableCell>{formatCurrency(portfolioSummary.value)}</TableCell>
              <TableCell>
                {formatPercent(portfolioSummary.total_return)}
              </TableCell>
              <TableCell>{formatPercent(fundVol ?? 0)}</TableCell>
              <TableCell>{formatFloat(fundSharpe ?? 0)}</TableCell>
              <TableCell>
                {formatCurrency(portfolioSummary.dividends)}
              </TableCell>
              <TableCell>
                {formatPercent(portfolioSummary.dividend_yield)}
              </TableCell>
              <TableCell>{formatPercent(fundAlpha ?? 0)}</TableCell>
              <TableCell>{formatFloat(portfolioSummary.beta)}</TableCell>
              <TableCell>{formatPercent(fundTE ?? 0)}</TableCell>
              <TableCell>
                {fundIR !== undefined ? formatFloat(fundIR) : ""}
              </TableCell>
            </>
          )}
        </TableRow>
        <TableRow>
          <TableCell>Benchmark</TableCell>
          {benchmarkSummary ? (
            <>
              <TableCell>
                {formatCurrency(benchmarkSummary.adjusted_close)}
              </TableCell>
              <TableCell>
                {formatPercent(benchmarkSummary.total_return)}
              </TableCell>
              <TableCell>
                {formatPercent(benchVol ?? benchmarkSummary.volatility)}
              </TableCell>
              <TableCell>
                {formatFloat(benchSharpe ?? benchmarkSummary.sharpe_ratio)}
              </TableCell>
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
          ) : (
            <>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </>
          )}
        </TableRow>
      </TableBody>
    </Table>
  );
}
