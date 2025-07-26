import { getTranslations } from "next-intl/server";
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import CollapsibleTabs from './CollapsibleTabs';
import { LanguageSwitcher } from './language-switcher';
import { UserMenu } from './user-menu';

export async function Header() {
  const t = await getTranslations('navigation');

  const navigation = [
    { path: '/ai-diagnosis', label: t('aiDiagnosis') },
    { path: '/emergency-help', label: t('emergencyHelp') },
    { path: '/doctors', label: t('doctors') },
    { path: '/recommended-providers', label: t('recommendedProviders') },
    { path: '/about', label: t('about') },
    { path: '/hospitals', label: t('hospitals') },
    { path: '/education', label: t('education') },
  ];

  return (

    <header className="min-h-16 w-screen flex items-center justify-center bg-transparent sticky top-0 z-30 px-3">
      <div className="sticky top-0 bg-white/70 w-full rounded-2xl backdrop-blur-sm max-w-7xl mx-auto px-[1%] flex justify-between items-center z-30">
        <div className="hover:scale-105 transition-transform duration-200 animate-fade-in-down opacity-0 delay-1000">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Image className="min-w-[2.125rem]" src="/logo.png" width={160} height={40} alt="Logo" />
          </Link>
        </div>

        <CollapsibleTabs tabs={navigation} />

        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 animate-fade-in-down opacity-0 delay-700">
          <LanguageSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
