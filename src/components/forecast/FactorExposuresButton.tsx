import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

export function FactorExposuresButton({
  fund = "all_funds",
  holding,
  size = "sm",
  className,
}: {
  fund?: string;
  holding?: string;
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
}) {
  const href = holding
    ? `/forecast/${fund}?holding=${encodeURIComponent(holding)}`
    : `/forecast/${fund}`;

  return (
    // Centralizing the forecast href here keeps every performance page pointed at the same forecast entry points.
    <Button asChild variant="outline" size={size} className={className}>
      <Link href={href}>Forecast</Link>
    </Button>
  );
}
