'use client'

import { Disclosure } from '@headlessui/react'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from './language-switcher'
import { UserMenu } from './user-menu'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'

export function Header() {
  const t = useTranslations()

  const navigation = [
    { href: '/ai-diagnosis', label: t('navigation.aiDiagnosis') },
    { href: '/emergency-help', label: t('navigation.emergencyHelp') },
    { href: '/doctors', label: t('navigation.doctors') },
    { href: '/recommended-providers', label: t('navigation.recommendedProviders') },
    { href: '/about', label: t('navigation.about') },
  ]

  return (
    <Disclosure as="header" className="bg-white border-b shadow-sm">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <Image src="/logo.jpg" width={128} height={32} alt="Logo" />
                </Link>
              </div>

              <nav className="hidden md:flex space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <UserMenu />

                <div className="md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none">
                    {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <nav className="space-y-1 px-4 pb-4 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-gray-700 hover:text-blue-600 py-2 text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
