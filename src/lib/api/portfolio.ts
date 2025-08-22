import { PortfolioRequest, PortfolioSummaryResponse, PortfolioTimeSeriesResponse } from "../types";

export async function getPortfolioSummary(
    request: PortfolioRequest
): Promise<PortfolioSummaryResponse> {

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_FASTAPI_URL + "portfolio/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allFundsSummaryResponse: PortfolioSummaryResponse = await response.json();

        return allFundsSummaryResponse;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch data.");
    }
}

export async function getPortfolioTimeSeries(
    request: PortfolioRequest
): Promise<PortfolioTimeSeriesResponse> {

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_FASTAPI_URL + "portfolio/time-series", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allFundsTimeSeriesResponse: PortfolioTimeSeriesResponse = await response.json();

        return allFundsTimeSeriesResponse;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch data.");
    }
}
