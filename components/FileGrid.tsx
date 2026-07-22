"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { humanSize, isImage } from "@/lib/utils";
import type { StoredFile } from "@/lib/blob";

export function FileGrid({ files }: { files: StoredFile[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const router = useRouter();

  async function onDelete(url: string) {
    if (!confirm("Delete this file?")) return;
    setBusy(url);
    try {
      const res = await fetch("/api/files/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("delete_failed");
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  if (files.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-slate-500">
        No files uploaded yet.
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {files.map((f) => (
        <li
          key={f.pathname}
          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col"
        >
          <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
            {isImage(f.pathname) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={f.url}
                alt={f.filename}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-xs text-slate-500">
                {f.filename.split(".").pop()?.toUpperCase() ?? "FILE"}
              </span>
            )}
          </div>
          <div className="p-2 flex flex-col gap-1.5 flex-1">
            <div className="text-xs font-medium truncate" title={f.filename}>
              {f.filename}
            </div>
            <div className="text-[10px] text-slate-500">{humanSize(f.size)}</div>
            <div className="mt-auto flex items-center justify-between gap-1">
              <CopyButton value={f.url} label="Copy URL" />
              <button
                onClick={() => onDelete(f.url)}
                disabled={busy === f.url}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
