"use client";
import { useEffect, useState, useMemo, startTransition, Suspense } from "react";
import {
  AllHoldingsSummaryResponse,
  BenchmarkRequest,
  BenchmarkSummaryResponse,
  PortfolioRequest,
  PortfolioSummaryResponse,
  PortfolioTimeSeriesResponse,
} from "@/lib/types";
import { format } from "date-fns";
import * as React from "react";
import {
  getPortfolioSummary,
  getPortfolioTimeSeries,
} from "@/lib/api/portfolio";

import { useParams } from "next/navigation";
import { getBenchmarkSummary } from "@/lib/api/benchmark";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { PortfolioSummaryTable } from "@/components/PortfolioSummarytable";
import { ReturnsChart } from "@/components/ReturnsChart";
import { AllHoldingsSummaryTable } from "@/components/AllHoldingsSummaryTable";
import { getAllHoldingsSummary } from "@/lib/api/allHoldings";
import { formatDate, formatPortfolio, getDateFromView } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DashboardWrapper } from "@/components/DashboardWrapper";
import { downloadPortfolioCSV } from "@/lib/api/csvDownloads";
import { DownloadCSVButton } from "@/components/DownloadCSVButton";
import { FactorExposuresButton } from "@/components/forecast/FactorExposuresButton";

export default function Page() {
  const { fund } = useParams<{ fund: string }>();
  const [view, setView] = useState("cohort");
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [portfolioSummary, setPortfolioSummary] =
    useState<PortfolioSummaryResponse>();
  const [benchmarkSummary, setBenchmarkSummary] =
    useState<BenchmarkSummaryResponse>();
  const [portfolioTimeSeries, setPortfolioTimeSeries] =
    useState<PortfolioTimeSeriesResponse>();
  const [allHoldingsSummary, setAllHoldingsSummary] =
    useState<AllHoldingsSummaryResponse>();

  // Memoized dates based on view and fund
  const dates = useMemo(() => {
    if (!fund) return undefined;
    return getDateFromView(view, fund);
  }, [view, fund]);

  useEffect(() => {
    if (!dates) return;
    startTransition(() => {
      setStart(dates[0]);
      setEnd(dates[1]);
    });
  }, [dates]);

  useEffect(() => {
    if (start && end && fund) {
      const portfolioRequest: PortfolioRequest = {
        fund: fund,
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      getPortfolioSummary(portfolioRequest)
        .then((summary) => {
          setPortfolioSummary(summary);
          // Use the actual start and end dates from the portfolio summary response
          const benchmarkRequest: BenchmarkRequest = {
            start: summary.start,
            end: summary.end,
          };
          getBenchmarkSummary(benchmarkRequest)
            .then(setBenchmarkSummary)
            .catch(console.error);
        })
        .catch(console.error);
      getPortfolioTimeSeries(portfolioRequest)
        .then(setPortfolioTimeSeries)
        .catch(console.error);
      getAllHoldingsSummary(portfolioRequest)
        .then(setAllHoldingsSummary)
        .catch(console.error);
    }
  }, [start, end]);

  const pages = [
    {
      name: "All Funds",
      href: "/performance",
    },
  ];

  return (
    <div className="lg:px-24 md:px-12 sm:px-6">
      <div className="space-y-4 p-4">
        <DashboardWrapper>
          <Suspense fallback={null}>
            <Breadcrumbs pages={pages} currentPage={formatPortfolio(fund)} />
          </Suspense>
          {/* Row 1 */}
          <Card className="sm:flex space-y-2 sm:space-y-0 p-4 gap-2 items-center">
            <ViewButton
              start={start}
              end={end}
              setStart={setStart}
              setEnd={setEnd}
              view={view}
              setView={setView}
              fund={fund}
            />
            {portfolioSummary && (
              <div>As of {formatDate(portfolioSummary.end)}</div>
            )}
            <div className="ml-auto flex flex-wrap items-center gap-3">
              <FactorExposuresButton fund={fund} />
              <DownloadCSVButton
                start={start}
                end={end}
                filenamePrefix={`portfolio_${fund}`}
                onDownload={(req) =>
                  downloadPortfolioCSV({
                    ...req,
                    fund: fund,
                  })
                }
              />
            </div>
          </Card>
          {/* Row 2 */}
          <Card className="flex flex-col h-fit">
            <PortfolioSummaryTable
              portfolio={fund}
              portfolioSummary={portfolioSummary}
              benchmarkSummary={benchmarkSummary}
              view_1yr={view === "1year"}
            />
          </Card>
          {/* Row 3 */}
          <div className="md:flex md:space-y-0 space-y-4 min-h-0 gap-4 pb-5">
            <Card className="min-h-0 flex flex-col md:w-2/3">
              <ReturnsChart
                data={portfolioTimeSeries && portfolioTimeSeries["records"]}
                label={formatPortfolio(fund)}
              />
            </Card>
            <Card className="md:w-2/6 flex flex-col w-full overflow-y-auto">
              <AllHoldingsSummaryTable
                fund={fund}
                allHoldingsSummary={allHoldingsSummary}
              />
            </Card>
          </div>
        </DashboardWrapper>
      </div>
    </div>
  );
}
