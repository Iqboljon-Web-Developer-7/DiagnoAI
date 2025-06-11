import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from "@/context/app-context"

const inter = Inter({ subsets: ['latin'] })



export const metadata: Metadata = {
  title: 'Diagno AI',
  description: 'AI-powered medical diagnosis and emergency assistance',
}



// Export a default function that redirects to the default locale
export default function RootLayout({
  children,
}: {
  
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
