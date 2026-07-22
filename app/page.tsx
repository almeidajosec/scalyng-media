import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthSessionProvider } from "@/components/SessionProvider";
import { SignInButton } from "@/components/SignInButton";

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <AuthSessionProvider session={null}>
      <main className="grid min-h-dvh place-items-center px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent text-white text-lg font-semibold">
            S
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Scalyng Media</h1>
          <p className="mt-2 text-sm text-slate-500">
            Private media host for Scalyng ad creatives. Upload once, get public URLs for Meta,
            Google Ads, TikTok, and more.
          </p>
          <div className="mt-6">
            <SignInButton />
          </div>
          <p className="mt-6 text-xs text-slate-400">
            Access limited to authorised email domains.
          </p>
        </div>
      </main>
    </AuthSessionProvider>
  );
}
