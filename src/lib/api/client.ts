import { API_BASE_URL } from "../variables";

export type ApiRequestOptions = Pick<RequestInit, "headers" | "signal">;

export class ApiError extends Error {
  constructor(
    public readonly path: string,
    public readonly status: number,
    statusText: string,
  ) {
    super(
      `Request to ${path} failed: HTTP ${status}${statusText ? ` ${statusText}` : ""}`,
    );
    this.name = "ApiError";
  }
}

export async function requestJson<TResponse>(
  path: string,
  options: RequestInit,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new ApiError(path, response.status, response.statusText);
  }

  return (await response.json()) as TResponse;
}

export function postJson<TResponse>(
  path: string,
  request: unknown,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return requestJson<TResponse>(path, {
    ...options,
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });
}
