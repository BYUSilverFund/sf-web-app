import {
  formatPercent,
  formatCurrency,
  formatFloat,
  formatPortfolio,
} from "@/lib/utils";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { AllPortfoliosSummaryResponse } from "@/lib/types";

export function AllPortfoliosSummaryTable({
  allPortfoliosSummary,
}: {
  allPortfoliosSummary: AllPortfoliosSummaryResponse;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Total Return</TableHead>
          <TableHead>Volatility</TableHead>
          <TableHead>Sharpe</TableHead>
          <TableHead>Dividend Yield</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allPortfoliosSummary["portfolios"].map((portfolio, index) => (
          <TableRow key={index}>
            <TableCell>{formatPortfolio(portfolio.portfolio)}</TableCell>
            <TableCell>{formatCurrency(portfolio.value)}</TableCell>
            <TableCell>{formatPercent(portfolio.total_return)}</TableCell>
            <TableCell>{formatPercent(portfolio.volatility)}</TableCell>
            <TableCell>{formatFloat(portfolio.sharpe_ratio)}</TableCell>
            <TableCell>{formatPercent(portfolio.dividend_yield)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
