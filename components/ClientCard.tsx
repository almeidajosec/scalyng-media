import Link from "next/link";
import { Folder } from "lucide-react";
import { humanSize } from "@/lib/utils";
import type { ClientSummary } from "@/lib/clients";

export function ClientCard({ client }: { client: ClientSummary }) {
  return (
    <Link
      href={`/dashboard/${encodeURIComponent(client.slug)}`}
      className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-brand-accent hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between">
        <Folder className="h-5 w-5 text-brand-accent" />
        <span className="text-[10px] uppercase tracking-wider text-slate-400">
          {client.fileCount} file{client.fileCount === 1 ? "" : "s"}
        </span>
      </div>
      <div className="mt-3 text-sm font-medium truncate">{client.slug}</div>
      <div className="mt-1 text-xs text-slate-500">{humanSize(client.totalBytes)}</div>
    </Link>
  );
}
