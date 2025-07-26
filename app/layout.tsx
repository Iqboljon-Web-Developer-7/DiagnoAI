import "@/styles/globals.css";
import type { Metadata } from "next";
import { MetaData } from "./MetaData";
import { Toaster } from "@/components/ui/toaster";
import TanstackProvider from "@/providers/Tanstack";

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
    </>
  );
}