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

type ViewButtonProps = {
  start: Date;
  end: Date;
  setStart: React.Dispatch<React.SetStateAction<Date>>;
  setEnd: React.Dispatch<React.SetStateAction<Date>>;
};

export function ViewButton({ start, end, setStart, setEnd }: ViewButtonProps) {
  const [view, setView] = useState("1year");

  const today = new Date()

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const yesterdayLastYear = new Date();
  yesterdayLastYear.setFullYear(yesterday.getFullYear() - 1);

  const handleView = (value: string) => {


    setView(value);

    switch (value) {
      case "cohort": {
        // Determine cohort period (May -> May)
        const may = 4; // May = month index 4 (0-based)

        let cohortStart = new Date(today.getFullYear(), may, 1);
        let cohortEnd = new Date(today.getFullYear() + 1, may, 0); // last day of April next year

        // If today is before May, use last year's May as start
        if (today.getMonth() < may) {
          cohortStart = new Date(today.getFullYear() - 1, may, 1);
          cohortEnd = new Date(today.getFullYear(), may, 0);
        }

        setStart(cohortStart);
        setEnd(cohortEnd);
        break;
      }

      case "max":
        setStart(new Date(2020, 1, 1))
        setEnd(yesterday)
        break;

      case "1year":
        setStart(yesterdayLastYear);
        setEnd(yesterday);
        break;

      case "1month": {
        const oneMonthAgo = new Date(yesterday);
        oneMonthAgo.setMonth(yesterday.getMonth() - 1);
        setStart(oneMonthAgo);
        setEnd(yesterday);
        break;
      }

      case "3months": {
        const threeMonthsAgo = new Date(yesterday);
        threeMonthsAgo.setMonth(yesterday.getMonth() - 3);
        setStart(threeMonthsAgo);
        setEnd(yesterday);
        break;
      }

      case "1week": {
        const oneWeekAgo = new Date(yesterday);
        oneWeekAgo.setDate(yesterday.getDate() - 7);
        setStart(oneWeekAgo);
        setEnd(yesterday);
        break;
      }

      default:
        break;
    }
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
      value: 'max'
    },
    {
      name: "Custom",
      value: "custom",
    },
  ];

  return (
    <div className="flex gap-4">
      <Select defaultValue="1year" onValueChange={handleView}>
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
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
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
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
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
