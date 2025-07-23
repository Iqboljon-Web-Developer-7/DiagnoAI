import type { Metadata } from "next";
import "@/styles/globals.css";
import { MetaData } from "./MetaData";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = MetaData;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}