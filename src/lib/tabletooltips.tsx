import * as React from "react";

type TooltipMap = Record<string, React.ReactNode | undefined>;

function buildHeaderTooltips(annualized: boolean): TooltipMap {
  return {
    Value: "Market value as of the end date.",

    Return: "Cumulative return over the selected period.",

    "Total Return": "Cumulative return over the selected period.",

    Volatility: annualized
      ? "Annualized volatility = standard deviation of daily returns × √252."
      : "Volatility = standard deviation of daily returns over the selected period.",

    AverageReturns: annualized
      ? "Annualized returns = average daily return over the selected period × 252."
      : "Realized returns = average daily return over the selected period.",

    "Sharpe Ratio": annualized
      ? "Annualized Sharpe Ratio = Annualized excess return ÷ Annualized volatility."
      : "Sharpe Ratio = Average excess return ÷ Volatility over the selected period.",

    Dividends:
      "Dividends = Total cash distributions received over the selected period.",

    "Dividend Yield":
      "Dividend Yield = Dividends ÷ Ending Value over the selected period.",

    Alpha: (
      <a
        href="/alpha-beta-guide"
        className="text-xs text-blue-600 hover:underline"
      >
        Alpha & Beta Calculation Guide
      </a>
    ),

    Beta: (
      <a
        href="/alpha-beta-guide"
        className="text-xs text-blue-600 hover:underline"
      >
        Alpha & Beta Calculation Guide
      </a>
    ),

    "Tracking Error": annualized
      ? "Annualized Tracking Error = Standard deviation of daily active returns (Fund − Benchmark) × √252."
      : "Tracking Error = Standard deviation of daily active returns (Fund − Benchmark) over the selected period.",

    "Information Ratio": annualized
      ? "Annualized Information Ratio = Annualized average active return ÷ Annualized tracking error."
      : "Information Ratio = Average active return ÷ Tracking error.",

    Ticker: "Stock ticker symbol for the holding.",

    Shares: "Number of shares held.",

    Price: "Price per share",

    "Dividends/Share":
      "Dividends paid per individual share over the selected period.",

    Active:
      "Whether this holding is currently active (included in the portfolio’s live holdings list).",

    Weight: "Portfolio weight = Holding value ÷ Total portfolio value.",

    "Per Share":
      "Dividends received per individual share over the selected period.",

    Total:
      "Total dividends received from this holding over the selected period (all shares combined).",

    Date: "The date the trade was executed.",

    Type: "Indicates whether the transaction was a Buy or Sell order.",
  };
}

export function getHeaderTooltip<T extends string>(
  annualized: boolean,
  column: T,
): React.ReactNode | undefined {
  return buildHeaderTooltips(annualized)[column];
}

export function getHeaderTooltips<T extends readonly string[]>(
  annualized: boolean,
  columns: T,
): Record<T[number], React.ReactNode | undefined> {
  const all = buildHeaderTooltips(annualized);

  const filtered = Object.fromEntries(
    columns.map((c) => [c, all[c]]),
  ) as Record<T[number], React.ReactNode | undefined>;

  return filtered;
}

export function getRiskForecastTooltips(): Record<string, string> {
  return {
    Beta: "Beta = portfolio-to-benchmark covariance / benchmark variance",

    Volatility: "Volatility = square root of portfolio variance",

    "Tracking Error": "Tracking Error = square root of active weight variance",

    "Portfolio Weight": "Portfolio Weight = holding value / total fund value",
  };
}
