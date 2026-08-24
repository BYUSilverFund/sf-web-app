import * as React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

interface TableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
}

export function TableSkeleton({
  columnCount = 10,
  rowCount = 10,
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow
          key={`loading-row-${rowIndex}`}
          className="border-b border-gray-100"
        >
          {Array.from({ length: columnCount }).map((_, cellIndex) => (
            <TableCell
              key={`loading-cell-${rowIndex}-${cellIndex}`}
              className="py-2.5 px-3"
            >
              <div className="h-5 w-full animate-pulse rounded bg-gray-100" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
