import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Tooltip from "./Tooltip";
import { getHeaderTooltips } from "@/lib/tabletooltips";
import { TradesResponse, TradesRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const makeHeader = (label: string, description?: React.ReactNode) => {
  if (description === undefined) return <span>{label}</span>;
  return (
    <Tooltip
      trigger={
        <span className="inline-flex items-center gap-1 cursor-help whitespace-nowrap">
          {label}
          <InfoIcon size={14} className="text-muted-foreground" />
        </span>
      }
      description={description}
      side="top"
    />
  );
};

const sortableHeader = (
  label: string,
  description: React.ReactNode | undefined,
  column: any,
) => (
  <div className="flex items-center gap-1 whitespace-nowrap">
    {makeHeader(label, description)}
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 p-0"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  </div>
);

const tooltipColumns = ["Date", "Type", "Shares", "Price", "Value"] as const;
const shared = getHeaderTooltips(true, tooltipColumns);

export const tradeColumns: ColumnDef<TradesRecord>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => sortableHeader("Date", shared["Date"], column),
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => sortableHeader("Type", shared["Type"], column),
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "shares",
    header: ({ column }) => sortableHeader("Shares", shared["Shares"], column),
    cell: ({ row }) => <div>{row.getValue("shares")}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => sortableHeader("Price", shared["Price"], column),
    cell: ({ row }) => <div>{formatCurrency(row.getValue("price"))}</div>,
  },
  {
    accessorKey: "value",
    header: ({ column }) => sortableHeader("Value", shared["Value"], column),
    cell: ({ row }) => <div>{formatCurrency(row.getValue("value"))}</div>,
  },
];

export function AllTradesDataTable({
  trades,
}: {
  trades: TradesResponse | undefined;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: trades?.trades ?? [],
    columns: tradeColumns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  if (!trades || trades.trades.length === 0)
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        No trades found
      </div>
    );

  return (
    <div className="w-full">
      <div className="space-y-4 p-4">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <TableRow className="h-[33.33vh]">
                  <TableCell
                    colSpan={table.getAllLeafColumns().length}
                    className="text-center"
                  ></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
