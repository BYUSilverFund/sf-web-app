"use client";
import { AllHoldingsDataTable } from "@/components/AllHoldingsDataTable";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { getAllHoldingsSummary } from "@/lib/api/allHoldings";
import { AllHoldingsSummaryResponse, PortfolioRequest } from "@/lib/types";
import { formatDate, formatPortfolio, getDateFromView } from "@/lib/utils";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ActiveSwitch } from "@/components/ActiveSwitch";

export default function Page() {
  const [active, setActive] = useState(true);
  const [view, setView] = useState("cohort");
  const [start, setStart] = useState<Date | undefined>(
    getDateFromView(view)[0]
  );
  const [end, setEnd] = useState<Date | undefined>(getDateFromView(view)[1]);
  const [allHoldingsSummary, setAllHoldingsSummary] = useState<
    AllHoldingsSummaryResponse | undefined
  >();

  const params = useParams<{ fund: string }>();

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

  return (
    <div className="lg:px-24 md:px-12 sm:px-6">
      <div className="space-y-4 p-4">
        <Breadcrumbs pages={pages} currentPage="All Holdings" />
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
                />
                <div>As of {formatDate(allHoldingsSummary.end)}</div>
              </>
            )}
          </div>
          <ActiveSwitch active={active} setActive={setActive} />
        </Card>
        {/* Row 2 */}
        <Card>
          <AllHoldingsDataTable data={holdings} />
        </Card>
      </div>
    </div>
  );
}
