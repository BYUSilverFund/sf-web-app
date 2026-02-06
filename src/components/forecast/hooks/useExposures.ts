"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/variables";
import { fetchAuthSession } from "aws-amplify/auth";

export type FactorData = { factor: string; exposure: number };

export function useExposures(fund?: string) {
  const [exposures, setExposures] = useState<FactorData[]>([]);
  const [excludedHoldings, setExcludedHoldings] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!fund) return;
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        const response = await fetch(
          `${API_BASE_URL}factor-exposures/${fund}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
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
        setExcludedHoldings(data?.positions_not_in_exposures ?? []);
      } catch (err) {
        console.error("Failed fetching exposures:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => void (mounted = false);
  }, [fund]);

  return { exposures, excludedHoldings, loading };
}
