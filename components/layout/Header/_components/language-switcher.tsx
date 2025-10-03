'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const LANGUAGES = [
  { code: 'uz', label: 'uzbek' },
  { code: 'en', label: 'english' },
  { code: 'ru', label: 'russia' }
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Language');

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"sm"}
          variant="link"
          className="sm:w-fit px-3 hover:bg-green-50 dark:hover:bg-black-900 rounded-full"
          aria-label="Select language"
        >
          <Globe aria-hidden="true" />
          {/* <span className="hidden sm:inline-block">{locale.toUpperCase()}</span> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className='bg-white/50 dark:bg-black/50 backdrop-blur-sm border-none'>
        {LANGUAGES.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={
              locale === code
                ? 'bg-accent dark:bg-black-900'
                : 'hover:bg-white/30 dark:hover:bg-black-900 duration-500 ease-in-out'
            }
          >
            {t(label)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
