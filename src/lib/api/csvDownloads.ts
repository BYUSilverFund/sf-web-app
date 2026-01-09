import { API_BASE_URL } from "../variables";

export interface TimeSeriesDownloadRequest {
  start: string;
  end: string;
}

// /all-portfolios/csv
export async function downloadAllPortfoliosCSV(
  request: TimeSeriesDownloadRequest,
): Promise<Blob> {
  try {
    const response = await fetch(API_BASE_URL + "all-portfolios/csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to download CSV.");
  }
}

// /fund/all-funds/csv
export async function downloadAllFundsCSV(
  request: TimeSeriesDownloadRequest,
): Promise<Blob> {
  try {
    const response = await fetch(API_BASE_URL + "fund/all-funds/csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to download CSV.");
  }
}

// /portfolio/csv
export interface PortfolioDownloadRequest extends TimeSeriesDownloadRequest {
  fund: string; // <-- change this key if backend expects a different name
}
export async function downloadPortfolioCSV(
  request: PortfolioDownloadRequest,
): Promise<Blob> {
  try {
    const response = await fetch(API_BASE_URL + "portfolio/csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to download CSV.");
  }
}
