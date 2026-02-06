"use client";

import { useEffect, useState } from "react";
import {
  getFundRiskForecast,
  getAllFundsRiskForecast,
} from "@/lib/api/riskForecast";

import { RiskForecast } from "@/lib/types";

export function useRiskForecast(fund?: string) {
  const [riskForecast, setRiskForecast] = useState<RiskForecast | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(undefined);

  useEffect(() => {
    if (!fund) return;
    let mounted = true;
    async function fetchRiskForecast() {
      setLoading(true);
      setError(undefined);
      try {
        const f = fund as string;
        const data =
          f === "all_funds"
            ? await getAllFundsRiskForecast()
            : await getFundRiskForecast(f);
        if (!mounted) return;
        setRiskForecast(data);
      } catch (err) {
        console.error("Failed fetching risk forecast:", err);
        if (!mounted) return;
        setError(err);
        setRiskForecast(undefined);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    fetchRiskForecast();
    return () => void (mounted = false);
  }, [fund]);

  return { riskForecast, loading, error };
}
