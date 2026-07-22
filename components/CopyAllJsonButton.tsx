"use client";

import { useState } from "react";
import { ClipboardList, Check } from "lucide-react";
import type { StoredFile } from "@/lib/blob";

export function CopyAllJsonButton({ files }: { files: StoredFile[] }) {
  const [copied, setCopied] = useState(false);
  if (files.length === 0) return null;

  return (
    <button
      onClick={async () => {
        const obj = Object.fromEntries(files.map((f) => [f.filename, f.url]));
        await navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <ClipboardList className="h-3.5 w-3.5" />}
      {copied ? "Copied JSON" : "Copy all as JSON"}
    </button>
  );
}
