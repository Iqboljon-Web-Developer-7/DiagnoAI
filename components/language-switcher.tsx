'use client';

import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import {useTranslations} from 'next-intl';
import {Globe} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useTransition} from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export function LanguageSwitcher() {
  const [_, startTransition] = useTransition();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('Language');
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      router.replace(`/${newLocale}${pathname}`);
    });
  };

  return (
    <Select defaultValue={locale} onValueChange={switchLocale}>
      <SelectTrigger>
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
