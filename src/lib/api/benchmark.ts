import { BenchmarkRequest, BenchmarkSummaryResponse } from "../types";
import { API_BASE_URL } from "../variables";

export async function getBenchmarkSummary(
  request: BenchmarkRequest
): Promise<BenchmarkSummaryResponse> {
  try {
    const response = await fetch(
      API_BASE_URL + "benchmark/summary",
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
