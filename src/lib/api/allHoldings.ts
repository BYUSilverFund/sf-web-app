import type { AllHoldingsRequest, AllHoldingsSummaryResponse } from "../types";
import { postJson, type ApiRequestOptions } from "./client";

export function getAllHoldingsSummary(
  request: AllHoldingsRequest,
  options?: ApiRequestOptions,
): Promise<AllHoldingsSummaryResponse> {
  return postJson("all-holdings/summary", request, options);
}
