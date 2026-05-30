"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MathFormula } from "@/components/MathFormula";
import { UndergradBetaChart } from "@/components/BetaChart";

export default function AlphaBetaGuidePage() {
  const router = useRouter();

  return (
    <div className="lg:px-24 md:px-12 sm:px-6 py-8">
      <div className="flex justify-center">
        <Card className="w-full max-w-4xl">
          <CardHeader className="pb-4 pt-3">
            <div>
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                ← Back
              </Button>
            </div>

            <div className="mt-2 flex flex-col items-center">
              <CardTitle className="text-2xl text-center">
                Alpha & Beta Calculation
              </CardTitle>

              <div className="mt-3 flex justify-center">
                <div className="h-px w-24 bg-muted-foreground/50" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pt-4">
            {/* Beta */}
            <section className="space-y-2">
              <h4 className="text-base font-semibold">Beta</h4>

              <div className="py-2 px-4">
                <MathFormula
                  className="text-xs font-bold text-center text-foreground block"
                  formula="(R_p - R_f) = \alpha + \beta (R_b - R_f) + \varepsilon_t"
                />
              </div>

              <UndergradBetaChart />

              <p className="text-sm leading-relaxed">
                Beta is estimated as the slope from an OLS regression of the
                fund&apos;s daily excess returns on the benchmark&apos;s daily
                excess returns, using all trading days in the selected date
                range. Excess returns are calculated as the portfolio or
                benchmark return minus the daily risk-free return.
              </p>
            </section>

            {/* Daily Alpha */}
            <section className="space-y-2">
              <h4 className="text-base font-semibold">Daily Alpha</h4>

              <div className="py-2 px-4">
                <MathFormula
                  className="text-xs font-bold text-center text-foreground block"
                  formula="R_p - R_f = \alpha + \beta (R_b - R_f) + \varepsilon_t"
                />
              </div>

              <p className="text-sm leading-relaxed">
                Daily alpha is estimated as the intercept from an OLS regression
                of the fund&apos;s daily excess returns against the
                benchmark&apos;s daily excess returns over the selected date
                range.
              </p>
            </section>

            {/* Annualized Alpha */}
            <section className="space-y-2">
              <h4 className="text-base font-semibold">Annualized Alpha</h4>

              <div className="py-2 px-4">
                <MathFormula
                  className="text-xs font-bold text-center text-foreground block"
                  formula="\alpha_{\text{annualized}} = \alpha_{\text{daily}} \times 252"
                />
              </div>

              <p className="text-sm leading-relaxed">
                Annualized alpha is calculated by taking the daily regression
                intercept (alpha) and multiplying it by 252 trading days. This
                represents the portfolio&apos;s estimated excess return relative
                to the benchmark after adjusting for market exposure (beta).
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
