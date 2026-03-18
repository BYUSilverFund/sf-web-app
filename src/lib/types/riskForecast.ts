export type RiskForecast = {
  tickers: string[];
  weights: number[];
  volatility: number;
  beta: number;
  tracking_error: number;
  fund?: string;
  ticker?: string;
  fund_weight?: number;
  positions_not_in_data?: string[];
};
