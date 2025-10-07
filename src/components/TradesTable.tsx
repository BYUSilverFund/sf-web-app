import { TradesResponse } from "@/lib/types";

import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from "./ui/table";
import { formatCurrency } from "@/lib/utils";

export function TradesTable({ trades }: { trades: TradesResponse }) {
  if (trades.trades.length === 0)
    return <div className="text-center py-2 text-muted-foreground">None</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Shares</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.trades.slice(0, 5).map((trade, index) => (
          <TableRow key={index}>
            <TableCell>{trade.date}</TableCell>
            <TableCell>{trade.type}</TableCell>
            <TableCell>{trade.shares}</TableCell>
            <TableCell>{formatCurrency(trade.price)}</TableCell>
            <TableCell>{formatCurrency(trade.value)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
