import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FactorExposuresButton({
  fund = "all_funds",
}: {
  fund?: string;
}) {
  return (
    <Link href={`/factor-exposures/${fund}`} passHref>
      <Button asChild variant="outline" size="sm">
        <a>Factor Exposures</a>
      </Button>
    </Link>
  );
}
