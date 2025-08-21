export interface AllFundsRequest {
  start: string; // ISO date string: "YYYY-MM-DD"
  end: string;   // ISO date string: "YYYY-MM-DD"
}

export interface AllFundsSummaryResponse {
  start: string; // ISO date string
  end: string;   // ISO date string
  value: number;
  total_return: number;
  sharpe_ratio: number;
  volatility: number;
  dividends: number;
  dividend_yield: number;
  alpha: number;
  beta: number;
  tracking_error: number;
  information_ratio: number;
}

export interface AllFundsRecord {
  date: string;  // ISO date string
  value: number;
  return_: number;
  cummulative_return: number;
  dividends: number;
  benchmark_return: number;
  benchmark_cummulative_return: number;
}

export interface AllFundsTimeSeriesResponse {
  start: string; // ISO date string
  end: string;   // ISO date string
  records: AllFundsRecord[];
}
