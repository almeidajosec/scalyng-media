import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

function allowedDomains(): string[] {
  return (process.env.ALLOWED_EMAIL_DOMAINS || "scalyng.com,betterdatatoday.com")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: { signIn: "/" },
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase() ?? "";
      const domain = email.split("@")[1];
      if (!domain) return false;
      return allowedDomains().includes(domain);
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
});
