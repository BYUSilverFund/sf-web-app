type PeriodSummary = {
  start: string;
  end: string;
  volatility: number;
  sharpe_ratio?: number;
  alpha: number;
  tracking_error?: number;
  information_ratio?: number;
};

type BenchmarkSummary = {
  start: string;
  end: string;
  volatility: number;
  sharpe_ratio: number;
  dividend_yield: number;
};

export function calculateSummaryMetrics(
  annualized: boolean,
  summary?: PeriodSummary,
  benchmark?: BenchmarkSummary,
) {
  const daysBetween = (start: string, end: string) =>
    Math.max(1, (Date.parse(end) - Date.parse(start)) / 864e5);

  // For 1-year periods, use actual days; otherwise use 252
  const tradingDaysInYear = (days: number) =>
    days >= 250 && days <= 254 ? days : 252;

  const annStd = (periodStd: number, days: number) =>
    periodStd * Math.sqrt(tradingDaysInYear(days) / days);

  const annReturn = (periodReturn: number, days: number) =>
    periodReturn * (tradingDaysInYear(days) / days);

  const toggle = (realized: number, annualizedValue: number) =>
    annualized ? annualizedValue : realized;

  const days = summary ? daysBetween(summary.start, summary.end) : 1;
  const benchDays = benchmark ? daysBetween(benchmark.start, benchmark.end) : 1;

  const fundVol = summary
    ? toggle(summary.volatility, annStd(summary.volatility, days))
    : undefined;

  const fundSharpe =
    summary && summary.sharpe_ratio != null
      ? toggle(
          summary.sharpe_ratio,
          summary.sharpe_ratio * Math.sqrt(tradingDaysInYear(days) / days),
        )
      : undefined;

  const fundAlpha = summary
    ? toggle(summary.alpha, annReturn(summary.alpha, days))
    : undefined;

  const fundTE =
    summary && summary.tracking_error !== undefined
      ? toggle(summary.tracking_error, annStd(summary.tracking_error, days))
      : undefined;

  const fundIR =
    summary && summary.information_ratio != null
      ? toggle(
          summary.information_ratio,
          summary.information_ratio * Math.sqrt(tradingDaysInYear(days) / days),
        )
      : undefined;

  const benchVol = benchmark
    ? toggle(benchmark.volatility, annStd(benchmark.volatility, benchDays))
    : undefined;

  const benchSharpe = benchmark
    ? toggle(
        benchmark.sharpe_ratio,
        benchmark.sharpe_ratio *
          Math.sqrt(tradingDaysInYear(benchDays) / benchDays),
      )
    : undefined;

  return {
    fundVol,
    fundSharpe,
    fundAlpha,
    fundTE,
    fundIR,
    benchVol,
    benchSharpe,
  };
}
