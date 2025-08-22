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

export function formatPortfolio(name: string): string | undefined{
  return {
    grad: 'Grad',
    undergrad: 'Undergrad',
    quant: 'Quant',
    brigham_capital: 'Brigham Capital'
  }[name]
}