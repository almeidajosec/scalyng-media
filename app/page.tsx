import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/session";

export default async function LandingPage() {
  const authed = await isAuthenticated();
  redirect(authed ? "/dashboard" : "/login");
}
