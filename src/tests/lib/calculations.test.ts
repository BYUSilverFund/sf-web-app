import { describe, it, expect } from "vitest";
import { calculateSummaryMetrics } from "@/lib/RealizedVsAnnualizedCalculations";

describe("calculateSummaryMetrics", () => {
  const baseSummary = {
    start: "2024-01-01",
    end: "2024-12-31",
    trading_days: 252, // 1 full year
    volatility: 0.1,
    sharpe_ratio: 0.5,
    alpha: 0.02,
    tracking_error: 0.05,
    information_ratio: 0.3,
  };

  const baseBenchmark = {
    start: "2024-01-01",
    end: "2024-12-31",
    trading_days: 252,
    volatility: 0.08,
    sharpe_ratio: 0.4,
    dividend_yield: 0.02,
  };

  it("returns realized metrics when annualized=false", () => {
    const result = calculateSummaryMetrics(false, baseSummary, baseBenchmark);
    expect(result.fundVol).toBe(0.1); // Same as input
    expect(result.fundSharpe).toBe(0.5);
    expect(result.fundAlpha).toBe(0.02);
  });

  it("annualizes volatility correctly (sqrt formula)", () => {
    // 6 months: 126 trading days, vol=0.1
    // Annualized = 0.1 * sqrt(252/126) = 0.1 * 1.414... = 0.1414...
    const result = calculateSummaryMetrics(true, {
      ...baseSummary,
      trading_days: 126,
    });
    expect(result.fundVol).toBeCloseTo(0.1414, 3);
  });

  it("annualizes sharpe ratio correctly (sqrt formula)", () => {
    const result = calculateSummaryMetrics(true, {
      ...baseSummary,
      trading_days: 126,
    });
    expect(result.fundSharpe).toBeCloseTo(0.7071, 3); // 0.5 * sqrt(252/126)
  });

  it("annualizes alpha correctly (linear formula)", () => {
    // 6 months: 126 days, alpha=0.02
    // Annualized = 0.02 * (252/126) = 0.02 * 2 = 0.04
    const result = calculateSummaryMetrics(true, {
      ...baseSummary,
      trading_days: 126,
    });
    expect(result.fundAlpha).toBeCloseTo(0.04, 3);
  });

  it("annualizes tracking error correctly (sqrt formula)", () => {
    const result = calculateSummaryMetrics(true, {
      ...baseSummary,
      trading_days: 126,
    });
    expect(result.fundTE).toBeCloseTo(0.0707, 3); // 0.05 * sqrt(252/126)
  });

  it("returns undefined metrics when days is 0", () => {
    const result = calculateSummaryMetrics(true, {
      ...baseSummary,
      trading_days: 0,
    });
    expect(result.fundVol).toBeUndefined();
    expect(result.fundAlpha).toBeUndefined();
    expect(result.fundSharpe).toBeUndefined();
  });

  it("returns undefined metrics when summary is undefined", () => {
    const result = calculateSummaryMetrics(true, undefined, baseBenchmark);
    expect(result.fundVol).toBeUndefined();
    expect(result.fundSharpe).toBeUndefined();
    expect(result.fundAlpha).toBeUndefined();
  });

  it("handles undefined optional fields gracefully", () => {
    const result = calculateSummaryMetrics(true, {
      ...baseSummary,
      sharpe_ratio: undefined,
      tracking_error: undefined,
      information_ratio: undefined,
    });
    expect(result.fundSharpe).toBeUndefined();
    expect(result.fundTE).toBeUndefined();
    expect(result.fundIR).toBeUndefined();
  });

  it("calculates benchmark metrics correctly", () => {
    const result = calculateSummaryMetrics(false, baseSummary, baseBenchmark);
    expect(result.benchVol).toBe(0.08);
    expect(result.benchSharpe).toBe(0.4);
  });

  it("annualizes benchmark metrics correctly", () => {
    const result = calculateSummaryMetrics(true, baseSummary, {
      ...baseBenchmark,
      trading_days: 126,
    });
    expect(result.benchVol).toBeCloseTo(0.1131, 3); // 0.08 * sqrt(252/126)
    expect(result.benchSharpe).toBeCloseTo(0.5656, 3); // 0.4 * sqrt(252/126)
  });

  it("returns all metrics in correct shape", () => {
    const result = calculateSummaryMetrics(true, baseSummary, baseBenchmark);
    expect(result).toHaveProperty("fundVol");
    expect(result).toHaveProperty("fundSharpe");
    expect(result).toHaveProperty("fundAlpha");
    expect(result).toHaveProperty("fundTE");
    expect(result).toHaveProperty("fundIR");
    expect(result).toHaveProperty("benchVol");
    expect(result).toHaveProperty("benchSharpe");
  });
});
