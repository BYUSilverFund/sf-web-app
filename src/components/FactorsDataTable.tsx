"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Row,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NumRowSelector } from "./ChartControls";
import { FactorData } from "@/app/factor-exposures/[fund]/page";

export function formatExposures(n: number, decimals = 3) {
  const s = n.toFixed(decimals);
  return Math.abs(n) < 1 ? s.replace(/^(-?)0\./, "$1.") : s;
}

export function formatFactors(factor: string) {
  return factor.replace(/^USSLOWL_/, "");
}

const absValueSortingFn = (
  rowA: Row<FactorData>,
  rowB: Row<FactorData>,
  columnId: string,
): number => {
  const valueA = Math.abs(rowA.getValue(columnId) as number);
  const valueB = Math.abs(rowB.getValue(columnId) as number);

  if (valueA < valueB) return -1;
  if (valueA > valueB) return 1;
  return 0;
};

export const columns: ColumnDef<FactorData>[] = [
  {
    accessorKey: "factor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Factor
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const factor = row.getValue("factor") as string;
      const formatted = formatFactors(factor);
      return <div className="">{formatted}</div>;
    },
  },
  {
    accessorKey: "exposure",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Exposure
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const exposure = parseFloat(row.getValue("exposure"));
      const formatted = formatExposures(exposure);
      return <div className="font-medium text-left">{formatted}</div>;
    },
    sortingFn: absValueSortingFn,
  },
];

export function FactorsDataTable({
  data,
  showTop,
  setShowTop,
}: {
  data: FactorData[];
  showTop?: number;
  setShowTop?: (v: number) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [numRow, setNumRow] = useState<number>(showTop ?? 10);
  useEffect(() => {
    setNumRow(showTop ?? 10);
  }, [showTop]);

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  useEffect(() => {
    const pageSize = numRow === 0 ? data.length : Number(numRow);
    table.setPageSize(pageSize);
  }, [numRow, table, data.length]);

  return (
    <Card className="sm:px-2">
      <CardHeader className="">
        <div className="flex justify-between py-4">
          <Input
            placeholder="Filter factors..."
            value={
              (table.getColumn("factor")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("factor")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <NumRowSelector
              numRow={numRow}
              onValueChange={(v) => {
                setNumRow(v);
                if (setShowTop) setShowTop(v);
              }}
            />
          </div>
        </div>
      </CardHeader>
      <div className="overflow-hidden rounded-md border">
        <CardContent className="h-5/6">
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
        </CardContent>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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
    </Card>
  );
}
