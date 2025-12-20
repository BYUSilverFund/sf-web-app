"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/variables";
import FactorsBarChart from "@/components/FactorsBarChart";
import { useParams } from "next/navigation";

export default function FactorExposures() {
  const [exposures, setExposures] = useState<
    { factor: string; exposure: number }[]
  >([]);
  const [excludedHoldings, setExcludedHoldings] = useState<string[]>([]);
  const params = useParams();
  const fund = params.fund as string;

  useEffect(() => {
    fetch(`${API_BASE_URL}factor-exposures/${fund}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const exposuresObj = data?.exposures ?? {};
        const exposureData = Object.entries(exposuresObj)
          .map(([key, value]) => ({
            factor: String(key),
            exposure: Number(value),
          }))
          .sort((a, b) => Math.abs(b.exposure) - Math.abs(a.exposure));
        setExposures(exposureData);
        setExcludedHoldings(data?.positions_not_in_exposures ?? []);
      })
      .catch((err) => {
        console.error("Failed fetching exposures:", err);
      });
  }, [fund]);
  console.log("Rendered exposures:", exposures);

  return (
    <div>
      <FactorsBarChart
        fund={fund}
        chartData={exposures}
        excludedHoldings={excludedHoldings}
      />
    </div>
  );
}
