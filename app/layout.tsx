import type { Metadata } from 'next'
import '@/styles/globals.css'
import { AppProvider } from "@/context/app-context"

export const metadata: Metadata = MetaData

import { Toaster } from "@/components/ui/toaster";
import { MetaData } from './MetaData';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppProvider>
      {children}
      <Toaster />
    </AppProvider>
  )
}
