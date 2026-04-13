"use client";
import { AllPortfoliosDataTable } from "@/components/AllPortfoliosDataTable";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { getAllPortfoliosSummary } from "@/lib/api/allPortfolios";
import { AllPortfoliosSummaryResponse, FundRequest } from "@/lib/types";
import { defaultEnd, defaultStart, formatDate } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState, Suspense } from "react";
import { downloadAllPortfoliosCSV } from "@/lib/api/csvDownloads";
import { DownloadCSVButton } from "@/components/DownloadCSVButton";
import {
  PerformancePageShell,
  PerformanceTitleRow,
} from "@/components/PerformancePageLayout";

export default function Page() {
  const [view, setView] = useState("cohort");
  const [start, setStart] = useState<Date | undefined>(defaultStart(view));
  const [end, setEnd] = useState<Date | undefined>(defaultEnd(view));
  const [allPortfoliosSummary, setAllPortfoliosSummary] =
    useState<AllPortfoliosSummaryResponse>();

  useEffect(() => {
    if (start && end) {
      const fundRequest: FundRequest = {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      getAllPortfoliosSummary(fundRequest)
        .then(setAllPortfoliosSummary)
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
    <PerformancePageShell>
      <Suspense fallback={null}>
        <Breadcrumbs pages={pages} currentPage="All Portfolios" />
      </Suspense>
      {/* This page now shares the same shell and title treatment as the rest of performance. */}
      <PerformanceTitleRow
        title="All Portfolios"
        subtitle={
          allPortfoliosSummary
            ? `as of ${formatDate(allPortfoliosSummary.end)}`
            : undefined
        }
      />
      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <ViewButton
          start={start}
          end={end}
          setStart={setStart}
          setEnd={setEnd}
          view={view}
          setView={setView}
        />
        <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
          <DownloadCSVButton
            start={start}
            end={end}
            filenamePrefix="all_portfolios"
            onDownload={downloadAllPortfoliosCSV}
          />
        </div>
      </Card>
      <Card>
        <AllPortfoliosDataTable data={allPortfoliosSummary?.portfolios} />
      </Card>
    </PerformancePageShell>
  );
}
