"use client"

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import CollapsibleTabs from '../CollapsibleTabs';
import { LanguageSwitcher } from '../language-switcher';
import { UserMenu } from '../user-menu';

export function Header() {
  const t = useTranslations('navigation');

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
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white/70 w-full rounded-2xl backdrop-blur-sm sticky top-0 border-b shadow-sm max-w-7xl mx-auto px-[1%] flex justify-between items-center h-16 z-20"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <Link href="/" className="flex items-center space-x-2 shrink-0">
          <Image src="/logo.jpg" width={128} height={32} alt="Logo" />
        </Link>
      </motion.div>

      <CollapsibleTabs tabs={navigation} />

      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4"
      >
        <LanguageSwitcher />
        <UserMenu />
      </motion.div>
    </motion.header>
  );
}
