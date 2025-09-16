import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatPercent(value: number, fractionDigits: number = 2): string {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatFloat(value: number, fractionDigits: number = 2): string {
  return `${value.toFixed(fractionDigits)}`;
}

export function formatPortfolio(name: string): string | undefined {
  return {
    grad: 'Grad',
    undergrad: 'Undergrad',
    quant: 'Quant',
    brigham_capital: 'Brigham Capital'
  }[name]
}

export function formatDate(dateStr: string): string {
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1; // 0-based
  const day = parseInt(dayStr, 10);

  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(year, monthIndex, 1) // only use for month name
  );

  const getOrdinal = (n: number): string => {
    if (n % 10 === 1 && n % 100 !== 11) return `${n}st`;
    if (n % 10 === 2 && n % 100 !== 12) return `${n}nd`;
    if (n % 10 === 3 && n % 100 !== 13) return `${n}rd`;
    return `${n}th`;
  };

  return `${month} ${getOrdinal(day)}, ${year}`;
}


export function defaultStart(view: string): Date {
  return getDateFromView(view)[0];
}

export function defaultEnd(view: string): Date {
  return getDateFromView(view)[1];
}

export function getDateFromView(view: string): [Date, Date] {
  const today = new Date()

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const yesterdayLastYear = new Date();
  yesterdayLastYear.setFullYear(yesterday.getFullYear() - 1);
    switch (view) {
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

        return [cohortStart, cohortEnd];
      }

      case "max":
        return [new Date(2020, 1, 1), yesterday];

      case "1year":
        return [yesterdayLastYear, yesterday]

      case "1month": {
        const oneMonthAgo = new Date(yesterday);
        oneMonthAgo.setMonth(yesterday.getMonth() - 1);
        return [oneMonthAgo, yesterday]
      }

      case "3months": {
        const threeMonthsAgo = new Date(yesterday);
        threeMonthsAgo.setMonth(yesterday.getMonth() - 3);
        return [threeMonthsAgo, yesterday];
      }

      case "1week": {
        const oneWeekAgo = new Date(yesterday);
        oneWeekAgo.setDate(yesterday.getDate() - 7);
        return [oneWeekAgo, yesterday];
      }

      default:
        return [yesterdayLastYear, yesterday];
    }
  };