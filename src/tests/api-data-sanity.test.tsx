import { describe, it, expect } from "vitest";
import { getFundSummary, getFundTimeSeries } from "@/lib/api/fund";
import {
  getHoldingSummary,
  getHoldingTimeSeries,
  getDividends,
  getTrades,
} from "@/lib/api/holding";
import { getAllHoldingsSummary } from "@/lib/api/allHoldings";
import { getAllPortfoliosSummary } from "@/lib/api/allPortfolios";
import {
  getPortfolioSummary,
  getPortfolioTimeSeries,
} from "@/lib/api/portfolio";
import { getBenchmarkSummary } from "@/lib/api/benchmark";
import {
  getAvailableTickers,
  getFundTickers,
  getCovarianceMatrix,
} from "@/lib/api/covarianceMatrix";
import {
  getAllFundsRiskForecast,
  getFundRiskForecast,
  getFundHoldingRiskForecast,
} from "@/lib/api/riskForecast";

describe("API data sanity", () => {
  it("fund endpoints return expected shapes", async () => {
    const summary = await getFundSummary({
      start: "2024-01-01",
      end: "2024-01-02",
    });
    expect(summary).toHaveProperty("start");
    expect(summary).toHaveProperty("end");
    expect(summary).toHaveProperty("trading_days");

    const ts = await getFundTimeSeries({
      start: "2024-01-01",
      end: "2024-01-02",
    });
    expect(ts).toHaveProperty("records");
    expect(Array.isArray(ts.records)).toBe(true);
  });

  it("holding endpoints return expected shapes", async () => {
    const summary = await getHoldingSummary({
      fund: "test",
      ticker: "TST",
      start: "2024-01-01",
      end: "2024-01-02",
    });
    expect(summary).toHaveProperty("fund");

    const ts = await getHoldingTimeSeries({
      fund: "test",
      ticker: "TST",
      start: "2024-01-01",
      end: "2024-01-02",
    });
    expect(ts).toHaveProperty("records");

    const divs = await getDividends({
      fund: "test",
      ticker: "TST",
      start: "2024-01-01",
      end: "2024-01-02",
    });
    expect(divs).toHaveProperty("dividends");

    const trades = await getTrades({
      fund: "test",
      ticker: "TST",
      start: "2024-01-01",
      end: "2024-01-02",
    });
    expect(trades).toHaveProperty("trades");
  });

  it("aggregates and portfolio endpoints", async () => {
    const ah = await getAllHoldingsSummary({
      fund: "test",
      start: "2024-01-01",
      end: "2024-01-02",
    });
    expect(ah).toHaveProperty("holdings");

    const ap = await getAllPortfoliosSummary({
      start: "2024-01-01",
      end: "2024-01-02",
    });
    expect(ap).toHaveProperty("portfolios");

    const ps = await getPortfolioSummary({
      fund: "portfolio",
      start: "2024-01-01",
      end: "2024-01-02",
    });
    expect(ps).toHaveProperty("fund");

    const pts = await getPortfolioTimeSeries({
      fund: "portfolio",
      start: "2024-01-01",
      end: "2024-01-02",
    });
    expect(pts).toHaveProperty("records");
  });

  it("benchmark endpoint", async () => {
    const b = await getBenchmarkSummary({
      start: "2024-01-01",
      end: "2024-01-02",
    });
    expect(b).toHaveProperty("adjusted_close");
  });

  it("covariance endpoints and blob download", async () => {
    const tickers = await getAvailableTickers();
    expect(tickers).toHaveProperty("tickers");

    const fundTickers = await getFundTickers({ fund: "grad" });
    expect(fundTickers).toHaveProperty("tickers");

    const blob = await getCovarianceMatrix({ tickers: ["AAPL"] });
    // expect a Blob-like response (in node env MSW returns Buffer which has arrayBuffer)
    expect(blob).toBeDefined();
  });

  it("risk forecast endpoints", async () => {
    const all = await getAllFundsRiskForecast();
    expect(all).toHaveProperty("tickers");

    const fund = await getFundRiskForecast("grad");
    expect(fund).toHaveProperty("tickers");

    const holding = await getFundHoldingRiskForecast("grad", "AAPL");
    expect(holding).toHaveProperty("tickers");
  });
});
