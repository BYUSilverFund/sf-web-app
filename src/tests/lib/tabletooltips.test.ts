import { describe, it, expect } from "vitest";
import { getHeaderTooltips } from "@/lib/tabletooltips";

describe("getHeaderTooltips", () => {
  describe("non-annualized mode (annualized = false)", () => {
    const tooltips = getHeaderTooltips(false, [
      "Value",
      "Total Return",
      "Volatility",
      "Sharpe Ratio",
      "Tracking Error",
      "Information Ratio",
    ] as const);

    it("returns Value tooltip", () => {
      expect(tooltips["Value"]).toContain("Market value");
    });

    it("returns Total Return tooltip", () => {
      expect(tooltips["Total Return"]).toContain("Cumulative return");
    });

    it("returns non-annualized Volatility tooltip", () => {
      expect(tooltips["Volatility"]).toContain(
        "Volatility = standard deviation",
      );
    });

    it("returns non-annualized Sharpe Ratio tooltip", () => {
      expect(tooltips["Sharpe Ratio"]).toContain(
        "Volatility over the selected period",
      );
    });

    it("returns non-annualized Tracking Error tooltip", () => {
      expect(tooltips["Tracking Error"]).toContain("Tracking Error");
    });

    it("returns non-annualized Information Ratio tooltip", () => {
      expect(tooltips["Information Ratio"]).toContain("Information Ratio");
    });
  });

  describe("annualized mode (annualized = true)", () => {
    const tooltips = getHeaderTooltips(true, [
      "Value",
      "Total Return",
      "Volatility",
      "Sharpe Ratio",
      "Tracking Error",
      "Information Ratio",
    ] as const);

    it("returns Value tooltip (same as non-annualized)", () => {
      expect(tooltips["Value"]).toContain("Market value");
    });

    it("returns annualized Volatility tooltip", () => {
      expect(tooltips["Volatility"]).toContain("Annualized volatility");
      expect(tooltips["Volatility"]).toContain("√252");
    });

    it("returns annualized Sharpe Ratio tooltip", () => {
      expect(tooltips["Sharpe Ratio"]).toContain("Annualized Sharpe Ratio");
    });

    it("returns annualized Tracking Error tooltip", () => {
      expect(tooltips["Tracking Error"]).toContain("Annualized Tracking Error");
      expect(tooltips["Tracking Error"]).toContain("√252");
    });

    it("returns annualized Information Ratio tooltip", () => {
      expect(tooltips["Information Ratio"]).toContain(
        "Annualized Information Ratio",
      );
    });
  });

  describe("common tooltips", () => {
    const tooltips = getHeaderTooltips(false, [
      "Dividends",
      "Dividend Yield",
      "Alpha",
      "Beta",
      "Ticker",
      "Shares",
      "Price",
    ] as const);

    it("returns Dividends tooltip", () => {
      expect(tooltips["Dividends"]).toContain("Total cash distributions");
    });

    it("returns Dividend Yield tooltip", () => {
      expect(tooltips["Dividend Yield"]).toContain("Dividend Yield");
    });

    it("returns Alpha tooltip", () => {
      expect(tooltips["Alpha"]).toBeDefined();
    });

    it("returns Beta tooltip", () => {
      expect(tooltips["Beta"]).toBeDefined();
    });

    it("returns Ticker tooltip", () => {
      expect(tooltips["Ticker"]).toContain("ticker symbol");
    });

    it("returns Shares tooltip", () => {
      expect(tooltips["Shares"]).toContain("Number of shares");
    });

    it("returns Price tooltip", () => {
      expect(tooltips["Price"]).toContain("Price per share");
    });
  });

  describe("portfolio-specific columns", () => {
    const tooltips = getHeaderTooltips(false, [
      "Weight",
      "Per Share",
      "Total",
      "Active",
      "Date",
      "Type",
    ] as const);

    it("returns Weight tooltip", () => {
      expect(tooltips["Weight"]).toContain("Portfolio weight");
    });

    it("returns Per Share tooltip", () => {
      expect(tooltips["Per Share"]).toContain(
        "Dividends received per individual share",
      );
    });

    it("returns Total tooltip", () => {
      expect(tooltips["Total"]).toContain("Total dividends");
    });

    it("returns Active tooltip", () => {
      expect(tooltips["Active"]).toContain("currently active");
    });

    it("returns Date tooltip", () => {
      expect(tooltips["Date"]).toContain("date the trade was executed");
    });

    it("returns Type tooltip", () => {
      expect(tooltips["Type"]).toContain("Buy or Sell");
    });
  });

  describe("returns filtered results based on requested columns", () => {
    it("returns only requested columns", () => {
      const tooltips = getHeaderTooltips(false, ["Ticker", "Value"] as const);
      expect(Object.keys(tooltips)).toHaveLength(2);
      expect(tooltips["Ticker"]).toBeDefined();
      expect(tooltips["Value"]).toBeDefined();
    });

    it("maintains correct type for empty column list", () => {
      const tooltips = getHeaderTooltips(false, [] as const);
      expect(Object.keys(tooltips)).toHaveLength(0);
    });

    it("handles single column request", () => {
      const tooltips = getHeaderTooltips(false, ["Volatility"] as const);
      expect(Object.keys(tooltips)).toHaveLength(1);
      expect(tooltips["Volatility"]).toBeDefined();
    });
  });

  describe("returns correct type structure", () => {
    it("returns Record type with string keys", () => {
      const tooltips = getHeaderTooltips(false, ["Value", "Ticker"] as const);
      expect(typeof tooltips).toBe("object");
      expect(tooltips).not.toBeNull();
    });

    it("all values are ReactNode or undefined", () => {
      const tooltips = getHeaderTooltips(false, [
        "Value",
        "Ticker",
        "Alpha",
        "Beta",
      ] as const);

      Object.values(tooltips).forEach((value) => {
        expect(
          typeof value === "string" ||
            typeof value === "undefined" ||
            typeof value === "object",
        ).toBe(true);
      });
    });
  });
});
