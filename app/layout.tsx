import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from "@/context/app-context"

export const metadata: Metadata = {
  title: 'Diagno AI',
  description: 'AI-powered medical diagnosis and emergency assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppProvider>{children}</AppProvider>
  )
}
