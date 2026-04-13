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
import { AllPortfoliosRecord } from "@/lib/types";
import {
  formatPercent,
  formatCurrency,
  formatPortfolio,
  formatFloat,
} from "@/lib/utils";
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

const tooltipColumns = [
  "Value",
  "Total Return",
  "Volatility",
  "Sharpe Ratio",
  "Dividends",
  "Dividend Yield",
  "Alpha",
  "Beta",
  "Tracking Error",
  "Information Ratio",
] as const;

const headerTooltips = getHeaderTooltips(false, tooltipColumns);

export const columns: ColumnDef<AllPortfoliosRecord>[] = [
  {
    accessorKey: "portfolio",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Portfolio
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{formatPortfolio(row.getValue("portfolio"))}</div>,
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        {makeHeader("Value", headerTooltips["Value"])}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div>{formatCurrency(row.getValue("value"))}</div>,
  },
  {
    accessorKey: "total_return",
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        {makeHeader("Total Return", headerTooltips["Total Return"])}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div>{formatPercent(row.getValue("total_return"))}</div>,
  },
  {
    accessorKey: "volatility",
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        {makeHeader("Volatility", headerTooltips["Volatility"])}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div>{formatPercent(row.getValue("volatility"))}</div>,
  },
  {
    accessorKey: "sharpe_ratio",
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        {makeHeader("Sharpe Ratio", headerTooltips["Sharpe Ratio"])}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div>{formatFloat(row.getValue("sharpe_ratio"))}</div>,
  },
  {
    accessorKey: "dividends",
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        {makeHeader("Dividends", headerTooltips["Dividends"])}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div>{formatCurrency(row.getValue("dividends"))}</div>,
  },
  {
    accessorKey: "dividend_yield",
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        {makeHeader("Dividend Yield", headerTooltips["Dividend Yield"])}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div>{formatPercent(row.getValue("dividend_yield"))}</div>
    ),
  },
  {
    accessorKey: "alpha",
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        {makeHeader("Alpha", headerTooltips["Alpha"])}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div>{formatPercent(row.getValue("alpha"))}</div>,
  },
  {
    accessorKey: "beta",
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        {makeHeader("Beta", headerTooltips["Beta"])}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div>{formatFloat(row.getValue("beta"))}</div>,
  },
  {
    accessorKey: "tracking_error",
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        {makeHeader("Tracking Error", headerTooltips["Tracking Error"])}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div>{formatPercent(row.getValue("tracking_error"))}</div>
    ),
  },
  {
    accessorKey: "information_ratio",
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        {makeHeader("Information Ratio", headerTooltips["Information Ratio"])}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div>{formatFloat(row.getValue("information_ratio"))}</div>
    ),
  },
];
export function AllPortfoliosDataTable({
  data = [],
}: {
  data?: AllPortfoliosRecord[] | undefined;
}) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
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
    // Portfolio rows keep the updated table chrome while still routing straight into the selected portfolio page.
    <div className="w-full">
      <div className="space-y-4 p-4">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter portfolios..."
            value={
              (table.getColumn("portfolio")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("portfolio")?.setFilterValue(event.target.value)
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => router.push(`${row.getValue("portfolio")}`)}
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
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
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
