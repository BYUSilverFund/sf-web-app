import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { AllTradesDataTable } from "@/components/AllTradesDataTable";
import type { TradesResponse } from "@/lib/types";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useParams: () => ({ fund: "undergrad", holding: "IWV" }),
  useRouter: () => ({ push: vi.fn() }),
}));

const mockTradesData: TradesResponse = {
  fund: "undergrad",
  ticker: "IWV",
  start: "2024-01-01",
  end: "2024-12-31",
  trades: [
    {
      date: "2024-02-20",
      type: "Buy",
      shares: 50,
      price: 145.3,
      value: 7265,
      ticker: "IWV",
      alpha: 0.05,
      current_price: 150.0,
    },
    {
      date: "2023-10-05",
      type: "Sell",
      shares: 25,
      price: 142.1,
      value: 3552.5,
      ticker: "IWV",
      alpha: -0.02,
      current_price: 150.0,
    },
    {
      date: "2023-05-12",
      type: "Buy",
      shares: 100,
      price: 130.0,
      value: 13000,
      ticker: "IWV",
      alpha: null,
      current_price: null,
    },
  ],
};

describe("AllTradesDataTable", () => {
  it("renders without crashing when valid trades data is provided", () => {
    const { getByText, getAllByText } = render(
      <AllTradesDataTable trades={mockTradesData} />,
    );

    expect(getByText("2024-02-20")).toBeTruthy();
    expect(getByText("2023-10-05")).toBeTruthy();
    expect(getAllByText("Buy").length).toBeGreaterThan(0);
    expect(getByText("Sell")).toBeTruthy();
  });

  it("renders fallback dash ('—') from formatPercent and formatCurrency without crashing when data is invalid", () => {
    const invalidTrades: TradesResponse = {
      fund: "undergrad",
      ticker: "IWV",
      start: "2024-01-01",
      end: "2024-12-31",
      trades: [
        {
          date: "2024-01-01",
          type: "Buy",
          shares: 10,
          price: null as unknown as number,
          value: undefined as unknown as number,
          current_price: NaN,
        },
        {
          date: "2024-01-02",
          type: "Sell",
          shares: 5,
          price: "not-a-number" as unknown as number,
          value: null as unknown as number,
          current_price: undefined as unknown as number,
        },
      ],
    };

    const { getAllByText, container } = render(
      <AllTradesDataTable trades={invalidTrades} />,
    );

    expect(container).toBeTruthy();
    const dashes = getAllByText("—");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("renders dashes ('—') for Current Price, Current Value, Return, and Alpha when current_price is null", () => {
    const tradeWithNullCurrentPrice: TradesResponse = {
      fund: "undergrad",
      ticker: "IWV",
      start: "2024-01-01",
      end: "2024-12-31",
      trades: [
        {
          date: "2024-01-01",
          type: "Buy",
          shares: 10,
          price: 100,
          value: 1000,
          current_price: null,
        },
      ],
    };

    const { getAllByText } = render(
      <AllTradesDataTable trades={tradeWithNullCurrentPrice} />,
    );

    // Current Price, Current Value, Return, and Alpha should all render '—'
    const dashes = getAllByText("—");
    expect(dashes.length).toBe(4);
  });

  it("renders empty state without crashing when trades array is empty", () => {
    const emptyTrades: TradesResponse = {
      fund: "undergrad",
      ticker: "IWV",
      start: "2024-01-01",
      end: "2024-12-31",
      trades: [],
    };

    const { getByText } = render(<AllTradesDataTable trades={emptyTrades} />);
    expect(getByText("No trades found")).toBeTruthy();
  });

  it("renders empty state without crashing when trades prop is undefined", () => {
    const { getByText } = render(<AllTradesDataTable trades={undefined} />);
    expect(getByText("No trades found")).toBeTruthy();
  });

  it("toggles the 'Only Sells' filter without errors", () => {
    const { getByText, queryByText } = render(
      <AllTradesDataTable trades={mockTradesData} />,
    );

    const sellsBtn = getByText("Sells Only");
    const allTradesBtn = getByText("All Trades");
    expect(sellsBtn).toBeTruthy();
    expect(allTradesBtn).toBeTruthy();

    // Click to filter only sells
    fireEvent.click(sellsBtn);

    expect(getByText("2023-10-05")).toBeTruthy(); // Sell trade
    expect(queryByText("2024-02-20")).toBeNull(); // Buy trade should be hidden

    // Click All Trades to clear filter
    fireEvent.click(allTradesBtn);
    expect(getByText("2024-02-20")).toBeTruthy();
  });

  it("changes rows per page without crashing", () => {
    const { getByRole } = render(
      <AllTradesDataTable trades={mockTradesData} />,
    );

    const select = getByRole("combobox");
    fireEvent.change(select, { target: { value: "25" } });
    expect((select as HTMLSelectElement).value).toBe("25");
  });

  it("allows column sorting without client-side errors", () => {
    const { container } = render(
      <AllTradesDataTable trades={mockTradesData} />,
    );

    const buttons = container.querySelectorAll("th button");
    expect(buttons.length).toBeGreaterThan(0);

    // Click sort button on the first header (Date)
    fireEvent.click(buttons[0]);
    expect(container).toBeTruthy();
  });

  it("renders table loading skeleton when loading is true", () => {
    const { container, queryByText } = render(
      <AllTradesDataTable trades={undefined} loading={true} />,
    );

    // Should NOT show "No trades found" when loading is true
    expect(queryByText("No trades found")).toBeNull();

    // Should render animate-pulse skeleton rows and elements
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("filters trades by ticker when selected in the ticker filter popover", () => {
    const multiTickerTrades: TradesResponse = {
      fund: "undergrad",
      start: "2024-01-01",
      end: "2024-12-31",
      trades: [
        {
          date: "2024-02-20",
          type: "Buy",
          shares: 50,
          price: 145.3,
          value: 7265,
          ticker: "AAPL",
          alpha: 0.05,
          current_price: 150.0,
        },
        {
          date: "2023-10-05",
          type: "Sell",
          shares: 25,
          price: 142.1,
          value: 3552.5,
          ticker: "MSFT",
          alpha: -0.02,
          current_price: 150.0,
        },
      ],
    };

    const { getByText, queryByText, getAllByText } = render(
      <AllTradesDataTable trades={multiTickerTrades} />,
    );

    expect(getByText("Filter Tickers")).toBeTruthy();
    expect(getByText("AAPL")).toBeTruthy();
    expect(getByText("MSFT")).toBeTruthy();

    // Open popover
    fireEvent.click(getByText("Filter Tickers"));

    // Toggle AAPL checkbox
    const aaplLabels = getAllByText("AAPL");
    fireEvent.click(aaplLabels[aaplLabels.length - 1]);

    // Reset button should appear
    expect(getByText("Reset Tickers")).toBeTruthy();
  });
});
