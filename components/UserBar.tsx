"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserBar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 px-2.5 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <LogOut className="h-3.5 w-3.5" />
      Sign out
    </button>
  );
}
