"use client";
import { PortfolioSummaryResponse } from "@/lib/types";
import { AllHoldingsDataTable } from "@/components/AllHoldingsDataTable";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { getAllHoldingsSummary } from "@/lib/api/allHoldings";
import { AllHoldingsSummaryResponse, PortfolioRequest } from "@/lib/types";
import { formatDate, formatPortfolio, getDateFromView } from "@/lib/utils";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import { ActiveSwitch } from "@/components/ActiveSwitch";
import { getPortfolioSummary } from "@/lib/api/portfolio";
import { downloadAllHoldingsCSV } from "@/lib/api/csvDownloads";
import { DownloadCSVButton } from "@/components/DownloadCSVButton";

export default function Page() {
  const params = useParams<{ fund: string }>();
  const [active, setActive] = useState(true);
  const [view, setView] = useState("cohort");
  const [start, setStart] = useState<Date | undefined>(
    getDateFromView(view, params.fund)[0],
  );
  const [portfolioSummary, setPortfolioSummary] =
    useState<PortfolioSummaryResponse>();
  const [allHoldingsSummary, setAllHoldingsSummary] = useState<
    AllHoldingsSummaryResponse | undefined
  >();
  const [end, setEnd] = useState<Date | undefined>(
    getDateFromView(view, params.fund)[1],
  );

  useEffect(() => {
    if (start && end) {
      const portfolioRequest: PortfolioRequest = {
        fund: params.fund,
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      getAllHoldingsSummary(portfolioRequest)
        .then(setAllHoldingsSummary)
        .catch(console.error);
    }
  }, [start, end, params.fund]);

  const pages = [
    {
      name: "All Funds",
      href: "/performance",
    },
    {
      name: formatPortfolio(params.fund),
      href: `/performance/${params.fund}`,
    },
  ];

  const holdings = useMemo(() => {
    // This useMemo hook was authored by Claude. I'm too lazy to check it. -- Andrew
    if (!allHoldingsSummary?.holdings) return [];
    if (active) {
      return allHoldingsSummary.holdings.filter((holding) => holding.active);
    }
    return allHoldingsSummary.holdings;
  }, [allHoldingsSummary?.holdings, active]);

  useEffect(() => {
    if (start && end) {
      const portfolioRequest: PortfolioRequest = {
        fund: params.fund,
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      getPortfolioSummary(portfolioRequest).then((data) => {
        setPortfolioSummary(data);
      });
    }
  }, []);

  return (
    <div className="lg:px-24 md:px-12 sm:px-6">
      <div className="space-y-4 p-4">
        <Suspense fallback={null}>
          <Breadcrumbs pages={pages} currentPage="All Holdings" />
        </Suspense>
        {/* Row 1 */}
        <Card className="flex p-4 justify-between">
          <div className="sm:flex space-y-2 sm:space-y-0 p-4 gap-2 items-center">
            {allHoldingsSummary && (
              <>
                <ViewButton
                  start={start}
                  end={end}
                  setStart={setStart}
                  setEnd={setEnd}
                  view={view}
                  setView={setView}
                  fund={params.fund}
                />
                <div>As of {formatDate(allHoldingsSummary.end)}</div>
              </>
            )}
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <ActiveSwitch active={active} setActive={setActive} />
            <DownloadCSVButton
              key={`all-holdings-csv-${params.fund}-${start}-${end}`}
              start={start}
              end={end}
              filenamePrefix={`all_holdings_${params.fund}`}
              onDownload={(req) =>
                downloadAllHoldingsCSV({
                  ...req,
                  fund: params.fund,
                })
              }
            />
          </div>
        </Card>
        {/* Row 2 */}
        <Card>
          <AllHoldingsDataTable
            data={holdings}
            portfolioSummary={portfolioSummary}
          />
        </Card>
      </div>
    </div>
  );
}
