import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FactorExposuresButton({
  fund = "all_funds",
}: {
  fund?: string;
}) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={`/forecast/${fund}`}>Forecast</Link>
    </Button>
  );
}
