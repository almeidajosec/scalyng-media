import { listClients } from "@/lib/clients";
import { ClientCard } from "@/components/ClientCard";
import { NewClientForm } from "@/components/NewClientForm";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  let clients: Awaited<ReturnType<typeof listClients>> = [];
  let error: string | null = null;
  try {
    clients = await listClients();
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : "Failed to load clients";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Clients</h1>
          <p className="text-sm text-slate-500">One folder per client. Files land as <code className="rounded bg-slate-100 dark:bg-slate-800 px-1">{"{client-slug}/{filename}"}</code>.</p>
        </div>
        <NewClientForm />
      </div>

      {error && (
        <div className="rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-300">
          Can&apos;t reach Blob storage: {error}. Confirm <code>BLOB_READ_WRITE_TOKEN</code> is set in Vercel.
        </div>
      )}

      {clients.length === 0 && !error && (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-slate-500">
          No clients yet. Type a client name above and press <kbd className="rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-1">Enter</kbd> to open a fresh folder.
        </div>
      )}

      {clients.length > 0 && (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {clients.map((c) => (
            <li key={c.slug}>
              <ClientCard client={c} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
