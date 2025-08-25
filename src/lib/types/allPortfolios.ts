export interface AllPortfoliosRequest {
  start: string
  end: string
}

export interface AllPortfoliosRecord {
  portfolio: string
  value: number
  total_return: number
  volatility: number
  sharpe_ratio: number
  dividends: number
  dividend_yield: number
  alpha: number
  beta: number
  tracking_error: number
  information_ratio: number
}

export interface AllPortfoliosSummaryResponse {
  start: string
  end: string
  portfolios: AllPortfoliosRecord[]
}