"use client"

import Link from "next/link"
import { Brain } from "lucide-react"
import { UserMenu } from "./user-menu"
import { useAppContext } from "@/context/app-context"
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from "./language-switcher"

interface HeaderProps {
  variant?: "default" | "emergency"
}

export function Header({ variant = "default" }: HeaderProps) {
  const { isLoggedIn } = useAppContext()
  const t = useTranslations()

  if (variant === "emergency") {
    return (
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xl font-bold">{t('common.appName')} - {t('emergency.title')}</span>
            </Link>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <UserMenu />
            </div>
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
              <span className="text-xl font-bold text-gray-900">{t('common.appName')}</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/ai-diagnosis" className="text-gray-600 hover:text-blue-600">
              {t('navigation.aiDiagnosis')}
            </Link>
            <Link href="/emergency-help" className="text-gray-600 hover:text-red-600">
              {t('navigation.emergencyHelp')}
            </Link>
            <Link href="/doctors" className="text-gray-600 hover:text-blue-600">
              {t('navigation.doctors')}
            </Link>
            <Link href="/recommended-providers" className="text-gray-600 hover:text-blue-600">
              {t('navigation.recommendedProviders')}
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600">
              {t('navigation.about')}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
