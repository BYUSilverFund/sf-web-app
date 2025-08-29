import FundClient from "@/components/FundClient";

export async function generateStaticParams() {
  const funds = ["undergrad", "grad", "quant", "brigham_capital"];
  return funds.map((fund) => ({ fund }));
}

export default function Page() {
  return <FundClient />;
}
