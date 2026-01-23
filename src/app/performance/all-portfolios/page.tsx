"use client";
import { AllPortfoliosDataTable } from "@/components/AllPortfoliosDataTable";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { getAllPortfoliosSummary } from "@/lib/api/allPortfolios";
import { AllPortfoliosSummaryResponse, FundRequest } from "@/lib/types";
import { defaultEnd, defaultStart, formatDate } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { downloadAllPortfoliosCSV } from "@/lib/api/csvDownloads";
import { DownloadCSVButton } from "@/components/DownloadCSVButton";

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
    <div className="lg:px-24 md:px-12 sm:px-6">
      <div className="space-y-4 p-4">
        <Breadcrumbs pages={pages} currentPage="All Portfolios" />
        {/* Row 1 */}
        <Card className="sm:flex space-y-2 sm:space-y-0 p-4 gap-2 items-center">
          <ViewButton
            start={start}
            end={end}
            setStart={setStart}
            setEnd={setEnd}
            view={view}
            setView={setView}
          />
          {allPortfoliosSummary && (
            <div>As of {formatDate(allPortfoliosSummary.end)}</div>
          )}
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <DownloadCSVButton
              start={start}
              end={end}
              filenamePrefix="all_portfolios"
              onDownload={downloadAllPortfoliosCSV}
            />
          </div>
        </Card>
        {/* Row 2 */}
        <Card>
          <AllPortfoliosDataTable data={allPortfoliosSummary?.portfolios} />
        </Card>
      </div>
    </div>
  );
}
