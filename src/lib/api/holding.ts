import { DividendsResponse, HoldingRequest, HoldingSummaryResponse, HoldingTimeSeriesResponse } from "../types";

export async function getHoldingSummary(
    request: HoldingRequest
): Promise<HoldingSummaryResponse> {

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_FASTAPI_URL + "holding/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allFundsSummaryResponse: HoldingSummaryResponse = await response.json();

        return allFundsSummaryResponse;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch data.");
    }
}

export async function getHoldingTimeSeries(
    request: HoldingRequest
): Promise<HoldingTimeSeriesResponse> {

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_FASTAPI_URL + "holding/time-series", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allFundsTimeSeriesResponse: HoldingTimeSeriesResponse = await response.json();

        return allFundsTimeSeriesResponse;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch data.");
    }
}

export async function getDividends(
    request: HoldingRequest
): Promise<DividendsResponse> {

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_FASTAPI_URL + "holding/dividends", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: DividendsResponse = await response.json();

        return result;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch data.");
    }
}
