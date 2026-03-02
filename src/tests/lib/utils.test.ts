import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatPercent,
  formatFloat,
  formatPortfolio,
  formatDate,
  getDateFromView,
  defaultStart,
  defaultEnd,
  cn,
} from "@/lib/utils";

describe("Utility Functions", () => {
  describe("formatCurrency", () => {
    it("formats a number as USD currency", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });

    it("formats large numbers with commas", () => {
      expect(formatCurrency(1000000)).toBe("$1,000,000.00");
    });

    it("handles zero", () => {
      expect(formatCurrency(0)).toBe("$0.00");
    });

    it("formats negative numbers", () => {
      expect(formatCurrency(-500.25)).toBe("-$500.25");
    });

    it("formats decimals correctly", () => {
      expect(formatCurrency(99.9)).toBe("$99.90");
    });
  });

  describe("formatPercent", () => {
    it("formats a decimal as percentage with 2 decimal places by default", () => {
      expect(formatPercent(0.1234)).toBe("0.12%");
    });

    it("formats with custom fraction digits", () => {
      expect(formatPercent(0.1234, 3)).toBe("0.123%");
    });

    it("formats with 0 fraction digits", () => {
      expect(formatPercent(0.1234, 0)).toBe("0%");
    });

    it("handles large percentages", () => {
      expect(formatPercent(1.5)).toBe("1.50%");
    });

    it("handles zero", () => {
      expect(formatPercent(0)).toBe("0.00%");
    });

    it("handles negative percentages", () => {
      expect(formatPercent(-0.05)).toBe("-0.05%");
    });
  });

  describe("formatFloat", () => {
    it("formats a number with 2 decimal places by default", () => {
      expect(formatFloat(3.14159)).toBe("3.14");
    });

    it("formats with custom fraction digits", () => {
      expect(formatFloat(3.14159, 3)).toBe("3.142");
    });

    it("formats with 0 fraction digits", () => {
      expect(formatFloat(3.14159, 0)).toBe("3");
    });

    it("handles zero", () => {
      expect(formatFloat(0)).toBe("0.00");
    });

    it("handles negative numbers", () => {
      expect(formatFloat(-2.567)).toBe("-2.57");
    });
  });

  describe("formatPortfolio", () => {
    it("formats all_funds", () => {
      expect(formatPortfolio("all_funds")).toBe("All Funds");
    });

    it("formats grad", () => {
      expect(formatPortfolio("grad")).toBe("Grad");
    });

    it("formats undergrad", () => {
      expect(formatPortfolio("undergrad")).toBe("Undergrad");
    });

    it("formats quant", () => {
      expect(formatPortfolio("quant")).toBe("Quant");
    });

    it("formats brigham_capital", () => {
      expect(formatPortfolio("brigham_capital")).toBe("Brigham Capital");
    });

    it("formats quant_paper", () => {
      expect(formatPortfolio("quant_paper")).toBe("Quant Paper");
    });

    it("returns undefined for unknown portfolio", () => {
      expect(formatPortfolio("unknown")).toBeUndefined();
    });

    it("returns undefined for empty string", () => {
      expect(formatPortfolio("")).toBeUndefined();
    });
  });

  describe("formatDate", () => {
    it("formats a date string correctly", () => {
      expect(formatDate("2024-01-15")).toBe("January 15th, 2024");
    });

    it('handles first day of month with "st" ordinal', () => {
      expect(formatDate("2024-03-01")).toBe("March 1st, 2024");
    });

    it('handles second day with "nd" ordinal', () => {
      expect(formatDate("2024-03-02")).toBe("March 2nd, 2024");
    });

    it('handles third day with "rd" ordinal', () => {
      expect(formatDate("2024-03-03")).toBe("March 3rd, 2024");
    });

    it('handles eleventh with "th" ordinal (exception)', () => {
      expect(formatDate("2024-03-11")).toBe("March 11th, 2024");
    });

    it('handles twelfth with "th" ordinal (exception)', () => {
      expect(formatDate("2024-03-12")).toBe("March 12th, 2024");
    });

    it('handles thirteenth with "th" ordinal (exception)', () => {
      expect(formatDate("2024-03-13")).toBe("March 13th, 2024");
    });

    it("handles 21st day correctly", () => {
      expect(formatDate("2024-03-21")).toBe("March 21st, 2024");
    });

    it("handles 22nd day correctly", () => {
      expect(formatDate("2024-03-22")).toBe("March 22nd, 2024");
    });

    it("handles 30th day correctly", () => {
      expect(formatDate("2024-03-30")).toBe("March 30th, 2024");
    });
  });

  describe("getDateFromView", () => {
    it('returns "max" view with fund start to yesterday', () => {
      const [start, end] = getDateFromView("max", "grad");
      expect(start.getFullYear()).toBe(2023);
      expect(start.getMonth()).toBe(10); // November
      expect(start.getDate()).toBe(10);
    });

    it('returns "1year" view with yesterday last year to yesterday', () => {
      const [start, end] = getDateFromView("1year");
      expect(start).toBeTruthy();
      expect(end).toBeTruthy();
      expect(end.getTime()).toBeGreaterThan(start.getTime());
      // Approximately 1 year apart (365 days)
      const dayDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      expect(dayDiff).toBeGreaterThanOrEqual(364);
      expect(dayDiff).toBeLessThanOrEqual(366);
    });

    it('returns "3months" view', () => {
      const [start, end] = getDateFromView("3months");
      expect(end.getTime()).toBeGreaterThan(start.getTime());
      // Verify roughly 3 months apart
      const monthDiff =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      expect(monthDiff).toBeLessThanOrEqual(4);
      expect(monthDiff).toBeGreaterThanOrEqual(2);
    });

    it('returns "1month" view', () => {
      const [start, end] = getDateFromView("1month");
      expect(end.getTime()).toBeGreaterThan(start.getTime());
    });

    it('returns "1week" view', () => {
      const [start, end] = getDateFromView("1week");
      const dayDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      expect(dayDiff).toBeLessThanOrEqual(8);
      expect(dayDiff).toBeGreaterThanOrEqual(6);
    });

    it("handles different fund start dates", () => {
      const undergradStart = getDateFromView("max", "undergrad")[0];
      const gradStart = getDateFromView("max", "grad")[0];
      expect(undergradStart.getTime()).toBeLessThan(gradStart.getTime());
    });

    it("uses default undergrad start date when fund is empty", () => {
      const [startDefault] = getDateFromView("max", "");
      const [startUndergrad] = getDateFromView("max", "undergrad");
      expect(startDefault.toDateString()).toBe(startUndergrad.toDateString());
    });

    it("returns default (1year) for unknown view", () => {
      const [start, end] = getDateFromView("unknown");
      expect(start).toBeTruthy();
      expect(end).toBeTruthy();
    });
  });

  describe("defaultStart", () => {
    it("returns the start date for a given view", () => {
      const start = defaultStart("1year");
      expect(start instanceof Date).toBe(true);
    });

    it("returns same as getDateFromView[0]", () => {
      const view = "1month";
      const start = defaultStart(view);
      const [expectedStart] = getDateFromView(view);
      expect(start.toDateString()).toBe(expectedStart.toDateString());
    });
  });

  describe("defaultEnd", () => {
    it("returns the end date for a given view", () => {
      const end = defaultEnd("1year");
      expect(end instanceof Date).toBe(true);
    });

    it("returns same as getDateFromView[1]", () => {
      const view = "1month";
      const end = defaultEnd(view);
      const [, expectedEnd] = getDateFromView(view);
      expect(end.toDateString()).toBe(expectedEnd.toDateString());
    });
  });

  describe("cn (className utility)", () => {
    it("merges Tailwind classes", () => {
      const result = cn("px-2 py-1", "p-4");
      expect(result).toContain("p-4");
    });

    it("handles undefined and null values", () => {
      const result = cn("px-2", undefined, null, "py-1");
      expect(result).toContain("px-2");
      expect(result).toContain("py-1");
    });

    it("handles conditional classes", () => {
      const isActive = true;
      const result = cn("base", isActive && "active");
      expect(result).toContain("active");
    });
  });
});
