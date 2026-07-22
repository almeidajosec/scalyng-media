"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function UserBar({ email }: { email: string | null | undefined }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-slate-500 dark:text-slate-400">{email ?? "Signed in"}</span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 px-2.5 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign out
      </button>
    </div>
  );
}
