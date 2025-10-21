import {
  FundRequest,
  FundSummaryResponse,
  FundTimeSeriesResponse,
} from "../types";
import { API_BASE_URL } from "../variables";

export async function getFundSummary(
  request: FundRequest,
): Promise<FundSummaryResponse> {
  try {
    const response = await fetch(API_BASE_URL + "fund/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allFundsSummaryResponse: FundSummaryResponse = await response.json();

    return allFundsSummaryResponse;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}

export async function getFundTimeSeries(
  request: FundRequest,
): Promise<FundTimeSeriesResponse> {
  try {
    const response = await fetch(API_BASE_URL + "fund/time-series", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allFundsTimeSeriesResponse: FundTimeSeriesResponse =
      await response.json();

    return allFundsTimeSeriesResponse;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}
