'use client';

import {useLocale} from 'next-intl';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {Globe} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from "react";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('switchLanguage')}>
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => switchLocale('uz')}
          className={locale === 'uz' ? 'bg-accent' : ''}
        >
          {t('uzbek')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLocale('en')}
          className={locale === 'en' ? 'bg-accent' : ''}
        >
          {t('english')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLocale('ru')}
          className={locale === 'ru' ? 'bg-accent' : ''}
        >
          {t('russia')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}