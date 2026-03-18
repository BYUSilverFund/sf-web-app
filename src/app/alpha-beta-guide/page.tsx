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
                excess returns, using all days in the selected date range. The
                chart above uses the fund&apos;s data from the last year to
                illustrate this relationship.
              </p>
            </section>

            {/* Realized Alpha */}
            <section className="space-y-2">
              <h4 className="text-base font-semibold">Realized Alpha</h4>
              <div className="py-2 px-4">
                <MathFormula
                  className="text-xs font-bold text-center text-foreground block"
                  formula="\alpha_{\text{realized}} = (R_p - R_f) - \beta (R_b - R_f)"
                />
              </div>
              <p className="text-sm leading-relaxed">
                To calculate realized alpha we take the fund&apos;s total return
                over the selected date range, subtract the risk-free total
                return, then subtract beta times the benchmark&apos;s total
                return over the period minus the risk-free total return.
              </p>
            </section>

            {/* Annualized Alpha */}
            <section className="space-y-2">
              <h4 className="text-base font-semibold">Annualized Alpha</h4>
              <div className="py-2 px-4">
                <MathFormula
                  className="text-xs font-bold text-center text-foreground block"
                  formula="\alpha_{\text{annualized}} = (R_{p,a} - R_{f,a}) - \beta (R_{b,a} - R_{f,a})"
                />
              </div>
              <p className="text-sm leading-relaxed">
                To calculate annualized alpha we take the fund&apos;s annualized
                total return over the selected date range, subtract the
                annualized risk-free total return, then subtract beta times the
                benchmark&apos;s annualized total return over the period minus
                the annualized risk-free total return (we assume 252 trading
                days per year when annualizing).
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
