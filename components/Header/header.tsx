import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Suspense, lazy } from 'react';

const UserMenu = lazy(() => import('../user-menu').then(module => ({ default: module.UserMenu })));
const LanguageSwitcher = lazy(() => import('../language-switcher').then(module => ({ default: module.LanguageSwitcher })));

export async function Header() {
  const t = await getTranslations('navigation');

  const navigation = [
    { href: '/ai-diagnosis', label: t('aiDiagnosis') },
    { href: '/emergency-help', label: t('emergencyHelp') },
    { href: '/doctors', label: t('doctors') },
    { href: '/recommended-providers', label: t('recommendedProviders') },
    { href: '/about', label: t('about') }
  ];

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-[1%]">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.jpg" width={128} height={32} alt="Logo" />
          </Link>

          {/* Nav */}
          <nav className="hidden lg:flex space-x-5">
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

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Suspense fallback={<div className="w-8 h-8 animate-pulse bg-gray-200 rounded" />}>
              <LanguageSwitcher />
            </Suspense>
            <Suspense fallback={<div className="w-8 h-8 animate-pulse bg-gray-200 rounded" />}>
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
