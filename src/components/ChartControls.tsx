"use client";
import { formatPortfolio } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FundSelector({
  fund,
  funds,
  onValueChange,
}: {
  fund: string;
  funds?: string[];
  onValueChange: (v: string) => void;
}) {
  const fundKeys = [
    "all_funds",
    "grad",
    "undergrad",
    "quant",
    "brigham_capital",
    "quant_paper",
  ];

  return (
    <Select defaultValue={fund} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] gap-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {funds
            ? funds.map((f) => (
                <SelectItem key={f} value={f}>
                  {formatPortfolio(f) ?? f}
                </SelectItem>
              ))
            : fundKeys.map((key) => (
                <SelectItem key={key} value={key}>
                  {formatPortfolio(key) ?? key}
                </SelectItem>
              ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function TopNSelector({
  topN,
  onValueChange,
}: {
  topN: string;
  onValueChange: (v: string) => void;
}) {
  return (
    <Select defaultValue={topN} onValueChange={onValueChange}>
      <SelectTrigger className="w-full gap-1">
        Show top
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default function ChartControls() {
  return null;
}
