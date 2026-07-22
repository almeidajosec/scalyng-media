import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/session";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/dashboard");

  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent text-white text-lg font-semibold">
            S
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Scalyng Media</h1>
          <p className="mt-2 text-sm text-slate-500">Private media host for ad creatives.</p>
        </div>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
