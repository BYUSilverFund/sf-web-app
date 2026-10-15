import type {
  FundRequest,
  FundSummaryResponse,
  FundTimeSeriesResponse,
} from "../types";
import { postJson, type ApiRequestOptions } from "./client";

export function getFundSummary(
  request: FundRequest,
  options?: ApiRequestOptions,
): Promise<FundSummaryResponse> {
  return postJson("fund/summary", request, options);
}

export function getFundTimeSeries(
  request: FundRequest,
  options?: ApiRequestOptions,
): Promise<FundTimeSeriesResponse> {
  return postJson("fund/time-series", request, options);
}
