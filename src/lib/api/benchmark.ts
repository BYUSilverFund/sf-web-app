import type { BenchmarkRequest, BenchmarkSummaryResponse } from "../types";
import { postJson, type ApiRequestOptions } from "./client";

export function getBenchmarkSummary(
  request: BenchmarkRequest,
  options?: ApiRequestOptions,
): Promise<BenchmarkSummaryResponse> {
  return postJson("benchmark/summary", request, options);
}
