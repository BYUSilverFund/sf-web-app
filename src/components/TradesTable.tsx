"use client";
import { useParams } from "next/navigation";
import { TradesResponse } from "@/lib/types";
import Link from "next/link";
import { ChevronsRight } from "lucide-react";

import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableFooter,
} from "./ui/table";
import { formatCurrency } from "@/lib/utils";

export function TradesTable({
  trades,
}: {
  trades: TradesResponse | undefined;
}) {
  const params = useParams();
  const fund = params?.fund as string | undefined;
  const holding = params?.holding as string | undefined;
  if (!trades || trades.trades.length === 0)
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
      <TableFooter>
        <TableRow>
          <TableCell
            colSpan={5}
            data-state="last"
            className="border-none bg-background py-0 px-0"
          >
            <Link href={`/performance/${fund}/${holding}/trades`}>
              <div className="text-center flex items-center justify-center gap-1 hover:bg-secondary py-2">
                <span>View All</span>
                <ChevronsRight size={18} />
              </div>
            </Link>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
