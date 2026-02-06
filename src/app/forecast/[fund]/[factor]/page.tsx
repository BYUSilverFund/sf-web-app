"use client";
import React, { useState, Suspense } from "react";
import ForecastHeader from "@/components/forecast/ForecastHeader";
import ForecastView from "@/components/forecast/ForecastView";
import { useDetailData } from "@/components/forecast/hooks/useDetailData";
import { useRiskForecast } from "@/components/forecast/hooks/useRiskForecast";
import { RiskForecastTable } from "@/components/forecast/RiskForecastTable";
import { Card } from "@/components/ui/card";
import { useParams, useSearchParams } from "next/navigation";
import { FundSelector } from "@/components/ChartControls";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { formatFactors } from "@/components/forecast/FactorsDataTable";

import { formatPortfolio } from "@/lib/utils";

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

  const { detailData } = useDetailData(fund, factor, null);
  const { riskForecast } = useRiskForecast(fund);

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

  const fundLabel = formatPortfolio(fund);

  const headerTooltipElement = (
    <ForecastHeader
      title={`${factorLabel} Factor Drivers: Top Holdings`}
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
        <div className="sm:flex sm:items-start sm:gap-6">
          <div className="sm:flex-1 sm:mx-2">
            <Card className="p-0">
              <div className="sm:mx-2 p-1">
                {view === "table" ? (
                  <ForecastView
                    data={detailData ?? []}
                    showTop={showTop}
                    setShowTop={(v) => updateURLForShowTop(v)}
                    onFactorClick={
                      fund !== "all_funds"
                        ? (s) => openHoldingPage(s)
                        : undefined
                    }
                    contributionMode={true}
                    headerTitle={headerTooltipElement}
                    view={view}
                    onViewChange={(v) => updateURLForView(v)}
                  />
                ) : (
                  <ForecastView
                    data={detailData ?? []}
                    showTop={showTop}
                    setShowTop={(v) => updateURLForShowTop(v)}
                    onFactorClick={
                      fund !== "all_funds"
                        ? (s) => openHoldingPage(s)
                        : undefined
                    }
                    contributionMode={true}
                    headerTitle={headerTooltipElement}
                    view={view}
                    onViewChange={(v) => updateURLForView(v)}
                  />
                )}
              </div>
            </Card>
          </div>

          <div className="w-72">
            <RiskForecastTable forecast={riskForecast} fundName={fundLabel} />
          </div>
        </div>
      </div>
    </div>
  );
}
