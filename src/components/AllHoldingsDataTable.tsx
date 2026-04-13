"use client";

import * as React from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { AllHoldingsRecord, PortfolioSummaryResponse } from "@/lib/types";
import { formatPercent, formatCurrency, formatFloat } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
  column: Column<AllHoldingsRecord, unknown>,
) => (
  <div className="flex items-center gap-1">
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
const tooltipColumns = [
  "Ticker",
  "Shares",
  "Price",
  "Value",
  "Weight",
  "Total Return",
  "Volatility",
  "Alpha",
  "Beta",
  "Dividends",
  "Per Share",
  "Total",
  "Active",
] as const;

// Realized
const shared = getHeaderTooltips(false, tooltipColumns);
const headerTooltips: Record<string, React.ReactNode | undefined> = {
  Ticker: shared["Ticker"],
  Shares: shared["Shares"],
  Price: shared["Price"],
  Value: shared["Value"],
  Weight: shared["Weight"],
  Return: shared["Return"],
  Volatility: shared["Volatility"],
  Alpha: shared["Alpha"],
  Beta: shared["Beta"],
  Dividends: shared["Dividends"],
  "Per Share": shared["Per Share"],
  Total: shared["Total"],
  Active: shared["Active"],
};
export const columns: ColumnDef<AllHoldingsRecord>[] = [
  {
    accessorKey: "ticker",
    header: ({ column }) =>
      sortableHeader("Ticker", headerTooltips["Ticker"], column),
    cell: ({ row }) => <div>{row.getValue("ticker")}</div>,
  },
  {
    accessorKey: "shares",
    header: ({ column }) =>
      sortableHeader("Shares", headerTooltips["Shares"], column),
    cell: ({ row }) => <div>{row.getValue("shares")}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) =>
      sortableHeader("Price", headerTooltips["Price"], column),
    cell: ({ row }) => <div>{formatCurrency(row.getValue("price"))}</div>,
  },
  {
    accessorKey: "value",
    header: ({ column }) =>
      sortableHeader("Value", headerTooltips["Value"], column),
    cell: ({ row }) => <div>{formatCurrency(row.getValue("value"))}</div>,
  },
  {
    accessorKey: "percent_fund",
    header: ({ column }) =>
      sortableHeader("Weight", headerTooltips["Weight"], column),
    cell: ({ row }) => <div>{formatPercent(row.getValue("percent_fund"))}</div>,
  },
  {
    accessorKey: "total_return",
    header: ({ column }) =>
      sortableHeader("Return", headerTooltips["Return"], column),
    cell: ({ row }) => <div>{formatPercent(row.getValue("total_return"))}</div>,
  },
  {
    accessorKey: "volatility",
    header: ({ column }) =>
      sortableHeader("Volatility", headerTooltips["Volatility"], column),
    cell: ({ row }) => <div>{formatPercent(row.getValue("volatility"))}</div>,
  },
  {
    accessorKey: "alpha",
    header: ({ column }) =>
      sortableHeader("Alpha", headerTooltips["Alpha"], column),
    cell: ({ row }) => <div>{formatPercent(row.getValue("alpha"))}</div>,
  },
  {
    accessorKey: "beta",
    header: ({ column }) =>
      sortableHeader("Beta", headerTooltips["Beta"], column),
    cell: ({ row }) => <div>{formatFloat(row.getValue("beta"))}</div>,
  },
  {
    accessorKey: "dividends",
    header: ({ column }) =>
      sortableHeader("Total", headerTooltips["Total"], column),
    cell: ({ row }) => <div>{formatCurrency(row.getValue("dividends"))}</div>,
  },
  {
    accessorKey: "dividends_per_share",
    header: ({ column }) =>
      sortableHeader("Per Share", headerTooltips["Per Share"], column),
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("dividends_per_share"))}</div>
    ),
  },
  {
    accessorKey: "active",
    header: ({ column }) =>
      sortableHeader("Active", headerTooltips["Active"], column),
    cell: ({ row }) => (
      <div>{row.getValue("active") ? "Active" : "Inactive"}</div>
    ),
  },
];

export function AllHoldingsDataTable({
  data,
  portfolioSummary,
  loading = false,
}: {
  data: AllHoldingsRecord[] | undefined;
  portfolioSummary: PortfolioSummaryResponse | undefined;
  loading?: boolean;
}) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const processedData = React.useMemo(() => {
    if (!data || !portfolioSummary) return data;
    return data.map((item) => ({
      ...item,
      percent_fund: (item.value / portfolioSummary.value) * 100,
    }));
  }, [data, portfolioSummary]);

  const table = useReactTable({
    data: processedData || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      pagination,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="flex items-center">
          {loading ? (
            <div className="h-[42px] w-full animate-pulse rounded border border-gray-300 bg-gray-100" />
          ) : (
            <Input
              placeholder="Filter tickers..."
              value={
                (table.getColumn("ticker")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("ticker")?.setFilterValue(event.target.value)
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white h-auto shadow-none placeholder:text-gray-400"
            />
          )}
        </div>
        <div className="overflow-x-auto border border-gray-200 rounded">
          <Table>
            <TableHeader className="bg-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-gray-200 hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => {
                    return (
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
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 10 }).map((_, rowIndex) => (
                    <TableRow
                      key={`loading-row-${rowIndex}`}
                      className="border-b border-gray-100"
                    >
                      {Array.from({ length: columns.length }).map(
                        (_, cellIndex) => (
                          <TableCell
                            key={`loading-cell-${rowIndex}-${cellIndex}`}
                            className="py-2.5 px-3"
                          >
                            <div className="h-5 w-full animate-pulse rounded bg-gray-100" />
                          </TableCell>
                        ),
                      )}
                    </TableRow>
                  ))
                : table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => router.push(`${row.getValue("ticker")}`)}
                      className="cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition"
                    >
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
              {!loading && table.getRowModel().rows.length === 0 && (
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
          {loading ? (
            <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
          ) : (
            <div>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-600 bg-white cursor-default h-auto"
              onClick={() => table.previousPage()}
              disabled={loading || !table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-600 bg-white cursor-default h-auto"
              onClick={() => table.nextPage()}
              disabled={loading || !table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
