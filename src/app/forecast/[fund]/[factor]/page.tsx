"use client";
import React, { useEffect, useState, Suspense } from "react";
import Tooltip from "@/components/Tooltip";
import { InfoIcon } from "lucide-react";
import { API_BASE_URL } from "@/lib/variables";
import { FactorsDataTable } from "@/components/FactorsDataTable";
import { FactorsBarChart } from "@/components/FactorsBarChart";
import { useParams, useSearchParams } from "next/navigation";
import { FundSelector } from "@/components/ChartControls";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { formatFactors } from "@/components/FactorsDataTable";

type DetailRow = { factor: string; exposure: number };
import { formatPortfolio } from "@/lib/utils";
import { fetchAuthSession } from "aws-amplify/auth";

export default function FactorDetailPage() {
  const params = useParams() as { fund: string; factor: string };
  const searchParams = useSearchParams();
  const initialShowTop =
    parseInt(searchParams.get("show_top") || "10", 10) || 10;
  const [showTop, setShowTop] = useState<number>(initialShowTop);
  const viewValue = searchParams.get("view") || "bar-chart";
  const [view, setView] = useState<string>(viewValue ?? "bar-chart");
  const fund = params.fund as string;
  const factor = params.factor as string;
  const router = useRouter();
  const [detailData, setDetailData] = useState<DetailRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        const response = await fetch(
          `${API_BASE_URL}factor-exposures/${fund}/${encodeURIComponent(factor)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        const src =
          data?.positions ?? data?.holdings ?? data?.exposures ?? data;
        let arr: DetailRow[] = [];
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
        setDetailData(arr);
      } catch (err) {
        console.error("Failed fetching factor details:", err);
      }
    };
    fetchData();
  }, [fund, factor]);

  function updateURLForFund(fundVal: string) {
    router.push(`/forecast/${fundVal}`);
  }

  function updateURLForView(viewVal: string) {
    setView(viewVal);
    router.push(
      `/forecast/${fund}/${encodeURIComponent(factor)}?view=${viewVal}&show_top=${showTop}`,
    );
  }

  function updateURLForShowTop(v: number) {
    setShowTop(v);
    router.push(
      `/forecast/${fund}/${encodeURIComponent(factor)}?view=${view}&show_top=${v}`,
    );
  }

  function openHoldingPage(holding: string) {
    router.push(
      `/forecast/${fund}?holding=${encodeURIComponent(
        holding,
      )}&view=${view}&show_top=${showTop}`,
    );
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
    { name: "Forecast", href: `/forecast/${fund}` },
  ];

  const factorLabel = formatFactors(factor ?? "");

  const viewHeader = (
    <div className="inline-flex items-center gap-2">
      <span className="text-lg text-foreground font-bold">{`${factorLabel} Factor Drivers: Top Holdings`}</span>
      <InfoIcon size={16} />
    </div>
  );

  const headerTooltipElement = (
    <Tooltip
      trigger={viewHeader}
      description={
        <div className="max-w-md text-sm leading-relaxed">
          <p>
            Shows each holding&apos;s percent contribution to the fund&apos;s
            total {factorLabel} exposure.
          </p>
        </div>
      }
    />
  );

  return (
    <div className="lg:px-12 md:px-6 sm:px-0">
      <div className="space-y-4 sm:px-4 py-4">
        <div className="ml-5">
          <Suspense fallback={null}>
            <Breadcrumbs
              pages={pages}
              currentPage={`${formatFactors(factor)}`}
            />
          </Suspense>
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
              headerTitle={<>{headerTooltipElement}</>}
              view={view}
              onViewChange={(v) => updateURLForView(v)}
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
              headerTitle={<>{headerTooltipElement}</>}
              view={view}
              onViewChange={(v) => updateURLForView(v)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
