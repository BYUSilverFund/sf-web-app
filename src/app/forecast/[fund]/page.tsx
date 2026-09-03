"use client";
import React, { useState, Suspense } from "react";
import ForecastHeader from "@/components/forecast/ForecastHeader";
import ForecastView from "@/components/forecast/ForecastView";
import { useExposures } from "@/components/forecast/hooks/useExposures";
import { useDetailData } from "@/components/forecast/hooks/useDetailData";
import { useRiskForecast } from "@/components/forecast/hooks/useRiskForecast";
import { useParams, useSearchParams } from "next/navigation";
import { FundSelector } from "@/components/ChartControls";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import Tooltip from "@/components/Tooltip";
import { InfoIcon } from "lucide-react";
import { formatPortfolio } from "@/lib/utils";
import { RiskForecastTable } from "@/components/forecast/RiskForecastTable";

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

  const viewValue = searchParams.get("view") || "bar-chart";
  const [view, setView] = useState<string>(viewValue ?? "bar-chart");
  const factorParam = searchParams.get("factor");
  const holdingParam = searchParams.get("holding");
  const fund = params.fund as string;
  const router = useRouter();

  const {
    exposures,
    excludedHoldings,
    loading: exposuresLoading,
  } = useExposures(fund);
  const { detailData, detailLabel } = useDetailData(
    fund,
    factorParam,
    holdingParam,
  );
  const { riskForecast } = useRiskForecast(fund, holdingParam || undefined);

  const fundKeys = [
    "all_funds",
    "grad",
    "undergrad",
    "quant",
    "brigham_capital",
    "quant_paper",
  ];

  function updateURLForFund(fundVal: string) {
    router.push(`/forecast/${fundVal}`);
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

  const headerTooltipElement = (
    <ForecastHeader
      fundLabel={fundLabel}
      holdingParam={holdingParam}
      isHoldingDetail={isHoldingDetail}
      side="right"
    />
  );

  const tooltipDescription = (
    <div className="max-w-xs text-sm">
      <p className="mb-1 font-semibold">Risk models coverage</p>
      <p>
        Our risk models contain US-based stocks. Some holdings may not have risk
        forecasts - they are excluded from calculations.
      </p>
    </div>
  );

  const makeTrigger = (label: React.ReactNode) => (
    <div className="flex items-center gap-2">
      {label}
      <InfoIcon size={16} />
    </div>
  );

  return (
    <div className="w-full px-3 py-1.5 sm:px-4 md:px-5 lg:px-6 xl:px-8">
      <div className="flex flex-col lg:min-h-[calc(100dvh-75px-1.5rem)] w-full justify-between gap-2.5 py-1">
        <div className="flex flex-col gap-2.5 flex-1">
          <div>
            <Suspense fallback={null}>
              <Breadcrumbs
                pages={pagesForBreadcrumbs}
                currentPage={breadcrumbTitle}
              />
            </Suspense>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow sm:flex space-y-2 sm:space-y-0 p-2.5 px-4 gap-2 items-center">
            <div className="sm:flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Fund</span>
                <FundSelector
                  fund={fund}
                  funds={fundKeys}
                  onValueChange={(v) => updateURLForFund(v)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 flex-1">
            <div className="flex-1 min-w-0 flex flex-col">
              <Card className="p-0 m-0 flex-1 flex flex-col">
                <div className="flex-1 flex flex-col">
                  {detailData ? (
                    <div className="flex-1 flex flex-col">
                      <ForecastView
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
                        headerTitle={headerTooltipElement}
                        view={view}
                        onViewChange={(v) => updateURLForView(v)}
                      />
                    </div>
                  ) : (
                    <>
                      {exposuresLoading ? (
                        <div className="p-6">
                          <div className="animate-pulse space-y-4">
                            <div className="h-6 w-1/3 bg-muted rounded" />
                            <div className="h-40 bg-muted rounded" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col">
                          <ForecastView
                            data={exposures}
                            showTop={showTop}
                            setShowTop={(v) => updateURLForShowTop(v)}
                            onFactorClick={(s) => openFactorView(s)}
                            contributionMode={isFactorDetail}
                            headerTitle={headerTooltipElement}
                            view={view}
                            onViewChange={(v) => updateURLForView(v)}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </div>

            <div className="w-full lg:w-72 shrink-0">
              <RiskForecastTable forecast={riskForecast} fundName={fundLabel} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center p-1">
          {excludedHoldings && excludedHoldings.length > 0 ? (
            <Tooltip
              trigger={makeTrigger(
                <>
                  <span className="text-xs">
                    <strong>
                      Excluded holdings ({excludedHoldings.length}):
                    </strong>{" "}
                    {excludedHoldings.join(", ")}
                  </span>
                </>,
              )}
              description={tooltipDescription}
              side="top"
            />
          ) : (
            <Tooltip
              trigger={makeTrigger(
                <span className="text-xs text-muted-foreground">
                  All holdings included
                </span>,
              )}
              description={tooltipDescription}
              side="top"
            />
          )}
        </div>
      </div>
    </div>
  );
}
