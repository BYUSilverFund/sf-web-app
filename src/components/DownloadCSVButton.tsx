"use client";

import { format } from "date-fns";
import { downloadAllFundsCSV } from "@/lib/api/reports";
import { Button } from "@/components/ui/button";

interface DownloadCSVButtonProps {
  start: Date | undefined;
  end: Date | undefined;
}

export function DownloadCSVButton({ start, end }: DownloadCSVButtonProps) {
  const handleDownload = async () => {
    if (!start || !end) return;

    const startStr = format(start, "yyyy-MM-dd");
    const endStr = format(end, "yyyy-MM-dd");

    const request = {
      start: startStr,
      end: endStr,
    };

    try {
      const blob = await downloadAllFundsCSV(request);

      const url = window.URL.createObjectURL(blob);
      const filename = `timeseries_performance_all_funds_${startStr}_to_${endStr}.csv`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download CSV:", err);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload}>
      Download CSV
    </Button>
  );
}
