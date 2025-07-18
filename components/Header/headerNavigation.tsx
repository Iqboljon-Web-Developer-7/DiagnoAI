'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export function HeaderNavigation({ className }: { className?: string }) {
  const t = useTranslations()

  const navigation = [
    { href: '/ai-diagnosis', label: t('navigation.aiDiagnosis') },
    { href: '/emergency-help', label: t('navigation.emergencyHelp') },
    { href: '/doctors', label: t('navigation.doctors') },
    { href: '/recommended-providers', label: t('navigation.recommendedProviders') },
    { href: '/about', label: t('navigation.about') },
  ]

  return (
    <>
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={className ?? 'text-sm text-gray-600 hover:text-blue-600'}
        >
          {item.label}
        </Link>
      ))}
    </>
  )
}
