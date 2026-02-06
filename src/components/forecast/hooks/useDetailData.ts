"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/variables";
import { fetchAuthSession } from "aws-amplify/auth";
import { FactorData } from "./useExposures";

export function useDetailData(
  fund?: string,
  factorParam?: string | null,
  holdingParam?: string | null,
) {
  const [detailData, setDetailData] = useState<FactorData[] | null>(null);
  const [detailLabel, setDetailLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!fund) return;
    let mounted = true;

    const fetchFactor = async (f: string) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        const response = await fetch(
          `${API_BASE_URL}factor-exposures/${fund}/${encodeURIComponent(f)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        const src =
          data?.positions ?? data?.holdings ?? data?.exposures ?? data;
        let arr: FactorData[] = [];
        if (Array.isArray(src)) {
          arr = src.map((item: unknown) => {
            if (Array.isArray(item)) {
              const name = item[0];
              const val = item[1];
              return { factor: String(name ?? ""), exposure: Number(val ?? 0) };
            }
            if (item && typeof item === "object") {
              const it = item as Record<string, unknown>;
              const name = it.name ?? it.holding ?? it.factor ?? "";
              const exposure = it.exposure ?? it.value ?? 0;
              return { factor: String(name), exposure: Number(exposure) };
            }
            return { factor: String(item ?? ""), exposure: 0 };
          });
        } else if (src && typeof src === "object") {
          arr = Object.entries(src).map(([k, v]) => ({
            factor: String(k),
            exposure: Number(v as unknown as number | string),
          }));
        }
        arr = arr.sort((a, b) => Math.abs(b.exposure) - Math.abs(a.exposure));
        if (!mounted) return;
        setDetailData(arr);
        setDetailLabel(f);
      } catch (err) {
        console.error("Failed fetching factor details:", err);
      }
    };

    const fetchHolding = async (h: string) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        const response = await fetch(
          `${API_BASE_URL}factor-exposures/holdings/${encodeURIComponent(h)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        const src = data?.exposures ?? data?.factors ?? data;
        let arr: FactorData[] = [];
        if (Array.isArray(src)) {
          arr = src.map((item: unknown) => {
            if (Array.isArray(item)) {
              const name = item[0];
              const val = item[1];
              return { factor: String(name ?? ""), exposure: Number(val ?? 0) };
            }
            if (item && typeof item === "object") {
              const it = item as Record<string, unknown>;
              const name = it.name ?? it.factor ?? it.holding ?? "";
              const exposure = it.exposure ?? it.value ?? 0;
              return { factor: String(name), exposure: Number(exposure) };
            }
            return { factor: String(item ?? ""), exposure: 0 };
          });
        } else if (src && typeof src === "object") {
          arr = Object.entries(src).map(([k, v]) => ({
            factor: String(k),
            exposure: Number(v as unknown as number | string),
          }));
        }
        arr = arr.sort((a, b) => Math.abs(b.exposure) - Math.abs(a.exposure));
        if (!mounted) return;
        setDetailData(arr);
        setDetailLabel(h);
      } catch (err) {
        console.error("Failed fetching holding factors:", err);
      }
    };

    (async () => {
      if (factorParam) {
        await fetchFactor(factorParam);
        return;
      }
      if (holdingParam) {
        await fetchHolding(holdingParam);
        return;
      }
      setDetailData(null);
      setDetailLabel(null);
    })();

    return () => void (mounted = false);
  }, [fund, factorParam, holdingParam]);

  return { detailData, detailLabel };
}
