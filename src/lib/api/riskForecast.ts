// src/lib/riskForecast.ts
import { RiskForecast } from "../types";
import { API_BASE_URL } from "../variables";
import { fetchAuthSession } from "aws-amplify/auth";

async function getAuthHeader() {
  const session = await fetchAuthSession();
  const accessToken = session.tokens?.accessToken?.toString();

  if (!accessToken) {
    throw new Error("User is not authenticated.");
  }

  return { Authorization: `Bearer ${accessToken}` };
}

// GET /risk_forecast/all_funds
export async function getAllFundsRiskForecast(): Promise<RiskForecast> {
  try {
    const headers = await getAuthHeader();

    const response = await fetch(API_BASE_URL + "risk_forecast/all_funds", {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: RiskForecast = await response.json();
    return result;
  } catch (error) {
    console.error("Risk Forecast Error:", error);
    throw new Error("Failed to fetch all funds risk forecast.");
  }
}

// GET /risk_forecast/{fund}
export async function getFundRiskForecast(fund: string): Promise<RiskForecast> {
  try {
    const headers = await getAuthHeader();

    const response = await fetch(API_BASE_URL + `risk_forecast/${fund}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: RiskForecast = await response.json();
    return result;
  } catch (error) {
    console.error("Risk Forecast Error:", error);
    throw new Error("Failed to fetch fund risk forecast.");
  }
}

// GET /risk_forecast/{fund}/holdings/{ticker}
export async function getFundHoldingRiskForecast(
  fund: string,
  ticker: string,
): Promise<RiskForecast> {
  try {
    const headers = await getAuthHeader();

    const response = await fetch(
      API_BASE_URL + `risk_forecast/${fund}/holdings/${ticker}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: RiskForecast = await response.json();
    return result;
  } catch (error) {
    console.error("Risk Forecast Error:", error);
    throw new Error("Failed to fetch holding risk forecast.");
  }
}
