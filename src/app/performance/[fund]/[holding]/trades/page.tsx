"use client";

import { AllTradesDataTable } from "@/components/AllTradesDataTable";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { ViewButton } from "@/components/ViewSelect";
import { getTrades } from "@/lib/api/holding";
import { TradesResponse, HoldingRequest } from "@/lib/types";
import { formatDate, formatPortfolio } from "@/lib/utils";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

export default function Page() {
  const [view, setView] = useState("max");
  const [start, setStart] = useState<Date>(new Date("2000-01-01"));
  const [end, setEnd] = useState<Date>(new Date());
  const [allTrades, setAllTrades] = useState<TradesResponse | undefined>();

  const params = useParams<{ fund: string; holding: string }>();

  // Fetch all trades for this holding
  useEffect(() => {
    if (start && end && params?.fund && params?.holding) {
      const holdingRequest: HoldingRequest = {
        fund: params.fund,
        ticker: params.holding,
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      };

      getTrades(holdingRequest).then(setAllTrades).catch(console.error);
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
  const filteredTrades = useMemo((): TradesResponse => {
    if (!allTrades) {
      return {
        fund: params.fund,
        ticker: params.holding,
        start: "2000-01-01",
        end: format(new Date(), "yyyy-MM-dd"),
        trades: [],
      };
    }
    return { ...allTrades };
  }, [allTrades, params.fund, params.holding]);

  // Render page
  return (
    <div className="lg:px-24 md:px-12 sm:px-6">
      <div className="space-y-4 p-4">
        <Breadcrumbs pages={pages} currentPage="All Trades" />

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
          {allTrades && <div>As of {formatDate(allTrades.end)}</div>}
        </Card>

        {/* Row 2: Trades Table */}
        <Card>
          <AllTradesDataTable trades={filteredTrades} />
        </Card>
      </div>
    </div>
  );
}
