export interface AllHoldingsRequest {
  fund: string
  start: string
  end: string
}


export interface AllHoldingsRecord {
  ticker: string
  active: boolean
  value: number
  total_return: number
  volatility: number
  dividends: number
}


export interface AllHoldingsSummaryResponse {
  fund: string
  start: string
  end: string
  holdings: AllHoldingsRecord[]
}
