"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Return: shared["Total Return"],
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
}: {
  data: AllHoldingsRecord[] | undefined;
  portfolioSummary: PortfolioSummaryResponse | undefined;
}) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="space-y-4 p-4">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter tickers..."
            value={
              (table.getColumn("ticker")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("ticker")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => router.push(`${row.getValue("ticker")}`)}
                  className="cursor-pointer hover:bg-muted transition"
                >
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
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
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
