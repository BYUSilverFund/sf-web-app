import { AllHoldingsRequest, AllHoldingsSummaryResponse } from "../types";

export async function getAllHoldingsSummary(
  request: AllHoldingsRequest
): Promise<AllHoldingsSummaryResponse> {
  try {
    const response = await fetch(
      "https://api.silverfund.byu.edu/all-holdings/summary",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allFundsSummaryResponse: AllHoldingsSummaryResponse =
      await response.json();

    return allFundsSummaryResponse;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}
