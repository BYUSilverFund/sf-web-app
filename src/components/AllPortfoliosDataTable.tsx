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
import { ArrowUpDown, ChevronDown } from "lucide-react";

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
import { AllPortfoliosRecord } from "@/lib/types";

import {
  formatPercent,
  formatCurrency,
  formatPortfolio,
  formatFloat,
} from "@/lib/utils";
import Link from "next/link";

export const columns: ColumnDef<AllPortfoliosRecord>[] = [
  {
    accessorKey: "portfolio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Portfolio
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{formatPortfolio(row.getValue("portfolio"))}</div>,
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Value
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{formatCurrency(row.getValue("value"))}</div>,
  },
  {
    accessorKey: "total_return",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Return
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{formatPercent(row.getValue("total_return"))}</div>,
  },
  {
    accessorKey: "volatility",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Volatility
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{formatPercent(row.getValue("volatility"))}</div>,
  },
  {
    accessorKey: "sharpe_ratio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sharpe
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{formatFloat(row.getValue("sharpe_ratio"))}</div>,
  },
  {
    accessorKey: "dividends",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dividends
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{formatCurrency(row.getValue("dividends"))}</div>,
  },
  {
    accessorKey: "dividend_yield",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dividend Yield
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>{formatPercent(row.getValue("dividend_yield"))}</div>
    ),
  },
  {
    accessorKey: "alpha",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Alpha
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{formatPercent(row.getValue("alpha"))}</div>,
  },
  {
    accessorKey: "beta",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Beta
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{formatFloat(row.getValue("beta"))}</div>,
  },
  {
    accessorKey: "tracking_error",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tracking Error
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>{formatPercent(row.getValue("tracking_error"))}</div>
    ),
  },
  {
    accessorKey: "information_ratio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Information Ratio
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>{formatFloat(row.getValue("information_ratio"))}</div>
    ),
  },
  {
    accessorKey: "page",
    header: () => {
      return <></>;
    },
    cell: ({ row }) => (
      <Link href={`${row.getValue("portfolio")}`}>
        <Button>View</Button>
      </Link>
    ),
  },
];

export function AllPortfoliosDataTable({
  // default to empty array so the table code always receives an array
  // (prevents runtime errors when `data` is undefined while loading)
  data = [],
}: {
  data?: AllPortfoliosRecord[] | undefined;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
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
    <div className="w-full">
      <div className="space-y-4 p-4">
        {/* Row 2 */}
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
                              header.getContext()
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
