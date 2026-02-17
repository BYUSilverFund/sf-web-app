"use client";

import { useEffect, useState } from "react";
import {
  getFundRiskForecast,
  getAllFundsRiskForecast,
  getFundHoldingRiskForecast,
} from "@/lib/api/riskForecast";

import { RiskForecast } from "@/lib/types";

export function useRiskForecast(fund?: string, ticker?: string) {
  const [riskForecast, setRiskForecast] = useState<RiskForecast | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(undefined);

  useEffect(() => {
    if (!fund) return;
    const currentFund = fund;
    let mounted = true;
    async function fetchRiskForecast() {
      setLoading(true);
      setError(undefined);
      try {
        let data: RiskForecast;
        if (ticker) {
          data = await getFundHoldingRiskForecast(currentFund, ticker);
        } else if (currentFund === "all_funds") {
          data = await getAllFundsRiskForecast();
        } else {
          data = await getFundRiskForecast(currentFund);
        }
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
  }, [fund, ticker]);

  return { riskForecast, loading, error };
}
