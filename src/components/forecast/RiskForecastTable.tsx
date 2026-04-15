"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RiskForecast } from "@/lib/types";
import Tooltip from "@/components/Tooltip";
import { InfoIcon } from "lucide-react";
import { getRiskForecastTooltips } from "@/lib/tabletooltips";

type RiskForecastTableProps = {
  forecast: RiskForecast | undefined;
  fundName?: string;
};

function MetricCard({
  title,
  value,
  loading,
  tooltip,
}: {
  title: string;
  value?: string;
  loading?: boolean;
  tooltip?: string;
}) {
  return (
    <div className="w-full">
      <Card className="rounded-md border bg-card text-card-foreground shadow p-4">
        <div className="flex items-center justify-between">
          {tooltip ? (
            <Tooltip
              side="left"
              trigger={
                <>
                  <span className="text-sm text-muted-foreground">{title}</span>
                  <InfoIcon size={12} className="text-muted-foreground" />
                </>
              }
              description={tooltip}
            />
          ) : (
            <div className="text-sm text-muted-foreground">{title}</div>
          )}
        </div>

        <div className="mt-3 text-3xl font-semibold text-left">
          {loading ? (
            <div className="h-7 w-28 bg-muted animate-pulse rounded" />
          ) : (
            (value ?? "-")
          )}
        </div>
      </Card>
    </div>
  );
}

function getTitle(forecast?: RiskForecast, fundName?: string) {
  if (forecast?.ticker) return `${forecast.ticker} Risk Forecast`;
  if (fundName) return `${fundName} Risk Forecast`;
  return "Risk Forecast";
}

function getPortfolioWeightOrTrackingError(
  forecast?: RiskForecast,
): string | undefined {
  if (!forecast) return undefined;
  if (forecast.ticker) {
    if (forecast.fund_weight == null) return "-";
    return `${(forecast.fund_weight * 100).toFixed(2)}%`;
  }
  return `${(forecast.tracking_error * 100).toFixed(2)}%`;
}

export function RiskForecastTable({
  forecast,
  fundName,
}: RiskForecastTableProps) {
  const loading = !forecast;
  const tooltips = getRiskForecastTooltips();

  return (
    <Card className="bg-gray border-none shadow-none text-card-foreground">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg text-left border-b pb-2">
          {getTitle(forecast, fundName)}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3">
          <MetricCard
            title="Beta"
            loading={loading}
            value={forecast ? forecast.beta.toFixed(2) : undefined}
            tooltip={tooltips["Beta"]}
          />
          <MetricCard
            title="Volatility"
            loading={loading}
            value={
              forecast
                ? `${(forecast.volatility * 100).toFixed(2)}%`
                : undefined
            }
            tooltip={tooltips["Volatility"]}
          />
          <MetricCard
            title={forecast?.ticker ? "Portfolio Weight" : "Tracking Error"}
            loading={loading}
            value={getPortfolioWeightOrTrackingError(forecast)}
            tooltip={
              forecast?.ticker
                ? tooltips["Portfolio Weight"]
                : tooltips["Tracking Error"]
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
