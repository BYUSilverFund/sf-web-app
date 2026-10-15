import type {
  DividendsResponse,
  HoldingRequest,
  HoldingSummaryResponse,
  HoldingTimeSeriesResponse,
  TradesResponse,
} from "../types";
import { postJson, type ApiRequestOptions } from "./client";

export function getHoldingSummary(
  request: HoldingRequest,
  options?: ApiRequestOptions,
): Promise<HoldingSummaryResponse> {
  return postJson("holding/summary", request, options);
}

export function getHoldingTimeSeries(
  request: HoldingRequest,
  options?: ApiRequestOptions,
): Promise<HoldingTimeSeriesResponse> {
  return postJson("holding/time-series", request, options);
}

export function getDividends(
  request: HoldingRequest,
  options?: ApiRequestOptions,
): Promise<DividendsResponse> {
  return postJson("holding/dividends", request, options);
}

export function getTrades(
  request: HoldingRequest,
  options?: ApiRequestOptions,
): Promise<TradesResponse> {
  return postJson("holding/trades", request, options);
}

export function getRecentTrades(
  request: HoldingRequest,
  options?: ApiRequestOptions,
): Promise<TradesResponse> {
  return postJson("holding/recent-trades", request, options);
}
