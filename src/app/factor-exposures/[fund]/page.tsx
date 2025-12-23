"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/variables";
import { FactorsDataTable } from "@/components/FactorsDataTable";
import { FactorsBarChart } from "@/components/FactorsBarChart";
import { useParams, useSearchParams } from "next/navigation";
import { FundSelector, ViewSelector } from "@/components/ChartControls";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { formatPortfolio } from "@/lib/utils";

export interface FactorData {
  factor: string;
  exposure: number;
}

export default function FactorExposures() {
  const params = useParams();
  const searchParams = useSearchParams();
  const initialShowTop =
    parseInt(searchParams.get("show_top") || "10", 10) || 10;
  const [showTop, setShowTop] = useState<number>(initialShowTop);
  const [exposures, setExposures] = useState<FactorData[]>([]);
  const viewValue = searchParams.get("view") || "table";
  const [view, setView] = useState<string>(viewValue ?? "table");
  const [excludedHoldings, setExcludedHoldings] = useState<string[]>([]);
  const fund = params.fund as string;
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_BASE_URL}factor-exposures/${fund}`)
      .then((res) => res.json())
      .then((data) => {
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

  const fundKeys = [
    "all_funds",
    "grad",
    "undergrad",
    "quant",
    "brigham_capital",
    "quant_paper",
  ];

  function updateURLForFund(fundVal: string) {
    router.push(
      `/factor-exposures/${fundVal}?view=${view}&show_top=${showTop}`,
    );
  }

  function updateURLForView(viewVal: string) {
    setView(viewVal);
    router.push(
      `/factor-exposures/${fund}?view=${viewVal}&show_top=${showTop}`,
    );
  }

  function updateURLForShowTop(v: number) {
    setShowTop(v);
    router.push(`/factor-exposures/${fund}?view=${view}&show_top=${v}`);
  }

  const pages = [
    { name: "All Funds", href: "/performance" },
    ...(fund !== "all_funds"
      ? [{ name: formatPortfolio(fund), href: `/performance/${fund}` }]
      : []),
  ];

  return (
    <div className="lg:px-12 md:px-6 sm:px-0">
      <div className="space-y-4 sm:px-4 py-4">
        <div className="ml-5">
          <Breadcrumbs pages={pages} currentPage="Factor Exposures" />
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow sm:m-2 sm:flex space-y-2 sm:space-y-0 p-4 gap-2 items-center">
          <div className="sm:flex  items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <span>Factor Exposures for</span>
              <FundSelector
                fund={fund}
                funds={fundKeys}
                onValueChange={(v) => updateURLForFund(v)}
              />
            </div>
            <div className="flex items-center gap-3">
              <span>Display</span>
              <ViewSelector
                view={view}
                onValueChange={(v) => updateURLForView(v)}
              />
            </div>
          </div>
        </div>
        <div className="sm:mx-2">
          {view === "table" ? (
            <FactorsDataTable
              data={exposures}
              showTop={showTop}
              setShowTop={(v) => updateURLForShowTop(v)}
            />
          ) : (
            <FactorsBarChart
              chartData={exposures}
              showTop={showTop}
              setShowTop={(v) => updateURLForShowTop(v)}
            />
          )}
        </div>
        <div className="flex flex-col gap-2 items-center m-2 p-2">
          {excludedHoldings && excludedHoldings.length > 0 ? (
            <div className="text-sm">
              <strong>Excluded holdings ({excludedHoldings.length}):</strong>{" "}
              {excludedHoldings.join(", ")}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              All holdings included
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
