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
    <html lang="uz">
      <body className={"font-sans"}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
