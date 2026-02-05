export type RiskForecast = {
  tickers: string[];
  weights: number[];
  volatility: number;
  beta: number;
  tracking_error: number;
  holdings?: HoldingRisk[];
};

export type HoldingRisk = {
  ticker: string;
  fund_weight: number;
  volatility: number;
  beta: number;
  tracking_error: number;
};
