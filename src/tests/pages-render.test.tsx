import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { vi } from "vitest";

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn().mockResolvedValue(undefined),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/performance",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/components/ReturnsChart", () => ({
  ReturnsChart: () => React.createElement("div", null, "MockedChart"),
}));

const pages = [
  "../app/page",
  "../app/about/page",
  "../app/alumni/page",
  "../app/covariance-matrix/page",
  "../app/forecast/layout",
  "../app/history/page",
  "../app/news/page",
  "../app/performance/page",
  "../app/team/page",
  "../app/tools/page",
];

async function getElement(mod: any) {
  const def = mod?.default ?? mod?.Page;
  if (!def) return null;
  if (React.isValidElement(def)) return def;
  if (typeof def === "function") {
    // Do not call function components (hooks would break). Create element instead.
    const props = def.length > 0 ? { children: <div /> } : undefined;
    return React.createElement(def, props);
  }
  return null;
}

describe("App pages render tests", () => {
  for (const p of pages) {
    it(`renders ${p}`, async () => {
      const mod = await import(p);
      const element = await getElement(mod);
      expect(element).toBeTruthy();
      const { container } = render(element as React.ReactElement);
      expect(container).toBeTruthy();
    });
  }
});
