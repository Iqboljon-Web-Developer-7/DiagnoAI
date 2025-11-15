import { locales } from '@/i18n';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader'

interface LocaleLayout {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

type ValidLocale = "uz" | "en" | "ru";

export default async function LocaleLayout({
  children,
  params
}: LocaleLayout) {
  const { locale } = await params;
  if (!locales.includes(locale as ValidLocale)) notFound();

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.log(error);
    return notFound();
  }

  return (
    <html lang={locale}>
      <body className='bg-worm-grey dark:bg-worm-dark'>
        <NextTopLoader
          color="#2299DD"  
          height={3}
          showSpinner={false} 
          zIndex={1600}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}