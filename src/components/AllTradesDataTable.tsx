import * as React from "react";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
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
import { formatCurrency, formatPercent } from "@/lib/utils";

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

const getCurrentPrice = (row: Row<TradesRecord>): number | null => {
  return row.original.current_price;
};

const sortableHeader = (
  label: string,
  description: React.ReactNode | undefined,
  column: Column<TradesRecord, unknown>,
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

const tooltipColumns = [
  "Date",
  "Type",
  "Shares",
  "Price",
  "Trade Current Price",
  "Transaction Value",
  "Trade Return",
  "Trade Current Value",
] as const;
const shared = getHeaderTooltips(true, tooltipColumns);

const getTradeColumns = (): ColumnDef<TradesRecord>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => sortableHeader("Date", shared["Date"], column),
    cell: ({ row }) => {
      return <div>{row.getValue("date")}</div>;
    },
  },
  {
    accessorKey: "ticker",
    header: ({ column }) =>
      sortableHeader("Ticker", "Holding ticker symbol", column),
    cell: ({ row }) => {
      return <div>{row.getValue("ticker")}</div>;
    },
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
    id: "currentPrice",
    accessorFn: (row) => row.current_price,
    header: ({ column }) =>
      sortableHeader("Current Price", shared["Trade Current Price"], column),
    cell: ({ row }) => {
      const currentPrice = getCurrentPrice(row);
      return (
        <div>
          {currentPrice !== null && currentPrice !== undefined
            ? formatCurrency(currentPrice)
            : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) =>
      sortableHeader("Transaction Value", shared["Transaction Value"], column),
    cell: ({ row }) => <div>{formatCurrency(row.getValue("value"))}</div>,
  },
  {
    id: "currentValue",
    accessorFn: (row) => {
      const currentPrice = row.current_price;
      const shares = Number(row.shares ?? 0);
      return currentPrice !== null && currentPrice !== undefined
        ? currentPrice * shares
        : null;
    },
    header: ({ column }) =>
      sortableHeader("Current Value", shared["Trade Current Value"], column),
    cell: ({ row }) => {
      const shares = Number(row.getValue("shares") ?? 0);
      const currentPrice = getCurrentPrice(row);
      return (
        <div>
          {currentPrice !== null && currentPrice !== undefined
            ? formatCurrency(currentPrice * shares)
            : ""}
        </div>
      );
    },
  },
  {
    id: "return",
    accessorFn: (row) => {
      const buyPrice = Number(row.price ?? 0);
      const currentPrice = row.current_price;
      if (
        buyPrice !== 0 &&
        currentPrice !== null &&
        currentPrice !== undefined
      ) {
        return ((currentPrice - buyPrice) / buyPrice) * 100;
      }
      return null;
    },
    header: ({ column }) =>
      sortableHeader("Return", shared["Trade Return"], column),
    cell: ({ row }) => {
      const buyPrice = Number(row.getValue("price") ?? 0);
      const currentPrice = getCurrentPrice(row);
      const tradeReturn =
        buyPrice !== 0 && currentPrice !== null && currentPrice !== undefined
          ? ((currentPrice - buyPrice) / buyPrice) * 100
          : 0;

      return currentPrice !== null && currentPrice !== undefined ? (
        <div>{formatPercent(tradeReturn)}</div>
      ) : (
        <></>
      );
    },
  },
];

export function AllTradesDataTable({
  trades,
  currentValue,
}: {
  trades: TradesResponse | undefined;
  currentValue: number | undefined;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: trades?.trades ?? [],
    columns: getTradeColumns(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, pagination },
  });

  if (!trades || trades.trades.length === 0)
    return (
      <div className="flex items-center justify-center py-8 text-sm text-gray-500">
        No trades found
      </div>
    );

  return (
    // The trades table mirrors the dividends table spacing so the two holding detail subpages feel like one system.
    <div className="w-full">
      <div className="space-y-4">
        <div className="overflow-x-auto border border-gray-200 rounded">
          <Table>
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-gray-400"
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
                <TableRow
                  key={row.id}
                  className={`border-b border-gray-100 ${row.original.type?.toUpperCase() === "SELL" ? "bg-blue-50" : ""}`}
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
