import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/context/app-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Diagno AI - Sun'iy Intellekt Tibbiy Platformasi",
  description:
    "AI yordamida tibbiy tashxis, shifokor tavsiyalari va shoshilinch yordam xizmatlari. Professional tibbiy yordam 24/7 mavjud.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
