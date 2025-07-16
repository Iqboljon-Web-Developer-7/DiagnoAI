'use client';

import {useLocale} from 'next-intl';
import {useTranslations} from 'next-intl';
import {Globe} from 'lucide-react';
import {usePathname, useRouter} from 'next/navigation';
import {useTransition} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('Language');
  const router = useRouter();
  const pathname = usePathname();
  const [_, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    const basePath = pathname.slice(locale.length + 1)
    startTransition(() => {
      router.replace(`/${newLocale}/${basePath}`);
    });
  };

  return (
    <Select defaultValue={locale} onValueChange={switchLocale}>
      <SelectTrigger className="w-[120px]">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue placeholder={t('switchLanguage')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="uz" className={locale === 'uz' ? 'bg-accent' : ''}>
          {t('uzbek')}
        </SelectItem>
        <SelectItem value="en" className={locale === 'en' ? 'bg-accent' : ''}>
          {t('english')}
        </SelectItem>
        <SelectItem value="ru" className={locale === 'ru' ? 'bg-accent' : ''}>
          {t('russia')}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}