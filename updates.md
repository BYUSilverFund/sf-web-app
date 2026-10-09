# Codebase Updates

## Fix first

- [ ] **Check the beta chart's date range and data handling.** `src/lib/api/betaChart.ts` builds a range from the current date, while `src/components/BetaChart.tsx` displays the response dates and beta. Confirm the request and chart regression use the intended period and benchmark data; handle empty or malformed CSV before rendering.

## Improve reliability

- [ ] **Validate the API base URL at startup.** `src/lib/variables.ts` concatenates `NEXT_PUBLIC_FASTAPI_URL` without checking it exists, so a missing value silently produces URLs beginning with `undefined/`. Fail clearly when it is absent.
- [x] **Handle failed HTTP responses in forecast hooks.** `src/components/forecast/hooks/useDetailData.ts` and `src/components/forecast/hooks/useExposures.ts` parse JSON without checking `response.ok`. Add status checks and visible error state so server errors aren't mistaken for empty data.
- [ ] **Preserve useful API error details.** The wrappers in `src/lib/api/holding.ts` log the original error but replace it with a generic one. Preserve the original as the cause or use a shared typed API error so callers can distinguish network, authentication, and server failures.
- [ ] **Use the lockfile in Amplify builds.** `amplify.yml` runs `npm install` despite the repository having a `package-lock.json`. Prefer `npm ci` for repeatable deployments.

## Reduce maintenance and accessibility debt

- [ ] **Consolidate repeated API request handling.** Fund, holding, and portfolio wrappers repeat fetch, status checks, logging, and error conversion. A shared helper could standardize headers, error handling, and cancellation support.
- [ ] **Make mobile navigation accessible and controlled.** The menu buttons in `src/components/Navbar.tsx` lack accessible labels and expanded state. Add `aria-label` and `aria-expanded`, and prevent hidden menu links from receiving keyboard focus.
- [ ] **Remove the recent-trades response log.** `src/lib/api/holding.ts` logs the full response on every recent-trades request. Remove it or make diagnostics development-only.
- [ ] **Ensure lint runs in CI.** `next.config.js` sets `ignoreDuringBuilds: true`. Run lint separately in CI so build success doesn't hide lint regressions.
