import { BenchmarkSummaryResponse, PortfolioSummaryResponse } from "@/lib/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatPercent, formatCurrency, formatFloat, formatPortfolio } from "@/lib/utils";

export function PortfolioSummaryTable({
  portfolio,
  portfolioSummary,
  benchmarkSummary,
}: {
  portfolio: string;
  portfolioSummary: PortfolioSummaryResponse;
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
          <TableCell>{formatPortfolio(portfolio)}</TableCell>
          <TableCell>{formatCurrency(portfolioSummary.value)}</TableCell>
          <TableCell>{formatPercent(portfolioSummary.total_return)}</TableCell>
          <TableCell>{formatPercent(portfolioSummary.volatility)}</TableCell>
          <TableCell>{formatFloat(portfolioSummary.sharpe_ratio)}</TableCell>
          <TableCell>{formatCurrency(portfolioSummary.dividends)}</TableCell>
          <TableCell>{formatPercent(portfolioSummary.dividend_yield)}</TableCell>
          <TableCell>{formatPercent(portfolioSummary.alpha)}</TableCell>
          <TableCell>{formatFloat(portfolioSummary.beta)}</TableCell>
          <TableCell>{formatPercent(portfolioSummary.tracking_error)}</TableCell>
          <TableCell>
            {formatFloat(portfolioSummary.information_ratio)}
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
        </TableRow>
      </TableBody>
    </Table>
  );
}
