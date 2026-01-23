"use client";

import Authenticator from "@/components/Authenticator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Authenticator>{children}</Authenticator>;
}
