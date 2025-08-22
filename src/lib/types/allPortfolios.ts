export interface AllPortfoliosRequest {
  start: string
  end: string
}

export interface AllPortfoliosRecord {
  portfolio: string
  value: number
  total_return: number
  sharpe_ratio: number
  volatility: number
  dividends: number
  dividend_yield: number
}

export interface AllPortfoliosSummaryResponse {
  start: string
  end: string
  portfolios: AllPortfoliosRecord[]
}