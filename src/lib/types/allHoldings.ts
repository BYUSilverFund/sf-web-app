export interface AllHoldingsRequest {
  fund: string;
  start: string;
  end: string;
}

export interface AllHoldingsRecord {
  ticker: string;
  active: boolean;
  shares: number;
  price: number;
  value: number;
  total_return: number;
  volatility: number;
  dividends: number;
  dividends_per_share: number;
  dividend_yield: number;
  alpha: number;
  beta: number;
}

export interface AllHoldingsSummaryResponse {
  fund: string;
  start: string;
  end: string;
  holdings: AllHoldingsRecord[];
}
