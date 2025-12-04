"use client";

import { AllDividendsDataTable } from "@/components/AllDividendsDataTable";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { getDividends } from "@/lib/api/holding";
import { DividendsResponse, HoldingRequest } from "@/lib/types";
import { formatDate, formatPortfolio } from "@/lib/utils";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

export default function Page() {
  const [view, setView] = useState("max");
  const [start, setStart] = useState<Date | undefined>(new Date("2000-01-01"));
  const [end, setEnd] = useState<Date | undefined>(new Date());
  const [allDividends, setAllDividends] = useState<DividendsResponse | undefined>();

  const params = useParams<{ fund: string; holding: string }>();

  // Fetch all dividends for this holding
  useEffect(() => {
    if (start && end && params?.fund && params?.holding) {
      const holdingRequest: HoldingRequest = {
        fund: params.fund,
        ticker: params.holding,
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      getDividends(holdingRequest).then(setAllDividends).catch(console.error);
    }
  }, [start, end, params.fund, params.holding]);

  // Breadcrumb navigation
  // All Funds > [fund] > [ticker] > [All Trades]
  const pages = [
    { name: "All Funds", href: "/performance" },
    { name: formatPortfolio(params.fund), href: `/performance/${params.fund}` },
    {
      name: params.holding.toUpperCase(),
      href: `/performance/${params.fund}/${params.holding}`,
    },
  ];

  // Memoized trade list
  const filteredDividends = useMemo((): DividendsResponse => {
    if (!allDividends) {
      return {
        fund: params.fund,
        ticker: params.holding,
        start: "2000-01-01",
        end: format(new Date(), "yyyy-MM-dd"),
        dividends: [],
      };
    }
    return { ...allDividends };
  }, [allDividends, params.fund, params.holding]);

  // Render page
  return (
    <div className="lg:px-24 md:px-12 sm:px-6">
      <div className="space-y-4 p-4">
        <Breadcrumbs pages={pages} currentPage="All Dividends" />

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
          {allDividends && <div>As of {formatDate(allDividends.end)}</div>}
        </Card>

        {/* Row 2: Dividends Table */}
        <Card>
          <AllDividendsDataTable dividends={filteredDividends} />
        </Card>
      </div>
    </div>
  );
}
