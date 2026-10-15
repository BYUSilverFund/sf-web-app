import type {
  PortfolioRequest,
  PortfolioSummaryResponse,
  PortfolioTimeSeriesResponse,
  TradesResponse,
} from "../types";
import { postJson, type ApiRequestOptions } from "./client";

export function getPortfolioSummary(
  request: PortfolioRequest,
  options?: ApiRequestOptions,
): Promise<PortfolioSummaryResponse> {
  return postJson("portfolio/summary", request, options);
}

export function getActivePortfolioSummary(
  request: PortfolioRequest,
  options?: ApiRequestOptions,
): Promise<PortfolioSummaryResponse> {
  return postJson("portfolio/summary/active", request, options);
}

export function getPortfolioTimeSeries(
  request: PortfolioRequest,
  options?: ApiRequestOptions,
): Promise<PortfolioTimeSeriesResponse> {
  return postJson("portfolio/time-series", request, options);
}

export function getPortfolioTrades(
  request: PortfolioRequest,
  options?: ApiRequestOptions,
): Promise<TradesResponse> {
  return postJson("portfolio/trades", request, options);
}
