/**
 * app/layout.tsx
 * Root-layout for Next.js App Router.
 * Setter metadata, font og global CSS.
 */

import type { Metadata } from "next";
import "./globals.css";
import { ORG } from "@/app-spec";

export const metadata: Metadata = {
  title: `Fiskekort – ${ORG}`,
  description: `Kjøp fiskekort for ${ORG} enkelt og trygt.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb">
      <body className="bg-blue-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
