import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scalyng Media",
  description: "Private media host for Scalyng ad creatives.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
