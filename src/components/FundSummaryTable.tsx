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

export function FundSummaryTable({
  allFundsSummary,
  benchmarkSummary,
}: {
  allFundsSummary: FundSummaryResponse;
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
          <TableCell>{formatPercent(allFundsSummary.total_return)}</TableCell>
          <TableCell>{formatPercent(allFundsSummary.volatility)}</TableCell>
          <TableCell>{formatFloat(allFundsSummary.sharpe_ratio)}</TableCell>
          <TableCell>{formatCurrency(allFundsSummary.dividends)}</TableCell>
          <TableCell>{formatPercent(allFundsSummary.dividend_yield)}</TableCell>
          <TableCell>{formatPercent(allFundsSummary.alpha)}</TableCell>
          <TableCell>{formatFloat(allFundsSummary.beta)}</TableCell>
          <TableCell>{formatPercent(allFundsSummary.tracking_error)}</TableCell>
          <TableCell>
            {formatFloat(allFundsSummary.information_ratio)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Benchmark</TableCell>
          <TableCell>
            {formatCurrency(benchmarkSummary?.adjusted_close)}
          </TableCell>
          <TableCell>{formatPercent(benchmarkSummary.total_return)}</TableCell>
          <TableCell>{formatPercent(benchmarkSummary.volatility)}</TableCell>
          <TableCell>{formatFloat(benchmarkSummary.sharpe_ratio)}</TableCell>
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
  );
}
