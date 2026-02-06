"use client";

import React from "react";
import { FactorsDataTable } from "@/components/forecast/FactorsDataTable";
import { FactorsBarChart } from "@/components/forecast/FactorsBarChart";
import { FactorData } from "./hooks/useExposures";

type Props = {
  data: FactorData[];
  detailMode?: boolean;
  showTop: number;
  setShowTop: (v: number) => void;
  onFactorClick?: (s: string) => void;
  contributionMode?: boolean;
  headerTitle?: React.ReactNode;
  view: string;
  onViewChange: (v: string) => void;
};

export default function ForecastView({
  data,
  showTop,
  setShowTop,
  onFactorClick,
  contributionMode,
  headerTitle,
  view,
  onViewChange,
}: Props) {
  return view === "table" ? (
    <FactorsDataTable
      data={data}
      showTop={showTop}
      setShowTop={setShowTop}
      onFactorClick={onFactorClick}
      contributionMode={Boolean(contributionMode)}
      headerTitle={
        <div className="inline-flex items-center gap-2">{headerTitle}</div>
      }
      view={view}
      onViewChange={onViewChange}
    />
  ) : (
    <FactorsBarChart
      chartData={data}
      showTop={showTop}
      setShowTop={setShowTop}
      onFactorClick={onFactorClick}
      contributionMode={Boolean(contributionMode)}
      headerTitle={
        <div className="inline-flex items-center gap-2">{headerTitle}</div>
      }
      view={view}
      onViewChange={onViewChange}
    />
  );
}
