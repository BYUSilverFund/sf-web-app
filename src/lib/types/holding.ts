export interface HoldingRequest {
  fund: string
  ticker: string
  start: string
  end: string
}


export interface HoldingSummaryResponse {
  fund: string
  ticker: string
  start: string
  end: string
  active: boolean
  shares: number
  price: number
  value: number
  total_return: number
  volatility: number
  dividends_per_share: number
  dividend_yield: number
  alpha: number
  beta: number
}


export interface HoldingRecord {
  date: string
  weight: number
  price: number
  shares: number
  value: number
  return_: number
  cummulative_return: number
  dividends: number
  dividends_per_share: number
  benchmark_return: number
  benchmark_cummulative_return: number
}


export interface HoldingTimeSeriesResponse {
  fund: string
  ticker: string
  start: string
  end: string
  records: HoldingRecord[]
}
