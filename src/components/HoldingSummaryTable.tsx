import { BenchmarkSummaryResponse, HoldingSummaryResponse } from "@/lib/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatPercent, formatCurrency, formatFloat } from "@/lib/utils";

export function HoldingSummaryTable({
  ticker,
  holdingSummary,
  benchmarkSummary,
}: {
  ticker: string;
  holdingSummary: HoldingSummaryResponse;
  benchmarkSummary: BenchmarkSummaryResponse;
}) {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Total Return</TableHead>
          <TableHead>Volatility</TableHead>
          <TableHead>Dividends</TableHead>
          <TableHead>Dividend Yield</TableHead>
          <TableHead>Alpha</TableHead>
          <TableHead>Beta</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{ticker}</TableCell>
          <TableCell>{formatCurrency(holdingSummary.value)}</TableCell>
          <TableCell>{formatPercent(holdingSummary.total_return)}</TableCell>
          <TableCell>{formatPercent(holdingSummary.volatility)}</TableCell>
          <TableCell>{formatCurrency(holdingSummary.dividends)}</TableCell>
          <TableCell>{formatPercent(holdingSummary.dividend_yield)}</TableCell>
          <TableCell>{formatPercent(holdingSummary.alpha)}</TableCell>
          <TableCell>{formatFloat(holdingSummary.beta)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Benchmark</TableCell>
          <TableCell>{formatCurrency(benchmarkSummary.adjusted_close)}</TableCell>
          <TableCell>{formatPercent(benchmarkSummary.volatility)}</TableCell>
          <TableCell>{formatCurrency(benchmarkSummary.dividends_per_share)}</TableCell>
          <TableCell>{formatPercent(benchmarkSummary.dividend_yield)}</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
