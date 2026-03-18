import { FundRequest, FundBetaChartPoint, FundBetaChartData } from "../types";
import { API_BASE_URL } from "../variables";
import { getFundSummary } from "./fund";

export async function getFundBetaChart(): Promise<FundBetaChartData> {
  try {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setDate(today.getDate() - 365);

    const request: FundRequest = {
      start: oneYearAgo.toISOString().split("T")[0],
      end: today.toISOString().split("T")[0],
    };

    const summary = await getFundSummary(request);

    const csvResponse = await fetch(API_BASE_URL + "fund/all-funds/csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!csvResponse.ok) {
      throw new Error(`HTTP error! status: ${csvResponse.status}`);
    }

    const csvText = await csvResponse.text();

    const lines = csvText.trim().split("\n").slice(1);
    const points: FundBetaChartPoint[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      const cols = line.split(",");
      const date = cols[0];
      const fundReturn = parseFloat(cols[2]) / 100;
      const benchmarkReturn = parseFloat(cols[5]) / 100;
      const riskFreeReturn = parseFloat(cols[7]) / 100;

      if (
        !date ||
        isNaN(fundReturn) ||
        isNaN(benchmarkReturn) ||
        isNaN(riskFreeReturn)
      )
        continue;

      const fundExcessReturn = fundReturn - riskFreeReturn;
      const benchmarkExcessReturn = benchmarkReturn - riskFreeReturn;

      if (
        Math.abs(fundExcessReturn) > 0.03 ||
        Math.abs(benchmarkExcessReturn) > 0.03
      )
        continue;

      points.push({
        date,
        fund_return: fundExcessReturn,
        benchmark_return: benchmarkExcessReturn,
      });
    }

    return {
      fund: "Silver Fund",
      start: summary.start,
      end: summary.end,
      beta: summary.beta,
      points,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}
