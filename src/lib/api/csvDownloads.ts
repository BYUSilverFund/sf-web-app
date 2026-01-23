import { API_BASE_URL } from "../variables";

export interface TimeSeriesDownloadRequest {
  start: string;
  end: string;
}

async function postCsv(path: string, request: unknown): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`CSV download failed (${response.status}): ${text}`);
  }

  return await response.blob();
}

// /all-portfolios/csv
export async function downloadAllPortfoliosCSV(
  request: TimeSeriesDownloadRequest,
): Promise<Blob> {
  try {
    return await postCsv("all-portfolios/csv", request);
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
    return await postCsv("fund/all-funds/csv", request);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to download CSV.");
  }
}

// /portfolio/csv
export interface PortfolioDownloadRequest extends TimeSeriesDownloadRequest {
  fund: string;
}

export async function downloadPortfolioCSV(
  request: PortfolioDownloadRequest,
): Promise<Blob> {
  try {
    return await postCsv("portfolio/csv", request);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to download CSV.");
  }
}

// /all-holdings/csv
export interface AllHoldingsDownloadRequest extends TimeSeriesDownloadRequest {
  fund: string;
}

export async function downloadAllHoldingsCSV(
  request: AllHoldingsDownloadRequest,
): Promise<Blob> {
  try {
    return await postCsv("all-holdings/csv", request);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to download CSV.");
  }
}

// /holding/fund/ticker/csv
export interface HoldingDownloadRequest extends TimeSeriesDownloadRequest {
  fund: string;
  ticker: string;
}
export async function downloadHoldingCSV(
  request: HoldingDownloadRequest,
): Promise<Blob> {
  try {
    const { fund, ticker, ...timeRange } = request;
    return await postCsv("holding/fund/ticker/csv", request);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to download CSV.");
  }
}
