import { TickerList, Fund } from "../types";
import { API_BASE_URL } from "../variables";
import { fetchAuthSession } from "aws-amplify/auth";

export async function getCovarianceMatrix(request: TickerList) {
  try {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    if (!accessToken) {
      throw new Error("User is not authenticated.");
    }

    const response = await fetch(API_BASE_URL + "covariance-matrix/latest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.blob();

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}

export async function getAvailableTickers(): Promise<TickerList> {
  try {
    const response = await fetch(API_BASE_URL + "covariance-matrix/tickers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}

export async function getFundTickers(request: Fund): Promise<TickerList> {
  try {
    const response = await fetch(
      API_BASE_URL + "covariance-matrix/fund-tickers",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}
