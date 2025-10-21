// Request type
export interface BenchmarkRequest {
  start: string; // ISO date string, e.g., "2024-08-20"
  end: string;
}

// Response types
export interface BenchmarkSummaryResponse {
  start: string;
  end: string;
  adjusted_close: number;
  total_return: number;
  sharpe_ratio: number;
  volatility: number;
  dividends_per_share: number;
  dividend_yield: number;
}

// Individual record in time series
export interface BenchmarkRecord {
  date: string;
  adjusted_close: number;
  return_: number;
  cummulative_return: number;
  dividends_per_share: number;
}

// Time series response
export interface BenchmarkTimeSeriesResponse {
  start: string;
  end: string;
  records: BenchmarkRecord[];
}
