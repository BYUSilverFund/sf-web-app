"use client";

import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "@/lib/variables";
import { fetchAuthSession } from "aws-amplify/auth";

export type FactorData = { factor: string; exposure: number };

export function useExposures(fund?: string) {
  const [exposures, setExposures] = useState<FactorData[]>([]);
  const [excludedHoldings, setExcludedHoldings] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // simple in-hook cache to avoid refetching
  const cacheRef = useRef<
    Record<string, { exposures: FactorData[]; excluded: string[] }>
  >({});

  useEffect(() => {
    if (!fund) return;
    let mounted = true;
    const fetchData = async () => {
      const key = `${fund}`;
      const cached = cacheRef.current[key];
      if (cached) {
        setExposures(cached.exposures);
        setExcludedHoldings(cached.excluded);
        setError(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        setExposures([]);
        setExcludedHoldings([]);
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        const endpoint = `${API_BASE_URL}factor-exposures/${fund}`;
        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Request failed (HTTP ${response.status}).`);
        }
        const data = await response.json();
        const exposuresObj = data?.exposures ?? {};
        const exposureData = Object.entries(exposuresObj)
          .map(([key, value]) => ({
            factor: String(key),
            exposure: Number(value),
          }))
          .sort((a, b) => Math.abs(b.exposure) - Math.abs(a.exposure));
        if (!mounted) return;
        setExposures(exposureData);
        const excluded = data?.positions_not_in_exposures ?? [];
        setExcludedHoldings(excluded);
        cacheRef.current[key] = { exposures: exposureData, excluded };
      } catch (err) {
        console.error("Failed fetching exposures:", err);
        if (mounted) {
          setError(
            err instanceof Error
              ? `Unable to load factor exposures: ${err.message}`
              : "Unable to load factor exposures. Please try again.",
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => void (mounted = false);
  }, [fund]);

  return { exposures, excludedHoldings, loading, error };
}
