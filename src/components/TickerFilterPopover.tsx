"use client";

import * as React from "react";
import { ChevronDown, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TickerFilterPopoverProps {
  /** List of all available tickers */
  tickers: string[];
  /** Currently selected tickers */
  selectedTickers: string[];
  /** Callback fired when selection changes */
  onSelectionChange: (selected: string[]) => void;
  /** Optional mapping of ticker -> count of items */
  counts?: Record<string, number>;
  /** Label for the trigger button when none selected */
  placeholder?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  className?: string;
}

export function TickerFilterPopover({
  tickers,
  selectedTickers,
  onSelectionChange,
  counts,
  placeholder = "Filter Tickers",
  searchPlaceholder = "Search tickers...",
  className,
}: TickerFilterPopoverProps) {
  const [search, setSearch] = React.useState<string>("");

  const filteredTickers = React.useMemo(() => {
    if (!search.trim()) return tickers;
    const query = search.trim().toUpperCase();
    return tickers.filter((t) => t.toUpperCase().includes(query));
  }, [tickers, search]);

  const toggleTicker = (ticker: string) => {
    if (selectedTickers.includes(ticker)) {
      onSelectionChange(selectedTickers.filter((t) => t !== ticker));
    } else {
      onSelectionChange([...selectedTickers, ticker]);
    }
  };

  const selectAllFiltered = () => {
    const set = new Set([...selectedTickers, ...filteredTickers]);
    onSelectionChange(Array.from(set));
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  if (tickers.length === 0) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`h-8 px-2.5 text-xs bg-white border border-gray-300 font-medium flex items-center gap-1.5 ${
              selectedTickers.length > 0
                ? "border-blue-700 text-blue-900 bg-blue-50 font-semibold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>
              {selectedTickers.length === 0
                ? placeholder
                : `Tickers (${selectedTickers.length})`}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-64 p-2 bg-white shadow-lg border border-gray-200 rounded-md"
        >
          <div className="space-y-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs bg-white border-gray-300"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between px-1 text-[11px] text-gray-500 border-b border-gray-100 pb-1.5">
              <button
                type="button"
                onClick={selectAllFiltered}
                className="text-blue-900 hover:underline font-medium"
              >
                Select All{" "}
                {filteredTickers.length > 0 && `(${filteredTickers.length})`}
              </button>
              {selectedTickers.length > 0 && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-red-600 hover:underline font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Scrollable Checkbox List */}
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {filteredTickers.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-500">
                  No tickers found
                </div>
              ) : (
                filteredTickers.map((ticker) => {
                  const isChecked = selectedTickers.includes(ticker);
                  const count = counts ? counts[ticker] : undefined;
                  return (
                    <label
                      key={ticker}
                      className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 cursor-pointer text-xs select-none"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleTicker(ticker)}
                          className="h-3.5 w-3.5"
                        />
                        <span className="font-medium text-gray-900">
                          {ticker}
                        </span>
                      </div>
                      {count !== undefined && (
                        <span className="text-[11px] text-gray-400">
                          {count}
                        </span>
                      )}
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Reset Tickers badge */}
      {selectedTickers.length > 0 && (
        <button
          type="button"
          onClick={clearSelection}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-200 hover:bg-gray-300 rounded font-medium transition-colors"
          title="Clear ticker filter"
        >
          <span>Reset Tickers</span>
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
