import HoldingClient from "@/components/HoldingClient";

export async function generateStaticParams() {
  // TODO: Replace with your actual data source for funds and holdings
  const funds = ["undergrad", "grad", "quant", "brigham_capital"];
  const holdings = ["AAPL", "MSFT", "GOOG", "TSLA"];
  const params = [];
  for (const fund of funds) {
    for (const holding of holdings) {
      params.push({ fund, holding });
    }
  }
  return params;
}

export default function Page() {
  return <HoldingClient />;
}
