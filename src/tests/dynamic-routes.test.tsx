import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render } from "@testing-library/react";

vi.mock("@/components/ReturnsChart", () => ({
  ReturnsChart: () => React.createElement("div", null, "MockedChart"),
}));

// Mock next/navigation before importing pages
vi.mock("next/navigation", () => ({
  useParams: () => ({ fund: "grad" }),
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));

describe("Dynamic routes", () => {
  it("renders forecast/[fund] page without crash", async () => {
    const mod = await import("../app/forecast/[fund]/page");
    const Component = mod.default;
    const element = React.createElement(Component);
    const { container } = render(element);
    expect(container).toBeTruthy();
  });

  it("renders performance/[fund] page without crash", async () => {
    const mod = await import("../app/performance/[fund]/page");
    const Component = mod.default;
    const element = React.createElement(Component);
    const { container } = render(element);
    expect(container).toBeTruthy();
  });

  it("renders performance/all-portfolios page without crash", async () => {
    const mod = await import("../app/performance/all-portfolios/page");
    const Component = mod.default;
    const element = React.createElement(Component);
    const { container } = render(element);
    expect(container).toBeTruthy();
  });
});
