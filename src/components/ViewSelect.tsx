"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDateFromView } from "@/lib/utils";

type ViewButtonProps = {
  start: Date | undefined;
  end: Date | undefined;
  setStart: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEnd: React.Dispatch<React.SetStateAction<Date | undefined>>;
  view: string;
  setView: React.Dispatch<React.SetStateAction<string>>;
  fund?: string;
};

export function ViewButton({
  start,
  end,
  setStart,
  setEnd,
  view,
  setView,
  fund,
}: ViewButtonProps) {
  const handleView = (view: string) => {
    setView(view);
    const dates = getDateFromView(view, fund);
    setStart(dates[0]);
    setEnd(dates[1]);
  };

  const viewOptions = [
    {
      name: "Cohort",
      value: "cohort",
    },
    {
      name: "1 Week",
      value: "1week",
    },
    {
      name: "1 Month",
      value: "1month",
    },
    {
      name: "3 Months",
      value: "3months",
    },
    {
      name: "1 Year",
      value: "1year",
    },
    {
      name: "Max",
      value: "max",
    },
    {
      name: "Custom",
      value: "custom",
    },
  ];

  return (
    <div className="flex gap-4">
      <Select defaultValue={view} onValueChange={handleView}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {viewOptions.map((option, index) => (
              <SelectItem key={index} value={option.value}>
                {option.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {view == "custom" && (
        <>
          <DateButton date={start} setDate={setStart} />
          <DateButton date={end} setDate={setEnd} />
        </>
      )}
    </div>
  );
}

function DateButton({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="bg-redd-500 w-auto overflow-hidden p-0"
          align="start"
        >
          <Calendar
            mode="single"
            defaultMonth={date}
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (date) {
                setDate(date);
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
