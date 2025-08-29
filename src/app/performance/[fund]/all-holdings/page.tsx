import AllHoldingsClient from "@/components/AllHoldingsClient";

// this function is to allow static export
export async function generateStaticParams() {
  const funds = ["undergrad", "grad", "quant", "brigham_capital"];
  return funds.map((fund) => ({ fund }));
}

export default function Page() {
  return <AllHoldingsClient />;
}
