import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { AllHoldingsDataTable } from "@/components/AllHoldingsDataTable";
import { AllPortfoliosDataTable } from "@/components/AllPortfoliosDataTable";
import { DividendsTable } from "@/components/DividendsTable";
import { TradesTable } from "@/components/TradesTable";
import {
  mockAllHoldingsRecords,
  mockAllPortfoliosRecords,
  mockDividends,
  mockTrades,
  mockPortfolioSummary,
} from "../fixtures/mockData";

// Mock next/navigation for all table components
vi.mock("next/navigation", () => ({
  useParams: () => ({ fund: "grad", holding: "AAPL" }),
  useRouter: () => ({ push: vi.fn() }),
}));

describe("AllHoldingsDataTable", () => {
  it("renders with mock holdings data", () => {
    const { getByText } = render(
      React.createElement(AllHoldingsDataTable, {
        data: mockAllHoldingsRecords,
        portfolioSummary: mockPortfolioSummary,
      }),
    );
    expect(getByText("AAPL")).toBeTruthy();
    expect(getByText("MSFT")).toBeTruthy();
  });

  it("renders table headers", () => {
    const { container } = render(
      React.createElement(AllHoldingsDataTable, {
        data: mockAllHoldingsRecords,
        portfolioSummary: mockPortfolioSummary,
      }),
    );
    const headers = container.querySelectorAll("th");
    expect(headers.length).toBeGreaterThan(0);
  });

  it("renders with empty data state", () => {
    const { container } = render(
      React.createElement(AllHoldingsDataTable, { data: [] }),
    );
    expect(container).toBeTruthy();
  });

  it("renders with undefined data", () => {
    const { container } = render(
      React.createElement(AllHoldingsDataTable, { data: undefined }),
    );
    expect(container).toBeTruthy();
  });
});

describe("AllPortfoliosDataTable", () => {
  it("renders with portfolios data", () => {
    const { getByText } = render(
      React.createElement(AllPortfoliosDataTable, {
        data: mockAllPortfoliosRecords,
      }),
    );
    expect(getByText("Grad")).toBeTruthy();
    expect(getByText("Undergrad")).toBeTruthy();
  });

  it("renders with empty data", () => {
    const { container } = render(
      React.createElement(AllPortfoliosDataTable, { data: [] }),
    );
    expect(container).toBeTruthy();
  });

  it("renders table structure correctly", () => {
    const { container } = render(
      React.createElement(AllPortfoliosDataTable, {
        data: mockAllPortfoliosRecords,
      }),
    );
    expect(container.querySelector("table")).toBeTruthy();
  });
});

describe("DividendsTable", () => {
  it("renders dividend records", () => {
    const { getByText } = render(
      React.createElement(DividendsTable, {
        dividends: {
          fund: "grad",
          ticker: "AAPL",
          start: "2024-01-01",
          end: "2024-03-31",
          dividends: mockDividends,
        },
      }),
    );
    expect(getByText("2024-03-15")).toBeTruthy();
  });

  it("shows empty state when no dividends", () => {
    const { getByText } = render(
      React.createElement(DividendsTable, {
        dividends: {
          fund: "grad",
          ticker: "AAPL",
          start: "2024-01-01",
          end: "2024-03-31",
          dividends: [],
        },
      }),
    );
    expect(getByText("None")).toBeTruthy();
  });

  it("renders with undefined dividends", () => {
    const { getByText } = render(
      React.createElement(DividendsTable, { dividends: undefined }),
    );
    expect(getByText("None")).toBeTruthy();
  });

  it('displays "View All" link', () => {
    const { getByText } = render(
      React.createElement(DividendsTable, {
        dividends: {
          fund: "grad",
          ticker: "AAPL",
          start: "2024-01-01",
          end: "2024-03-31",
          dividends: mockDividends,
        },
      }),
    );
    expect(getByText("View All")).toBeTruthy();
  });
});

describe("TradesTable", () => {
  it("renders trade records", () => {
    const { getByText } = render(
      React.createElement(TradesTable, {
        trades: {
          fund: "grad",
          ticker: "AAPL",
          start: "2023-01-01",
          end: "2024-03-31",
          trades: mockTrades,
        },
      }),
    );
    expect(getByText("Buy")).toBeTruthy();
    expect(getByText("Sell")).toBeTruthy();
  });

  it("shows empty state when no trades", () => {
    const { getByText } = render(
      React.createElement(TradesTable, {
        trades: {
          fund: "grad",
          ticker: "AAPL",
          start: "2023-01-01",
          end: "2024-03-31",
          trades: [],
        },
      }),
    );
    expect(getByText("None")).toBeTruthy();
  });

  it("renders with undefined trades", () => {
    const { getByText } = render(
      React.createElement(TradesTable, { trades: undefined }),
    );
    expect(getByText("None")).toBeTruthy();
  });
});
