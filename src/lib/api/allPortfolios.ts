import type {
  AllPortfoliosRequest,
  AllPortfoliosSummaryResponse,
} from "../types";
import { postJson, type ApiRequestOptions } from "./client";

export function getAllPortfoliosSummary(
  request: AllPortfoliosRequest,
  options?: ApiRequestOptions,
): Promise<AllPortfoliosSummaryResponse> {
  return postJson("all-portfolios/summary", request, options);
}
