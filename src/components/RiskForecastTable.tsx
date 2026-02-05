"use client";

import { useState } from "react";

import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from "./ui/table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskForecast } from "@/lib/types";

type RiskForecastTableProps = {
  forecast: RiskForecast | undefined;
  fundName: string;
};

export function RiskForecastTable({
  forecast,
  fundName,
}: RiskForecastTableProps) {
  const [showHoldings, setShowHoldings] = useState(false);
  if (!forecast) return null;

  return (
    <Card className="rounded-xl border bg-card text-card-foreground shadow">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg text-left border-b pb-2">
          Risk Forecast
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left w-1/4">Fund</TableHead>
              <TableHead className="text-center w-1/4">Beta</TableHead>
              <TableHead className="text-center w-1/4">Volatility</TableHead>
              <TableHead className="text-center w-1/4">
                Tracking Error
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-left w-1/4">{fundName}</TableCell>
              <TableCell className="text-center w-1/4">
                {forecast.beta.toFixed(2)}
              </TableCell>
              <TableCell className="text-center w-1/4">
                {(forecast.volatility * 100).toFixed(2)}%
              </TableCell>
              <TableCell className="text-center w-1/4">
                {forecast.tracking_error.toFixed(2)}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {forecast.holdings && forecast.holdings.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Holdings risk forecast
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHoldings((prev) => !prev)}
              >
                {showHoldings ? "Hide holdings" : "Show holdings"}
              </Button>
            </div>
            {showHoldings && (
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Holding</TableHead>
                      <TableHead className="text-right">Weight</TableHead>
                      <TableHead className="text-right">Beta</TableHead>
                      <TableHead className="text-right">Volatility</TableHead>
                      <TableHead className="text-right">
                        Tracking Error
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forecast.holdings.map((h) => (
                      <TableRow key={h.ticker}>
                        <TableCell>{h.ticker}</TableCell>
                        <TableCell className="text-right">
                          {(h.fund_weight * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right">
                          {h.beta.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {(h.volatility * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right">
                          {(h.tracking_error * 100).toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
