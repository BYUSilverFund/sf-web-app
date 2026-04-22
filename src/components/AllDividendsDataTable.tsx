import * as React from "react";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
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
import { DividendsResponse, DividendsRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

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

const sortableHeader = (
  label: string,
  description: React.ReactNode | undefined,
  column: Column<DividendsRecord, unknown>,
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

const tooltipColumns = ["Date", "Shares", "Per Share", "Total"] as const;
const shared = getHeaderTooltips(true, tooltipColumns);

export const dividendColumns: ColumnDef<DividendsRecord>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => sortableHeader("Date", shared["Date"], column),
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "shares",
    header: ({ column }) => sortableHeader("Shares", shared["Shares"], column),
    cell: ({ row }) => <div>{row.getValue("shares")}</div>,
  },
  {
    accessorKey: "dividends_per_share",
    header: ({ column }) =>
      sortableHeader("Per Share", shared["Per Share"], column),
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("dividends_per_share"))}</div>
    ),
  },
  {
    accessorKey: "dividends",
    header: ({ column }) => sortableHeader("Total", shared["Total"], column),
    cell: ({ row }) => <div>{formatCurrency(row.getValue("dividends"))}</div>,
  },
];

export function AllDividendsDataTable({
  dividends,
}: {
  dividends: DividendsResponse | undefined;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortedDividends = React.useMemo(
    () => dividends?.dividends ?? [],
    [dividends?.dividends],
  );
  const table = useReactTable({
    data: sortedDividends,
    columns: dividendColumns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, pagination },
  });

  if (!dividends || dividends.dividends.length === 0)
    return (
      <div className="flex items-center justify-center py-8 text-sm text-gray-500">
        No dividends found
      </div>
    );

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* This table uses the tighter card/table chrome introduced across the refreshed performance detail pages. */}
        <div className="overflow-x-auto border border-gray-200 rounded">
          <Table>
            <TableHeader className="bg-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-gray-200 hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="py-2.5 px-3 text-xs font-semibold text-gray-600 h-auto"
                    >
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
                <TableRow key={row.id} className="border-b border-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-2.5 px-3 text-sm text-gray-900"
                    >
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

        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-600 bg-white h-auto"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-600 bg-white h-auto"
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
