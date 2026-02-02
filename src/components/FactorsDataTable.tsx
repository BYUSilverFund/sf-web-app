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
import { NumRowSelector, ViewSelector } from "./ChartControls";
import { FactorData } from "@/app/forecast/[fund]/page";

export function formatExposures(
  n: number,
  decimals = 3,
  dropLeadingZero = false,
) {
  const s = n.toFixed(decimals);
  if (dropLeadingZero) {
    return Math.abs(n) < 1 ? s.replace(/^(-?)0\./, "$1.") : s;
  }
  // ensure leading zero for decimals (e.g., ".123" -> "0.123")
  return Math.abs(n) < 1 ? s.replace(/^(-?)\./, "$10.") : s;
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

function buildColumns(
  contributionMode = false,
  maxIntLen = 1,
): ColumnDef<FactorData>[] {
  return [
    {
      accessorKey: "factor",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {contributionMode ? "Holding" : "Factor"}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const factor = row.getValue("factor") as string;
        const formatted = contributionMode ? factor : formatFactors(factor);
        return <div className="">{formatted}</div>;
      },
    },
    {
      accessorKey: "exposure",
      header: ({ column }) => {
        return (
          <div className="w-[120px] flex justify-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {contributionMode ? "Contribution" : "Exposure"}
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const exposure = parseFloat(row.getValue("exposure"));
        const formatted = formatExposures(exposure);
        const parts = String(formatted).split(".");
        const intPart = parts[0] ?? "0";
        const fracPart = parts[1] ?? "000";
        return (
          <div className="font-medium w-[120px] flex justify-center">
            <span className="min-w-[var(--int-width-px)] inline-block text-right">
              {intPart}
            </span>
            <span className="inline-block">.{fracPart}</span>
          </div>
        );
      },
      sortingFn: absValueSortingFn,
    },
  ];
}

export function FactorsDataTable({
  data,
  showTop,
  setShowTop,
  onFactorClick,
  contributionMode,
  headerTitle,
  view,
  onViewChange,
}: {
  data: FactorData[];
  showTop?: number;
  setShowTop?: (v: number) => void;
  onFactorClick?: (factor: string) => void;
  contributionMode?: boolean;
  headerTitle?: string;
  view?: string;
  onViewChange?: (v: string) => void;
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

  const maxIntLen = React.useMemo(() => {
    let max = 1;
    for (const d of data) {
      const formatted = formatExposures(d.exposure);
      const intPart = String(formatted).split(".")[0] ?? "0";
      if (intPart.length > max) max = intPart.length;
    }
    return max;
  }, [data]);

  const [intWidthPx, setIntWidthPx] = useState<number>(0);

  useEffect(() => {
    const measure = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const docStyle = window.getComputedStyle(document.documentElement);
        const fontSize = docStyle.getPropertyValue("font-size") || "16px";
        const fontFamily =
          "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Helvetica Neue', monospace";
        ctx.font = `${fontSize} ${fontFamily}`;
        const text = "0".repeat(maxIntLen);
        const w = Math.ceil(ctx.measureText(text).width) + 2; // small padding
        setIntWidthPx(w);
      } catch (e) {
        // ignore
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [maxIntLen]);

  const cols = buildColumns(contributionMode, maxIntLen);

  const table = useReactTable({
    data,
    columns: cols,
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
    <Card
      className="sm:px-2"
      style={{ ["--int-width-px" as any]: `${intWidthPx}px` }}
    >
      <CardHeader className="">
        <div className="flex justify-between py-4 items-center">
          <div className="flex items-center gap-4">
            {headerTitle ? (
              <h2 className="text-lg font-semibold">{headerTitle}</h2>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder={
                contributionMode ? "Filter holdings..." : "Filter factors..."
              }
              value={
                (table.getColumn("factor")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("factor")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            {view !== undefined && onViewChange ? (
              <div className="hidden sm:block">
                <ViewSelector
                  view={view}
                  onValueChange={(v) => onViewChange(v)}
                />
              </div>
            ) : null}
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
                  <TableRow
                    key={row.id}
                    className={onFactorClick ? "cursor-pointer" : ""}
                    onClick={() =>
                      onFactorClick &&
                      onFactorClick(String(row.getValue("factor")))
                    }
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
                  <TableCell colSpan={cols.length} className="h-24 text-center">
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
