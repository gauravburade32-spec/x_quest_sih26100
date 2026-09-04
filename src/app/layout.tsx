import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { TenderProvider } from "@/context/TenderContext";

export const metadata: Metadata = {
  title: "BidSure AI — Evidence-Driven Tender Intelligence Platform",
  description: "AI-Powered Integrated Bid Compliance Verification & Risk Evaluation Platform for Public Procurement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        <TenderProvider>
          <AppShell>{children}</AppShell>
        </TenderProvider>
      </body>
    </html>
  );
}
