"use client";

import {
  getAvailableTickers,
  getCovarianceMatrix,
  getFundTickers,
} from "@/lib/api/covarianceMatrix";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Authenticator from "@/components/Authenticator";

export default function Page() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [tickers, setTickers] = useState<string[]>([]);
  const [availableTickers, setAvailableTickers] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("Custom");

  const funds = [
    { name: "Graduate", value: "grad" },
    { name: "Undergraduate", value: "undergrad" },
    { name: "Brigham Capital", value: "brigham_capital" },
    { name: "Quant", value: "quant" },
  ];

  const presetOptions = [{ name: "Custom", value: "Custom" }, ...funds];

  useEffect(() => {
    getAvailableTickers()
      .then((response) => setAvailableTickers(response.tickers))
      .catch(console.error);
  }, []);

  const handleTickerToggle = (ticker: string) => {
    setTickers((prev) =>
      prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker],
    );
  };

  const removeTicker = (ticker: string) => {
    setTickers((prev) => prev.filter((t) => t !== ticker));
  };

  const handlePresetChange = async (value: string) => {
    setSelectedPreset(value);
    if (value === "Custom") {
      setTickers([]);
    } else {
      try {
        const fundTickers = await getFundTickers({ fund: value });
        setTickers(fundTickers.tickers);
      } catch (error) {
        console.error("Failed to fetch fund tickers:", error);
        alert("Failed to load fund tickers. Please try again.");
      }
    }
  };

  const downloadCovarianceMatrix = async () => {
    setIsDownloading(true);
    try {
      const tickerList = { tickers: tickers };
      const blob = await getCovarianceMatrix(tickerList);

      // This is super hacky but it works. -- Andrew Hall
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "latest.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Authenticator>
      <div className="flex flex-col px-24 py-4 min-h-[80vh]">
        <div className="text-lg font-semibold">
          Covariance Matrix Downloader
        </div>
        <Card className="flex flex-col gap-4 p-4 w-full">
          <div>
            <label className="text-sm font-medium">Select Preset</label>
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Choose a preset" />
              </SelectTrigger>
              <SelectContent>
                {presetOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Select Tickers</label>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpen}
                  className="justify-between w-fit"
                >
                  {tickers.length === 0
                    ? "Select tickers..."
                    : `${tickers.length} ticker${tickers.length === 1 ? "" : "s"} selected`}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search tickers..." />
                  <CommandList>
                    <CommandEmpty>Loading...</CommandEmpty>
                    <CommandGroup>
                      {availableTickers.map((ticker) => (
                        <CommandItem
                          key={ticker}
                          value={ticker}
                          onSelect={() => handleTickerToggle(ticker)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              tickers.includes(ticker)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {ticker}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {tickers.length > 0 && (
            <div>
              <label className="text-sm font-medium">Selected Tickers</label>
              <div className="flex flex-wrap gap-2">
                {tickers.map((ticker) => (
                  <div
                    key={ticker}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                  >
                    <span>{ticker}</span>
                    <button
                      onClick={() => removeTicker(ticker)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={downloadCovarianceMatrix}
            disabled={isDownloading || tickers.length === 0}
            className="w-fit"
          >
            {isDownloading ? "Downloading..." : "Download Covariance Matrix"}
          </Button>
        </Card>
      </div>
    </Authenticator>
  );
}
