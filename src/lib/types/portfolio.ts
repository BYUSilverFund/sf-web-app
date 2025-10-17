export interface PortfolioRequest {
  fund: string;
  start: string;
  end: string;
}

export interface PortfolioSummaryResponse {
  fund: string;
  start: string;
  end: string;
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

export interface PortfolioRecord {
  date: string;
  value: number;
  return_: number;
  cummulative_return: number;
  dividends: number;
  benchmark_return: number;
  benchmark_cummulative_return: number;
}

export interface PortfolioTimeSeriesResponse {
  fund: string;
  start: string;
  end: string;
  records: PortfolioRecord[];
}
