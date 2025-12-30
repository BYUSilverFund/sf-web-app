"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/variables";
import { FactorsDataTable } from "@/components/FactorsDataTable";
import { FactorsBarChart } from "@/components/FactorsBarChart";
import { useParams, useSearchParams } from "next/navigation";
import { FundSelector, ViewSelector } from "@/components/ChartControls";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { formatFactors } from "@/components/FactorsDataTable";
import { formatPortfolio } from "@/lib/utils";

export default function FactorDetailPage() {
  const params = useParams() as { fund: string; factor: string };
  const searchParams = useSearchParams();
  const initialShowTop =
    parseInt(searchParams.get("show_top") || "10", 10) || 10;
  const [showTop, setShowTop] = useState<number>(initialShowTop);
  const viewValue = searchParams.get("view") || "table";
  const [view, setView] = useState<string>(viewValue ?? "table");
  const fund = params.fund as string;
  const factor = params.factor as string;
  const router = useRouter();
  const [detailData, setDetailData] = useState<[]>([]);

  useEffect(() => {
    fetch(
      `${API_BASE_URL}factor-exposures/${fund}/${encodeURIComponent(factor)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const src =
          data?.positions ?? data?.holdings ?? data?.exposures ?? data;
        let arr: any[] = [];
        if (Array.isArray(src)) {
          arr = src.map((item: any) => ({
            factor: item.name ?? item.holding ?? String(item[0] ?? ""),
            exposure: Number(item.exposure ?? item.value ?? item[1] ?? 0),
          }));
        } else if (src && typeof src === "object") {
          arr = Object.entries(src).map(([k, v]) => ({
            factor: String(k),
            exposure: Number(v),
          }));
        }
        arr = arr.sort((a, b) => Math.abs(b.exposure) - Math.abs(a.exposure));
        setDetailData(arr);
      })
      .catch((err) => console.error("Failed fetching factor details:", err));
  }, [fund, factor]);

  function updateURLForFund(fundVal: string) {
    router.push(`/factor-exposures/${fundVal}`);
  }

  function updateURLForView(viewVal: string) {
    setView(viewVal);
    router.push(
      `/factor-exposures/${fund}/${encodeURIComponent(factor)}?view=${viewVal}&show_top=${showTop}`,
    );
  }

  function updateURLForShowTop(v: number) {
    setShowTop(v);
    router.push(
      `/factor-exposures/${fund}/${encodeURIComponent(factor)}?view=${view}&show_top=${v}`,
    );
  }

  function openHoldingPage(holding: string) {
    router.push(`/performance/${fund}/${encodeURIComponent(holding)}`);
  }

  const fundKeys = [
    "all_funds",
    "grad",
    "undergrad",
    "quant",
    "brigham_capital",
    "quant_paper",
  ];

  const pages = [
    { name: "All Funds", href: "/performance" },
    ...(fund !== "all_funds"
      ? [{ name: formatPortfolio(fund), href: `/performance/${fund}` }]
      : []),
    { name: "Factor Exposures", href: `/factor-exposures/${fund}` },
  ];

  return (
    <div className="lg:px-12 md:px-6 sm:px-0">
      <div className="space-y-4 sm:px-4 py-4">
        <div className="ml-5">
          <Breadcrumbs pages={pages} currentPage={`${formatFactors(factor)}`} />
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow sm:m-2 sm:flex space-y-2 sm:space-y-0 p-4 gap-2 items-center">
          <div className="sm:flex  items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <span>Fund</span>
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
              data={detailData}
              showTop={showTop}
              setShowTop={(v) => updateURLForShowTop(v)}
              onFactorClick={
                fund !== "all_funds" ? (s) => openHoldingPage(s) : undefined
              }
              contributionMode={true}
            />
          ) : (
            <FactorsBarChart
              chartData={detailData}
              showTop={showTop}
              setShowTop={(v) => updateURLForShowTop(v)}
              onFactorClick={
                fund !== "all_funds" ? (s) => openHoldingPage(s) : undefined
              }
              contributionMode={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
