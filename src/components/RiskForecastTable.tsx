"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronDown, ArrowUpDown } from "lucide-react";

import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from "./ui/table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskForecast, HoldingRisk } from "@/lib/types";

type RiskForecastTableProps = {
  forecast: RiskForecast | undefined;
  fundName: string;
};

const holdingColumns: ColumnDef<HoldingRisk>[] = [
  {
    accessorKey: "ticker",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Holding
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.ticker}</span>
    ),
  },
  {
    accessorKey: "fund_weight",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Weight
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `${(row.original.fund_weight * 100).toFixed(2)}%`,
  },
  {
    accessorKey: "beta",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Beta
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.beta.toFixed(2),
  },
  {
    accessorKey: "volatility",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Volatility
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `${(row.original.volatility * 100).toFixed(2)}%`,
  },
  {
    accessorKey: "tracking_error",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tracking Error
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `${(row.original.tracking_error * 100).toFixed(2)}%`,
  },
];

function HoldingsSection({
  showHoldings,
  setShowHoldings,
  holdings,
}: {
  showHoldings: boolean;
  setShowHoldings: (v: boolean) => void;
  holdings: HoldingRisk[];
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "fund_weight", desc: true },
  ]);

  const table = useReactTable({
    data: holdings,
    columns: holdingColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="mt-4 border-t pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Holdings risk forecast
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHoldings(!showHoldings)}
          className="flex items-center gap-1"
        >
          {showHoldings ? "Hide holdings" : "Show holdings"}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              showHoldings ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {showHoldings && (
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
              {table.getRowModel().rows.length ? (
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
                    colSpan={holdingColumns.length}
                    className="h-24 text-center"
                  >
                    No holdings.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end space-x-2 py-3 px-3">
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
      )}
    </div>
  );
}

export function RiskForecastTable({
  forecast,
  fundName,
}: RiskForecastTableProps) {
  const [showHoldings, setShowHoldings] = useState(false);
  if (!forecast) return null;

  return (
    <Card className="rounded-xl border bg-card text-card-foreground shadow">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg text-left border-b pb-2">
          Risk Forecast
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left w-1/4">Fund</TableHead>
              <TableHead className="text-center w-1/4">Beta</TableHead>
              <TableHead className="text-center w-1/4">Volatility</TableHead>
              <TableHead className="text-center w-1/4">
                Tracking Error
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-left w-1/4">{fundName}</TableCell>
              <TableCell className="text-center w-1/4">
                {forecast.beta.toFixed(2)}
              </TableCell>
              <TableCell className="text-center w-1/4">
                {(forecast.volatility * 100).toFixed(2)}%
              </TableCell>
              <TableCell className="text-center w-1/4">
                {forecast.tracking_error.toFixed(2)}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {forecast.holdings && forecast.holdings.length > 0 && (
          <HoldingsSection
            showHoldings={showHoldings}
            setShowHoldings={setShowHoldings}
            holdings={forecast.holdings}
          />
        )}
      </CardContent>
    </Card>
  );
}
