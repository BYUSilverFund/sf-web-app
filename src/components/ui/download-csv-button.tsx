"use client";

import { format } from "date-fns";
import { downloadAllFundsCSV } from "@/lib/api/reports";

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
    <button
      onClick={handleDownload}
      className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
    >
      Download CSV
    </button>
  );
}
