export type RiskForecast = {
  tickers: string[];
  weights: number[];
  variance: number;
  volatility: number;
  beta: number;
};
