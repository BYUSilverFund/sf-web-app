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



export function defaultEnd(): Date {
  const today = new Date()

  const may = 4; // May = month index 4 (0-based)

  let cohortEnd = new Date(today.getFullYear() + 1, may, 0); // last day of April next year

  // If today is before May, use last year's May as start
  if (today.getMonth() < may) {
    cohortEnd = new Date(today.getFullYear(), may, 0);
  }
  
  return cohortEnd
  
}

export function defaultStart(): Date {
  const today = new Date()

  const may = 4; // May = month index 4 (0-based)

  let cohortStart = new Date(today.getFullYear(), may, 1);

  if (today.getMonth() < may) {
    cohortStart = new Date(today.getFullYear() - 1, may, 1);
  }

  return cohortStart
}