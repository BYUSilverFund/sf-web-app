export interface FundBetaChartPoint {
  date: string; // ISO date string
  fund_return: number;
  benchmark_return: number;
}

export interface FundBetaChartData {
  fund: string;
  start: string; // ISO date string
  end: string; // ISO date string
  beta: number;
  points: FundBetaChartPoint[];
}
