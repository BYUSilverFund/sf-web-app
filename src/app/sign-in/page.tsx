"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Authenticator from "@/components/Authenticator";

function SignedInRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <p className="py-8 text-center">
      You’re signed in.{" "}
      <Link href="/" className="underline">
        Return home
      </Link>
    </p>
  );
}

export default function SignInPage() {
  return (
    <div className="px-4 py-8">
      <Authenticator>
        <SignedInRedirect />
      </Authenticator>
    </div>
  );
}
