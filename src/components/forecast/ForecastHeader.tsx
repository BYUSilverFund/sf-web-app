"use client";

import React from "react";
import Tooltip from "@/components/Tooltip";
import { InfoIcon } from "lucide-react";

type Props = {
  fundLabel?: string;
  holdingParam?: string | null;
  isHoldingDetail?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  title?: string;
  description?: React.ReactNode;
};

export default function ForecastHeader({
  fundLabel,
  holdingParam,
  isHoldingDetail = false,
  side = "right",
  title,
  description,
}: Props) {
  const computedTitle =
    title ?? `Factor Exposures for ${holdingParam ?? fundLabel ?? ""}`;

  const trigger = (
    <>
      <span className="text-lg text-foreground font-bold">{computedTitle}</span>
      <InfoIcon size={16} />
    </>
  );

  const defaultDescription = (
    <div className="max-w-md text-sm leading-relaxed space-y-2">
      {isHoldingDetail ? (
        <>
          <p>Measures the holding&apos;s exposure to market drivers.</p>
          <p>
            Represented as a factor beta; positive values indicate a correlation
            with the factor, while negative values suggest an inverse
            relationship.
          </p>
        </>
      ) : (
        <>
          <p>Measures the portfolio&apos;s exposure to market drivers.</p>
          <p>
            Represented as a factor beta; positive values indicate a correlation
            with the factor, while negative values suggest an inverse
            relationship.
          </p>
        </>
      )}
    </div>
  );

  return (
    <Tooltip
      side={side}
      trigger={trigger}
      description={description ?? defaultDescription}
    />
  );
}
