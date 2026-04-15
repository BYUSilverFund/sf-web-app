"use client";

import React from "react";
import { cn, formatPortfolio } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FundTabsBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  actions?: React.ReactNode;
}

const fundKeys = [
  "all_funds",
  "grad",
  "undergrad",
  "quant",
  "brigham_capital",
  "quant_paper",
] as const;

export function FundTabsBar({
  activeTab,
  onTabChange,
  actions,
}: FundTabsBarProps) {
  const resolvedActiveTab = fundKeys.includes(
    activeTab as (typeof fundKeys)[number],
  )
    ? activeTab
    : fundKeys[0];

  React.useEffect(() => {
    if (activeTab !== resolvedActiveTab) {
      onTabChange(resolvedActiveTab);
    }
  }, [activeTab, onTabChange, resolvedActiveTab]);

  return (
    // Mobile uses a compact select, while larger screens keep the tab-style fund buttons.
    <div className="mb-0 flex min-h-[65px] flex-wrap items-center gap-3 rounded border border-gray-300 bg-white p-3 shadow-sm">
      <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="sm:hidden">
          <Select value={resolvedActiveTab} onValueChange={onTabChange}>
            <SelectTrigger className="h-10 w-full border-gray-300 bg-white text-sm">
              <SelectValue placeholder="Select fund" />
            </SelectTrigger>
            <SelectContent>
              {fundKeys.map((fundKey) => (
                <SelectItem key={fundKey} value={fundKey}>
                  {formatPortfolio(fundKey) ?? fundKey}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="hidden flex-wrap gap-2 sm:flex">
          {fundKeys.map((fundKey) => (
            <Button
              key={fundKey}
              type="button"
              onClick={() => onTabChange(fundKey)}
              variant="ghost"
              size="default"
              className={cn(
                "px-[14px] py-2 text-sm transition-colors",
                resolvedActiveTab === fundKey
                  ? "bg-[#002E5D] text-white hover:bg-[#002E5D] hover:text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
              )}
            >
              {formatPortfolio(fundKey) ?? fundKey}
            </Button>
          ))}
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2 xl:shrink-0">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
