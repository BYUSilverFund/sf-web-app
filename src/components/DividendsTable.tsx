import { DividendsResponse } from "@/lib/types";

import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from "./ui/table";
import { formatCurrency } from "@/lib/utils";

export function DividendsTable({
  dividends,
}: {
  dividends: DividendsResponse | undefined;
}) {
  if (!dividends || dividends.dividends.length === 0)
    return <div className="text-center py-2 text-muted-foreground">None</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Shares</TableHead>
          <TableHead>Per Share</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dividends.dividends.map((dividend, index) => (
          <TableRow key={index}>
            <TableCell>{dividend.date}</TableCell>
            <TableCell>{dividend.shares}</TableCell>
            <TableCell>
              {formatCurrency(dividend.dividends_per_share)}
            </TableCell>
            <TableCell>{formatCurrency(dividend.dividends)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
