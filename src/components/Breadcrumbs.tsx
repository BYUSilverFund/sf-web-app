"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Page {
  href?: string;
  name?: string;
}

export function Breadcrumbs({
  pages,
  currentPage,
}: {
  pages: Page[];
  currentPage?: string;
}) {
  const searchParams = useSearchParams();
  const view = searchParams?.get("view");
  const showTop = searchParams?.get("show_top");

  const appendParams = useMemo(() => {
    return (href?: string) => {
      if (!href) return href;
      try {
        const base =
          typeof window !== "undefined" ? window.location.origin : "";
        const url = new URL(href, base || undefined);
        if (view) url.searchParams.set("view", view);
        if (showTop) url.searchParams.set("show_top", showTop as string);
        return `${url.pathname}${url.search}${url.hash}`;
      } catch {
        // fallback: try to append manually
        const parts = href.split("#");
        const pathAndQuery = parts[0];
        const hash = parts[1] ? `#${parts[1]}` : "";
        const sep = pathAndQuery.includes("?") ? "&" : "?";
        const q = [] as string[];
        if (view) q.push(`view=${encodeURIComponent(view)}`);
        if (showTop)
          q.push(`show_top=${encodeURIComponent(showTop as string)}`);
        return `${pathAndQuery}${q.length ? sep + q.join("&") : ""}${hash}`;
      }
    };
  }, [view, showTop]);

  return (
    <Breadcrumb className="w-full">
      <BreadcrumbList>
        {pages.map((page, index) => (
          <div key={index} className="flex items-center gap-3">
            <BreadcrumbItem>
              <BreadcrumbLink href={appendParams(page.href)}>
                {page.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </div>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
