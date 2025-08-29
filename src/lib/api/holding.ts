import { DividendsResponse, HoldingRequest, HoldingSummaryResponse, HoldingTimeSeriesResponse, TradesResponse } from "../types";

export async function getHoldingSummary(
    request: HoldingRequest
): Promise<HoldingSummaryResponse> {

    try {
        const response = await fetch("https://api.silverfund.byu.edu/holding/summary", {
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
        const response = await fetch("https://api.silverfund.byu.edu/holding/time-series", {
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
        const response = await fetch("https://api.silverfund.byu.edu/holding/dividends", {
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

export async function getTrades(
    request: HoldingRequest
): Promise<TradesResponse> {

    try {
        const response = await fetch("https://api.silverfund.byu.edu/holding/trades", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: TradesResponse = await response.json();

        return result;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch data.");
    }
}
