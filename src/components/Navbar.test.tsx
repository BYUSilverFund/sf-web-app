import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { Navbar } from "./Navbar";

const auth = vi.hoisted(() => ({
  listener: undefined as
    undefined | ((event: { payload: { event: string } }) => void),
}));
vi.mock("aws-amplify/auth", () => ({
  fetchAuthSession: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("aws-amplify/utils", () => ({
  Hub: {
    listen: vi.fn((_channel, listener) => {
      auth.listener = listener;
      return vi.fn();
    }),
  },
}));
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(fetchAuthSession).mockResolvedValue({} as never);
  vi.mocked(signOut).mockResolvedValue();
});
afterEach(cleanup);

it("updates desktop and mobile controls when Cognito signs in and signs out", async () => {
  render(<Navbar />);
  expect(screen.getAllByRole("link", { name: "Sign in" })).toHaveLength(2);
  vi.mocked(fetchAuthSession).mockResolvedValue({
    tokens: { accessToken: "token" },
  } as never);
  act(() => auth.listener?.({ payload: { event: "signedIn" } }));
  await waitFor(() =>
    expect(screen.getAllByRole("button", { name: "Sign out" })).toHaveLength(2),
  );
  fireEvent.click(screen.getAllByRole("button", { name: "Sign out" })[0]);
  await waitFor(() => expect(signOut).toHaveBeenCalledOnce());
  await waitFor(() =>
    expect(screen.getAllByRole("link", { name: "Sign in" })).toHaveLength(2),
  );
});

it("restores sign-in controls when another component signs out", async () => {
  vi.mocked(fetchAuthSession).mockResolvedValue({
    tokens: { accessToken: "token" },
  } as never);
  render(<Navbar />);
  await screen.findAllByRole("button", { name: "Sign out" });
  act(() => auth.listener?.({ payload: { event: "signedOut" } }));
  expect(screen.getAllByRole("link", { name: "Sign in" })).toHaveLength(2);
});
