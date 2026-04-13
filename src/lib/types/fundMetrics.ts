// Shared metric shapes keep the overview page and the holding page aligned on the same card contract.
export interface FundBenchmarkMetric {
  fund: string;
  benchmark: string;
}

export interface FundMetricsModeValues {
  returnMetric: FundBenchmarkMetric;
  volatility: FundBenchmarkMetric;
  sharpeRatio: FundBenchmarkMetric;
  alpha: string;
  trackingError: string;
  informationRatio: string;
}

export interface FundMetrics {
  realized: FundMetricsModeValues;
  annualized: FundMetricsModeValues;
  value: FundBenchmarkMetric;
  dividendValue: FundBenchmarkMetric;
  dividendYield: FundBenchmarkMetric;
  beta: string;
}
