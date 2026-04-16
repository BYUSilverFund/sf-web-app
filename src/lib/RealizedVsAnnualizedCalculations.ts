type PeriodSummary = {
  start: string;
  end: string;
  trading_days?: number;
  volatility: number;
  sharpe_ratio?: number;
  alpha: number;
  tracking_error?: number;
  information_ratio?: number;
};

type BenchmarkSummary = {
  start: string;
  end: string;
  trading_days?: number;
  volatility: number;
  sharpe_ratio: number;
  dividend_yield: number;
};

const TRADING_DAYS_PER_YEAR = 252;

export function calculateAverageDailyReturn(
  returns: number[] | undefined,
  annualized: boolean,
): number | undefined {
  if (!returns?.length) return undefined;

  const meanDailyReturn =
    returns.reduce((sum, dailyReturn) => sum + dailyReturn, 0) / returns.length;

  return annualized ? meanDailyReturn * TRADING_DAYS_PER_YEAR : meanDailyReturn;
}

export function calculateSummaryMetrics(
  annualized: boolean,
  summary?: PeriodSummary,
  benchmark?: BenchmarkSummary,
  view_1yr = false,
) {
  // single wrapper: ensure `days` is provided and non-zero before calling
  const withDaysCheck =
    <T extends (v: number, d: number) => number>(fn: T) =>
    (value: number, days?: number): number | undefined => {
      if (!days || days === 0) return undefined;
      return fn(value, days as number);
    };

  const annSqRt = withDaysCheck((value: number, days: number) =>
    view_1yr ? value : value * Math.sqrt(TRADING_DAYS_PER_YEAR / days),
  );

  const ann = withDaysCheck((value: number, days: number) =>
    view_1yr ? value : value * (TRADING_DAYS_PER_YEAR / days),
  );

  const toggle = (
    realized: number,
    annualizedValue?: number,
  ): number | undefined => (annualized ? annualizedValue : realized);

  const days = summary?.trading_days;
  const benchDays = benchmark?.trading_days;

  const fundVol = summary
    ? toggle(summary.volatility, annSqRt(summary.volatility, days))
    : undefined;

  const fundSharpe =
    summary && summary.sharpe_ratio != null
      ? toggle(summary.sharpe_ratio, annSqRt(summary.sharpe_ratio, days))
      : undefined;

  const fundAlpha = summary
    ? toggle(summary.alpha, ann(summary.alpha, days))
    : undefined;

  const fundTE =
    summary && summary.tracking_error !== undefined
      ? toggle(summary.tracking_error, annSqRt(summary.tracking_error, days))
      : undefined;

  const fundIR =
    summary && summary.information_ratio != null
      ? toggle(
          summary.information_ratio,
          annSqRt(summary.information_ratio, days),
        )
      : undefined;

  const benchVol = benchmark
    ? toggle(benchmark.volatility, annSqRt(benchmark.volatility, benchDays))
    : undefined;

  const benchSharpe = benchmark
    ? toggle(benchmark.sharpe_ratio, annSqRt(benchmark.sharpe_ratio, benchDays))
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
