"use client";

import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from "./ui/table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RiskForecast } from "@/lib/types";

type RiskForecastTableProps = {
  forecast: RiskForecast | undefined;
  fundName: string;
};

export function RiskForecastTable({
  forecast,
  fundName,
}: RiskForecastTableProps) {
  if (!forecast) return null;

  return (
    <Card className="rounded-xl border bg-card text-card-foreground shadow">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg text-center border-b pb-2">
          Risk Forecast
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left w-1/4">Fund</TableHead>
              <TableHead className="text-center w-1/4">Beta</TableHead>
              <TableHead className="text-center w-1/4">Variance</TableHead>
              <TableHead className="text-center w-1/4">Volatility</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-left w-1/4">{fundName}</TableCell>
              <TableCell className="text-center w-1/4">
                {forecast.beta.toFixed(2)}
              </TableCell>
              <TableCell className="text-center w-1/4">
                {(forecast.variance * 100).toFixed(2)}%
              </TableCell>
              <TableCell className="text-center w-1/4">
                {(forecast.volatility * 100).toFixed(2)}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
