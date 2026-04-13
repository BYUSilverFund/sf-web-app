"use client";

import { format } from "date-fns";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

interface DownloadCSVButtonProps {
  start: Date | undefined;
  end: Date | undefined;

  /**
   * Function from lib/api that returns a CSV Blob
   * Example: downloadAllPortfoliosCSV, downloadPortfolioCSV, etc.
   */
  onDownload: (request: { start: string; end: string }) => Promise<Blob>;

  /**
   * Used to build the filename
   * Example: "all_portfolios", "portfolio_tech", "all_funds"
   */
  filenamePrefix: string;
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
}

export function DownloadCSVButton({
  start,
  end,
  onDownload,
  filenamePrefix,
  size = "sm",
  className,
}: DownloadCSVButtonProps) {
  const handleDownload = async () => {
    if (!start || !end) return;

    const startStr = format(start, "yyyy-MM-dd");
    const endStr = format(end, "yyyy-MM-dd");

    try {
      const blob = await onDownload({
        start: startStr,
        end: endStr,
      });

      if (typeof window.URL?.createObjectURL !== "function") {
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const filename = `${filenamePrefix}_${startStr}_to_${endStr}.csv`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (typeof window.URL?.revokeObjectURL === "function") {
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Failed to download CSV:", err);
    }
  };

  return (
    <Button
      variant="outline"
      size={size}
      className={className}
      onClick={handleDownload}
      disabled={!start || !end}
    >
      Download CSV
    </Button>
  );
}
