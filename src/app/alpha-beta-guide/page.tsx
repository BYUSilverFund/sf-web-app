"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AlphaBetaGuidePage() {
  const router = useRouter();

  return (
    <div className="lg:px-24 md:px-12 sm:px-6 py-8">
      <div className="flex justify-center">
        <Card className="w-full max-w-4xl bg-card">
          <CardHeader className="pb-4 pt-3">
            {/* Back button in top-left */}
            <div className="flex justify-start">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                ← Back
              </Button>
            </div>

            {/* Title, subtitle, divider */}
            <div className="mt-2 flex flex-col items-center">
              <CardTitle className="text-2xl text-center">
                Alpha &amp; Beta Calculation
              </CardTitle>
              <div className="mt-3 flex justify-center">
                <div className="h-px w-24 bg-muted-foreground/50" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pt-4">
            <section className="space-y-2">
              <Label className="text-base font-semibold">Beta</Label>

              {/* Equation block */}
              <div className="py-2 px-4">
                <p className="text-xs font-bold text-center text-foreground">
                  {
                    "Beta = slope of the line relating fund returns to benchmark returns over the period"
                  }
                </p>
              </div>

              <p className="text-sm leading-relaxed">
                {
                  "Beta is calculated as the slope from an OLS regression of the fund's daily returns on the benchmark's daily returns, using all days in the selected date range."
                }
              </p>
            </section>

            <section className="space-y-2">
              <Label className="text-base font-semibold">Realized Alpha</Label>

              {/* Equation block */}
              <div className="py-2 px-4">
                <p className="text-xs font-bold text-center text-foreground">
                  {
                    "Alpha (realized) = (total return - risk-free total return) − beta × (total benchmark return - risk-free total return)"
                  }
                </p>
              </div>

              <p className="text-sm leading-relaxed">
                {
                  "To calculate realized alpha we take the fund's total return over the selected date range, subtract the risk-free total return, then subtract beta times the benchmark's total return over the period minus the risk-free total return."
                }
              </p>
            </section>

            <section className="space-y-2">
              <Label className="text-base font-semibold">
                Annualized Alpha
              </Label>

              {/* Equation block */}
              <div className="py-2 px-4">
                <p className="text-xs font-bold text-center text-foreground">
                  {
                    "Alpha (annualized) = (annualized total return − annualized risk-free total return) − beta × (annualized benchmark total return − annualized risk-free total return)"
                  }
                </p>
              </div>

              <p className="text-sm leading-relaxed">
                {
                  "To calculate annualized alpha we take the fund's annualized total return over the selected date range, subtract the annualized risk-free total return, then subtract beta times the benchmark's annualized total return over the period minus the annualized risk-free total return (we assume 252 trading days per year when annualizing)."
                }
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
