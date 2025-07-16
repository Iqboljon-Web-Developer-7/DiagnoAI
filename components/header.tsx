"use client"

import { UserMenu } from "./user-menu"
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from "./language-switcher"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const t = useTranslations()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.jpg"
                width={128}
                height={32}
                alt="Logo"
              />
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
