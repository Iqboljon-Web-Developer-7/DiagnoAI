"use client"

import Link from "next/link"
import { Brain } from "lucide-react"
import { UserMenu } from "./user-menu"
import { useAppContext } from "@/context/app-context"

interface HeaderProps {
  variant?: "default" | "emergency"
}

export function Header({ variant = "default" }: HeaderProps) {
  const { isLoggedIn } = useAppContext()

  if (variant === "emergency") {
    return (
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xl font-bold">Diagno AI - Shoshilinch Yordam</span>
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Diagno AI</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/ai-diagnosis" className="text-gray-600 hover:text-blue-600">
              AI Tahlil
            </Link>
            <Link href="/emergency-help" className="text-gray-600 hover:text-red-600">
              Shoshilinch Yordam
            </Link>
            <Link href="/doctors" className="text-gray-600 hover:text-blue-600">
              Shifokorlar
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600">
              Biz haqimizda
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <select className="text-sm border rounded-md px-2 py-1">
              <option>O'zbek</option>
              <option>Русский</option>
              <option>English</option>
            </select>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
