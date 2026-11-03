"use client";

import Authenticator from "@/components/Authenticator";

export default function AlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Authenticator>{children}</Authenticator>;
}
