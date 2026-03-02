import {
  AllHoldingsRecord,
  AllPortfoliosRecord,
  DividendsRecord,
  TradesRecord,
  PortfolioSummaryResponse,
} from "@/lib/types";

export const mockPortfolioSummary: PortfolioSummaryResponse = {
  fund: "grad",
  start: "2024-01-01",
  end: "2024-03-31",
  trading_days: 63,
  value: 250000,
  total_return: 0.0523,
  sharpe_ratio: 0.423,
  volatility: 0.1234,
  dividends: 3500,
  dividend_yield: 0.014,
  alpha: 0.0145,
  beta: 0.98,
  tracking_error: 0.0234,
  information_ratio: 0.618,
};

export const mockAllHoldingsRecords: AllHoldingsRecord[] = [
  {
    ticker: "AAPL",
    active: true,
    shares: 100,
    price: 150.5,
    value: 15050,
    total_return: 0.0842,
    volatility: 0.2145,
    dividends: 125.5,
    dividends_per_share: 1.25,
    dividend_yield: 0.0083,
    alpha: 0.0234,
    beta: 1.2,
  },
  {
    ticker: "MSFT",
    active: true,
    shares: 50,
    price: 380.2,
    value: 19010,
    total_return: 0.1203,
    volatility: 0.1876,
    dividends: 95.2,
    dividends_per_share: 1.904,
    dividend_yield: 0.005,
    alpha: 0.0156,
    beta: 0.95,
  },
];

export const mockAllPortfoliosRecords: AllPortfoliosRecord[] = [
  {
    portfolio: "grad",
    value: 250000,
    total_return: 0.0523,
    volatility: 0.1234,
    sharpe_ratio: 0.423,
    dividends: 3500,
    dividend_yield: 0.014,
    alpha: 0.0145,
    beta: 0.98,
    tracking_error: 0.0234,
    information_ratio: 0.618,
  },
  {
    portfolio: "undergrad",
    value: 180000,
    total_return: 0.0623,
    volatility: 0.1456,
    sharpe_ratio: 0.392,
    dividends: 2800,
    dividend_yield: 0.0156,
    alpha: 0.0098,
    beta: 1.05,
    tracking_error: 0.0267,
    information_ratio: 0.367,
  },
];

export const mockDividends: DividendsRecord[] = [
  {
    date: "2024-03-15",
    shares: 100,
    dividends_per_share: 0.82,
    dividends: 82,
  },
  {
    date: "2023-12-10",
    shares: 100,
    dividends_per_share: 0.82,
    dividends: 82,
  },
];

export const mockTrades: TradesRecord[] = [
  {
    date: "2024-02-20",
    type: "Buy",
    shares: 50,
    price: 145.3,
    value: 7265,
  },
  {
    date: "2023-10-05",
    type: "Sell",
    shares: 25,
    price: 142.1,
    value: 3552.5,
  },
];
