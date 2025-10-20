"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { code: "uz", label: "uzbek" },
  { code: "en", label: "english" },
  { code: "ru", label: "russia" },
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Language");

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="link"
          className="sm:w-fit text-neutral-900 dark:text-neutral-100 hover:text-neutral-900 dark:hover:text-neutral-200 px-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full"
          aria-label="Select language"
        >
          <Globe aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="bg-white/50 dark:bg-neutral-950/50 backdrop-blur-xs border-none"
      >
        {LANGUAGES.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={`dark:text-neutral-200 ${
              locale === code
                ? "bg-neutral-300 hover:!bg-neutral-200 dark:!bg-neutral-800"
                : "hover:!bg-neutral-200 dark:hover:!bg-neutral-900"
            }`}
          >
            {t(label)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
