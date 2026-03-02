import { rest } from "msw";

const API_BASE = (
  process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost/"
).replace(/\/+$/, "");

// Minimal realistic fixtures matching src/lib/types
const today = new Date().toISOString().slice(0, 10);
const sampleFundSummary = {
  start: today,
  end: today,
  trading_days: 1,
  value: 1000,
  total_return: 0.01,
  sharpe_ratio: 0.5,
  volatility: 0.1,
  dividends: 0,
  dividend_yield: 0,
  alpha: 0,
  beta: 1,
  tracking_error: 0,
  information_ratio: 0,
};

const sampleTimeSeries = {
  start: today,
  end: today,
  records: [
    {
      date: today,
      value: 1000,
      return_: 0.01,
      cummulative_return: 0.01,
      dividends: 0,
      benchmark_return: 0.009,
      benchmark_cummulative_return: 0.009,
    },
  ],
};

export const handlers = [
  // Fund
  rest.post(`${API_BASE}/fund/summary`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(sampleFundSummary));
  }),
  rest.post(`${API_BASE}/fund/time-series`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(sampleTimeSeries));
  }),

  // Holding
  rest.post(`${API_BASE}/holding/summary`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ ...sampleFundSummary, fund: "test", ticker: "TST" }),
    );
  }),
  rest.post(`${API_BASE}/holding/time-series`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ ...sampleTimeSeries, fund: "test", ticker: "TST" }),
    );
  }),
  rest.post(`${API_BASE}/holding/dividends`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        fund: "test",
        ticker: "TST",
        start: today,
        end: today,
        dividends: [],
      }),
    );
  }),
  rest.post(`${API_BASE}/holding/trades`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        fund: "test",
        ticker: "TST",
        start: today,
        end: today,
        trades: [],
      }),
    );
  }),

  // All holdings / portfolios
  rest.post(`${API_BASE}/all-holdings/summary`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        fund: "all",
        start: today,
        end: today,
        trading_days: 1,
        holdings: [],
      }),
    );
  }),
  rest.post(`${API_BASE}/all-portfolios/summary`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ start: today, end: today, trading_days: 1, portfolios: [] }),
    );
  }),

  // Portfolio
  rest.post(`${API_BASE}/portfolio/summary`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ ...sampleFundSummary, fund: "portfolio" }),
    );
  }),
  rest.post(`${API_BASE}/portfolio/time-series`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(sampleTimeSeries));
  }),

  // Benchmark
  rest.post(`${API_BASE}/benchmark/summary`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        start: today,
        end: today,
        trading_days: 1,
        adjusted_close: 100,
        total_return: 0.01,
        sharpe_ratio: 0.3,
        volatility: 0.05,
        dividends_per_share: 0,
        dividend_yield: 0,
      }),
    );
  }),

  // Covariance matrix endpoints
  rest.post(`${API_BASE}/covariance-matrix/tickers`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ tickers: ["AAPL", "MSFT"] }));
  }),
  rest.post(`${API_BASE}/covariance-matrix/fund-tickers`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ tickers: ["AAPL"] }));
  }),
  rest.post(`${API_BASE}/covariance-matrix/latest`, (req, res, ctx) => {
    const csv = "ticker1,ticker2\n1,2\n";
    return res(
      ctx.status(200),
      ctx.set("Content-Type", "text/csv"),
      ctx.body(Buffer.from(csv)),
    );
  }),

  // Risk forecast
  rest.get(`${API_BASE}/risk_forecast/all_funds`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        tickers: [],
        weights: [],
        volatility: 0,
        beta: 0,
        tracking_error: 0,
      }),
    );
  }),
  rest.get(new RegExp(`${API_BASE}/risk_forecast(/.*)?`), (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        tickers: [],
        weights: [],
        volatility: 0,
        beta: 0,
        tracking_error: 0,
      }),
    );
  }),

  // Factor exposures
  rest.get(`${API_BASE}/factor-exposures/:fund`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        factors: [],
        exposures: [],
      }),
    );
  }),
];

export default handlers;
