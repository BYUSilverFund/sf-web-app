"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/variables";
import { FactorsDataTable } from "@/components/FactorsDataTable";
import { FactorsBarChart } from "@/components/FactorsBarChart";
import { useParams, useSearchParams } from "next/navigation";
import { FundSelector } from "@/components/ChartControls";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { formatPortfolio } from "@/lib/utils";
import { formatFactors } from "@/components/FactorsDataTable";
import { fetchAuthSession } from "aws-amplify/auth";
import {
  getFundRiskForecast,
  getAllFundsRiskForecast,
} from "@/lib/api/riskForecast";
import { RiskForecastTable } from "@/components/RiskForecastTable";
import { RiskForecast } from "@/lib/types";

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
  const [detailData, setDetailData] = useState<FactorData[] | null>(null);
  const [detailLabel, setDetailLabel] = useState<string | null>(null);
  const viewValue = searchParams.get("view") || "bar-chart";
  const [view, setView] = useState<string>(viewValue ?? "bar-chart");
  const [excludedHoldings, setExcludedHoldings] = useState<string[]>([]);
  const fund = params.fund as string;
  const router = useRouter();

  const factorParam = searchParams.get("factor");
  const holdingParam = searchParams.get("holding");

  //risk forecast state
  const [riskForecast, setRiskForecast] = useState<RiskForecast | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        const response = await fetch(
          `${API_BASE_URL}factor-exposures/${fund}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
        setExposures(exposureData);
        setExcludedHoldings(data?.positions_not_in_exposures ?? []);
      } catch (err) {
        console.error("Failed fetching exposures:", err);
      }
    };
    fetchData();
  }, [fund]);

  useEffect(() => {
    const fetchFactorData = async () => {
      // if a factor query param is present, fetch holdings contributing to that factor
      if (factorParam) {
        const f = factorParam;
        try {
          const session = await fetchAuthSession();
          const token = session.tokens?.accessToken?.toString();
          const response = await fetch(
            `${API_BASE_URL}factor-exposures/${fund}/${encodeURIComponent(f)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
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
                return {
                  factor: String(name ?? ""),
                  exposure: Number(val ?? 0),
                };
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
          setDetailLabel(f);
        } catch (err) {
          console.error("Failed fetching factor details:", err);
        }
        return;
      }

      // if a holding query param is present, fetch factor exposures for that holding
      if (holdingParam) {
        const h = holdingParam;
        try {
          const session = await fetchAuthSession();
          const token = session.tokens?.accessToken?.toString();
          const response = await fetch(
            `${API_BASE_URL}factor-exposures/holdings/${encodeURIComponent(h)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
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
                return {
                  factor: String(name ?? ""),
                  exposure: Number(val ?? 0),
                };
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
          setDetailData(arr);
          setDetailLabel(h);
        } catch (err) {
          console.error("Failed fetching holding factors:", err);
        }
        return;
      }

      // otherwise clear detail view
      setDetailData(null);
      setDetailLabel(null);
    };
    fetchFactorData();
  }, [factorParam, holdingParam, fund]);

  // fetch risk forecast
  useEffect(() => {
    async function fetchRiskForecast() {
      try {
        const data =
          fund === "all_funds"
            ? await getAllFundsRiskForecast()
            : await getFundRiskForecast(fund);
        setRiskForecast(data);
      } catch (error) {
        console.error("Failed fetching risk forecast:", error);
        setRiskForecast(undefined);
      }
    }

    fetchRiskForecast();
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
    router.push(`/forecast/${fundVal}?view=${view}&show_top=${showTop}`);
  }

  function updateURLForView(viewVal: string) {
    setView(viewVal);
    // preserve factor or holding params when switching view
    const f = factorParam ? `&factor=${encodeURIComponent(factorParam)}` : "";
    const h = holdingParam
      ? `&holding=${encodeURIComponent(holdingParam)}`
      : "";
    router.push(
      `/forecast/${fund}?view=${viewVal}&show_top=${showTop}${f}${h}`,
    );
  }

  function updateURLForShowTop(v: number) {
    setShowTop(v);
    // preserve factor or holding params when changing top
    const f = factorParam ? `&factor=${encodeURIComponent(factorParam)}` : "";
    const h = holdingParam
      ? `&holding=${encodeURIComponent(holdingParam)}`
      : "";
    router.push(`/forecast/${fund}?view=${view}&show_top=${v}${f}${h}`);
  }

  function openFactorView(factor: string) {
    router.push(
      `/forecast/${fund}/${encodeURIComponent(factor)}?view=${view}&show_top=${showTop}`,
    );
  }

  function openHoldingPage(holding: string) {
    // Navigate to forecast view for the holding (show factor exposures for a holding)
    router.push(
      `/forecast/${fund}?holding=${encodeURIComponent(
        holding,
      )}&view=${view}&show_top=${showTop}`,
    );
  }

  const pages = [
    { name: "All Funds", href: "/performance" },
    ...(fund !== "all_funds"
      ? [{ name: formatPortfolio(fund), href: `/performance/${fund}` }]
      : []),
  ];
  const isFactorDetail = Boolean(factorParam);
  const isHoldingDetail = Boolean(holdingParam);

  const pagesForBreadcrumbs =
    isFactorDetail || isHoldingDetail
      ? [...pages, { name: "Forecast", href: `/forecast/${fund}` }]
      : pages;
  const breadcrumbTitle = isFactorDetail
    ? `${detailLabel}`
    : isHoldingDetail
      ? `${detailLabel}`
      : "Forecast";

  const fundLabel = fund === "all_funds" ? "All Funds" : formatPortfolio(fund);
  let viewHeader = `Factor Exposures for ${fundLabel}`;
  if (isFactorDetail) {
    const factorLabel = formatFactors(detailLabel ?? factorParam ?? "");
    if (fund !== "all_funds") {
      viewHeader = `Holding Contributions to ${factorLabel} in ${fundLabel}`;
    } else {
      viewHeader = `Factor Exposures for ${factorLabel}`;
    }
  } else if (isHoldingDetail) {
    viewHeader = `Factor Exposures for ${detailLabel ?? holdingParam}`;
  }

  return (
    <div className="lg:px-12 md:px-6 sm:px-0">
      <div className="space-y-4 sm:px-4 py-4">
        <div className="ml-5">
          <Breadcrumbs
            pages={pagesForBreadcrumbs}
            currentPage={breadcrumbTitle}
          />
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
          {detailData ? (
            <div>
              {view === "table" ? (
                <FactorsDataTable
                  data={detailData}
                  showTop={showTop}
                  setShowTop={(v) => updateURLForShowTop(v)}
                  onFactorClick={
                    isFactorDetail
                      ? fund !== "all_funds"
                        ? (s) => openHoldingPage(s)
                        : undefined
                      : (s) => openFactorView(s)
                  }
                  contributionMode={isFactorDetail}
                  headerTitle={viewHeader}
                  view={view}
                  onViewChange={(v) => updateURLForView(v)}
                />
              ) : (
                <FactorsBarChart
                  chartData={detailData}
                  showTop={showTop}
                  setShowTop={(v) => updateURLForShowTop(v)}
                  onFactorClick={
                    isFactorDetail
                      ? fund !== "all_funds"
                        ? (s) => openHoldingPage(s)
                        : undefined
                      : (s) => openFactorView(s)
                  }
                  contributionMode={isFactorDetail}
                  headerTitle={viewHeader}
                  view={view}
                  onViewChange={(v) => updateURLForView(v)}
                />
              )}
            </div>
          ) : (
            <>
              {view === "table" ? (
                <FactorsDataTable
                  data={exposures}
                  showTop={showTop}
                  setShowTop={(v) => updateURLForShowTop(v)}
                  onFactorClick={(s) => openFactorView(s)}
                  headerTitle={viewHeader}
                  view={view}
                  onViewChange={(v) => updateURLForView(v)}
                />
              ) : (
                <FactorsBarChart
                  chartData={exposures}
                  showTop={showTop}
                  setShowTop={(v) => updateURLForShowTop(v)}
                  onFactorClick={(s) => openFactorView(s)}
                  headerTitle={viewHeader}
                  view={view}
                  onViewChange={(v) => updateURLForView(v)}
                />
              )}
            </>
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
        <div className="sm:px6 py-4 mb-10 space-y-4">
          <RiskForecastTable
            forecast={riskForecast}
            fundName={
              (fund === "all_funds" ? "All Funds" : formatPortfolio(fund)) ??
              "All Funds"
            }
          />
        </div>
      </div>
    </div>
  );
}
