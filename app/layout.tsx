import "@/styles/globals.css";
import type { Metadata } from "next";
import { MetaData } from "./MetaData";
import { Toaster } from "@/components/ui/toaster";
import TanstackProvider from "@/providers/Tanstack";

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = MetaData;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TanstackProvider>
        {children}
      </TanstackProvider>
      <Toaster />
      <Analytics />
      <SpeedInsights />
    </>
  );
}