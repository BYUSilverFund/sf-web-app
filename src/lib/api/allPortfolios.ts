import { AllPortfoliosRequest, AllPortfoliosSummaryResponse } from "../types";
import { API_BASE_URL } from "../variables";

export async function getAllPortfoliosSummary(
  request: AllPortfoliosRequest,
): Promise<AllPortfoliosSummaryResponse> {
  try {
    const response = await fetch(API_BASE_URL + "all-portfolios/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allFundsSummaryResponse: AllPortfoliosSummaryResponse =
      await response.json();

    return allFundsSummaryResponse;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}
