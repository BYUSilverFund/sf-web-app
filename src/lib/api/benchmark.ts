import { BenchmarkRequest, BenchmarkSummaryResponse } from "../types";

export async function getBenchmarkSummary(
  request: BenchmarkRequest
): Promise<BenchmarkSummaryResponse> {
  try {
    const response = await fetch(
      "https://api.silverfund.byu.edu/benchmark/summary",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const benchmarkSummaryResponse: BenchmarkSummaryResponse =
      await response.json();

    return benchmarkSummaryResponse;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}
