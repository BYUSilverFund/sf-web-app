"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const PERFORMANCE_PAGE_LAYOUT = {
  // The overview graph and summary card intentionally share one fixed height.
  graphPanelHeight: 445,
  // These flex ratios keep the graph visually dominant while leaving room for the summary card.
  graphColumnFlex: 17,
  sidebarColumnFlex: 4,
  // Shared spacing tokens keep the performance pages aligned with each other.
  sidebarStackGap: 12,
  metricsContentPaddingClass: "px-3 pt-0 pb-1.5",
  graphRowMinHeightClass: "min-h-[16.25rem]",
} as const;

type PanelDimension = number | string | undefined;

export function resolvePanelDimension(value: PanelDimension) {
  // Numeric dimensions are converted once here so callers can pass either raw numbers or CSS strings.
  if (typeof value === "number") {
    return `${value}px`;
  }

  return value;
}

export function PerformancePageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    // This shell owns the fixed top spacing below the shared navbar for performance pages.
    <div className="mx-auto w-full max-w-[1800px] px-3 py-1.5 sm:px-4 md:px-5 lg:px-6 xl:px-8">
      <div className="px-0 py-1">
        <div
          className={cn(
            "flex min-h-[calc(100dvh-75px-1.5rem)] w-full flex-col",
            className,
          )}
        >
          {/* Child pages inherit one flex column so page sections can control their own spacing. */}
          <div className="flex min-h-0 flex-1 flex-col gap-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function PerformanceTitleRow({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    // The title row stays generic so detail pages and overview pages can share the same rhythm.
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-baseline gap-3">
        <h1 className="text-lg font-semibold">{title}</h1>
        {subtitle ? <p className="text-sm text-gray-400">{subtitle}</p> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

export function PerformanceToolbar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    // Toolbars wrap on smaller screens, but preserve the same chrome across performance pages.
    <div
      className={cn(
        "mb-0 flex min-h-[65px] flex-wrap items-center gap-3 rounded border border-gray-300 bg-white p-3 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PerformanceGraphRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    // The graph row stacks on smaller screens and switches to a two-column layout at xl.
    <div
      className={cn(
        "flex min-h-0 flex-col gap-3 xl:flex-row xl:items-stretch",
        PERFORMANCE_PAGE_LAYOUT.graphRowMinHeightClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PerformanceSidebar({
  children,
  className,
  height,
  width,
}: {
  children: ReactNode;
  className?: string;
  height?: number | string;
  width?: number | string;
}) {
  return (
    // The sidebar wrapper receives the same explicit height as the graph pane so both columns align.
    <div
      className={cn(
        "flex h-full min-h-0 w-full shrink-0 flex-col xl:self-stretch",
        className,
      )}
      style={{
        flex: `${PERFORMANCE_PAGE_LAYOUT.sidebarColumnFlex} ${PERFORMANCE_PAGE_LAYOUT.sidebarColumnFlex} 0%`,
        height: resolvePanelDimension(height),
        width: resolvePanelDimension(width),
      }}
    >
      {/* This inner flex wrapper lets the summary card stretch to the full sidebar height. */}
      <div className="flex h-full min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

export function PerformancePrimaryPane({
  children,
  className,
  height,
  width,
}: {
  children: ReactNode;
  className?: string;
  height?: number | string;
  width?: number | string;
}) {
  return (
    // The primary pane mirrors the sidebar height contract so the graph card cannot drift taller.
    <div
      className={cn("flex h-full min-h-0 min-w-0 flex-col", className)}
      style={{
        flex: `${PERFORMANCE_PAGE_LAYOUT.graphColumnFlex} ${PERFORMANCE_PAGE_LAYOUT.graphColumnFlex} 0%`,
        height: resolvePanelDimension(height),
        width: resolvePanelDimension(width),
      }}
    >
      {children}
    </div>
  );
}

export function PerformanceChartCard({
  children,
  className,
  height = PERFORMANCE_PAGE_LAYOUT.graphPanelHeight,
  width,
}: {
  children: ReactNode;
  className?: string;
  height?: number | string;
  width?: number | string;
}) {
  return (
    // The chart card is reusable for both real charts and loading skeletons, so sizing stays consistent.
    <div
      className={cn(
        "flex h-full min-h-0 shrink-0 flex-col overflow-hidden rounded border border-gray-300 bg-white px-4 pb-2 pt-1.5 sm:px-5",
        className,
      )}
      style={{
        height: resolvePanelDimension(height),
        width: resolvePanelDimension(width),
      }}
    >
      {children}
    </div>
  );
}

export function PerformanceStackedSidebar({
  children,
  className,
  gap = PERFORMANCE_PAGE_LAYOUT.sidebarStackGap,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    // Holding detail pages split the sidebar into stacked cards instead of a single summary panel.
    <div
      className={cn(
        "flex min-h-0 w-full shrink-0 flex-col xl:self-stretch",
        className,
      )}
      style={{
        flex: `${PERFORMANCE_PAGE_LAYOUT.sidebarColumnFlex} ${PERFORMANCE_PAGE_LAYOUT.sidebarColumnFlex} 0%`,
        height: `${PERFORMANCE_PAGE_LAYOUT.graphPanelHeight}px`,
        rowGap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}

export function PerformanceFlexSidebarPane({
  children,
  ratio,
  className,
}: {
  children: ReactNode;
  ratio: number;
  className?: string;
}) {
  return (
    // Each stacked sidebar pane gets its height share from a simple flex ratio.
    <div
      className={cn("flex min-h-0 overflow-hidden", className)}
      style={{ flex: ratio }}
    >
      {children}
    </div>
  );
}

export function PerformanceSectionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    // Section cards wrap tables and metric groups without owning any page-specific logic.
    <div className={cn("rounded border border-gray-300 bg-white", className)}>
      {children}
    </div>
  );
}

export function PerformanceMetricsSection({
  header,
  children,
  className,
}: {
  header: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    // The metrics section separates the toggle/header chrome from the cards below it.
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm",
        className,
      )}
    >
      {header}
      {/* Shared inner padding keeps the metrics header and cards visually connected. */}
      <div className={PERFORMANCE_PAGE_LAYOUT.metricsContentPaddingClass}>
        {children}
      </div>
    </div>
  );
}
