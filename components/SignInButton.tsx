"use client";

import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

export function SignInButton({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl })}
      className="inline-flex items-center gap-2 rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
    >
      <LogIn className="h-4 w-4" />
      Sign in with Google
    </button>
  );
}
