import {
  PerformanceChart,
  type PerformanceChartDataPoint,
} from "@/components/PerformanceChart";

interface ReturnsChartRecord {
  date: string;
  value: number;
  cummulative_return: number;
  benchmark_cummulative_return: number;
}

export function ReturnsChart({
  data,
  label,
}: {
  data: ReturnsChartRecord[] | undefined;
  label?: string;
}) {
  const chartData: PerformanceChartDataPoint[] =
    data?.map((point) => ({
      date: point.date,
      fund: point.cummulative_return,
      benchmark: point.benchmark_cummulative_return,
      value: point.value,
      fundLabel: label,
    })) ?? [];

  return <PerformanceChart data={chartData} />;
}
