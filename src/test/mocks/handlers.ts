import { rest } from "msw";

const API_BASE = (
  process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost"
).replace(/\/+$/, "");

export const handlers = [
  // Catch-all POST handler for API routes under API_BASE
  rest.post(new RegExp(`${API_BASE}(/.*)?`), async (req, res, ctx) => {
    return res(ctx.json({}));
  }),

  // Catch-all GET handler as a fallback
  rest.get(new RegExp(`${API_BASE}(/.*)?`), async (req, res, ctx) => {
    return res(ctx.json({}));
  }),
];

export default handlers;
