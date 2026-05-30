import { describe, it, expect } from "vitest";
import { calculateSummaryMetrics } from "@/lib/RealizedVsAnnualizedCalculations";

describe("calculateSummaryMetrics", () => {
  const baseSummary = {
    start: "2024-01-01",
    end: "2024-12-31",
    trading_days: 252,
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
    expect(result.fundVol).toBeCloseTo(0.1 / Math.sqrt(252), 6);
    expect(result.fundSharpe).toBe(0.5);
    expect(result.fundAlpha).toBe(0.02);
  });

  it("returns annualized volatility directly from summary", () => {
    const result = calculateSummaryMetrics(true, {
      ...baseSummary,
      trading_days: 126,
    });
    expect(result.fundVol).toBeCloseTo(0.1, 3);
  });

  it("returns annualized sharpe ratio directly from summary", () => {
    const result = calculateSummaryMetrics(true, {
      ...baseSummary,
      trading_days: 126,
    });
    expect(result.fundSharpe).toBeCloseTo(0.5, 3);
  });

  it("annualizes alpha correctly (linear formula)", () => {
    const result = calculateSummaryMetrics(true, {
      ...baseSummary,
      trading_days: 126,
    });
    expect(result.fundAlpha).toBeCloseTo(0.04, 3);
  });

  it("returns annualized tracking error directly from summary", () => {
    const result = calculateSummaryMetrics(true, {
      ...baseSummary,
      trading_days: 126,
    });
    expect(result.fundTE).toBeCloseTo(0.05, 3);
  });

  it("returns available direct metrics when days is 0", () => {
    const result = calculateSummaryMetrics(true, {
      ...baseSummary,
      trading_days: 0,
    });
    expect(result.fundVol).toBe(0.1);
    expect(result.fundAlpha).toBeUndefined();
    expect(result.fundSharpe).toBe(0.5);
    expect(result.fundTE).toBe(0.05);
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
    expect(result.benchVol).toBeCloseTo(0.08 / Math.sqrt(252), 6);
    expect(result.benchSharpe).toBe(0.4);
  });

  it("returns annualized benchmark volatility directly and annualizes benchmark sharpe", () => {
    const result = calculateSummaryMetrics(true, baseSummary, {
      ...baseBenchmark,
      trading_days: 126,
    });
    expect(result.benchVol).toBeCloseTo(0.08, 3);
    expect(result.benchSharpe).toBeCloseTo(0.5656, 3);
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
