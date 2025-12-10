import { API_BASE_URL } from "../variables";

export interface TimeSeriesDownloadRequest {
  start: string;
  end: string;
}

export async function downloadAllFundsCSV(
  request: TimeSeriesDownloadRequest,
): Promise<Blob> {
  try {
    const response = await fetch(API_BASE_URL + "reports/all-funds/csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Return blob for CSV
    return await response.blob();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to download CSV.");
  }
}
