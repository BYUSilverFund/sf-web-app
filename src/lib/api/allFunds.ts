import { AllFundsRequest, AllFundsSummaryResponse, AllFundsTimeSeriesResponse } from "../types";

export async function getAllFundsSummary(
    request: AllFundsRequest
): Promise<AllFundsSummaryResponse> {

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_FASTAPI_URL + "all-funds/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allFundsSummaryResponse: AllFundsSummaryResponse = await response.json();

        return allFundsSummaryResponse;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch data.");
    }
}

export async function getAllFundsTimeSeries(
    request: AllFundsRequest
): Promise<AllFundsTimeSeriesResponse> {

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_FASTAPI_URL + "all-funds/time-series", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allFundsTimeSeriesResponse: AllFundsTimeSeriesResponse = await response.json();

        return allFundsTimeSeriesResponse;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch data.");
    }
}
