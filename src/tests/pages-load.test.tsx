import { describe, it, expect } from "vitest";

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

describe("App pages smoke import tests", () => {
  for (const p of pages) {
    it(`imports ${p}`, async () => {
      // dynamic import to verify module can be loaded without rendering
      const mod = await import(p);
      expect(mod).toBeTruthy();
    });
  }
});
