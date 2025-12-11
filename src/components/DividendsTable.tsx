"use client";
import { useParams } from "next/navigation";
import { DividendsResponse } from "@/lib/types";
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

export function DividendsTable({
  dividends,
}: {
  dividends: DividendsResponse | undefined;
}) {
  const params = useParams();
  const fund = params?.fund as string | undefined;
  const holding = params?.holding as string | undefined;
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
      <TableFooter>
        <TableRow>
          <TableCell
            colSpan={5}
            data-state="last"
            className="border-none bg-background py-0 px-0"
          >
            <Link href={`/performance/${fund}/${holding}/dividends`}>
              <div className="text-center flex items-center justify-center gap-1 hover:bg-secondary py-2">
                <span> View All </span>
                <ChevronsRight size={18} />
              </div>
            </Link>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
