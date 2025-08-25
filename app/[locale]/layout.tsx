import { locales } from '@/i18n';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header/header';
import { Footer } from '@/components/layout/footer';

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
  const validLocale = locale as ValidLocale;
  if (!locales.includes(validLocale)) notFound();

  let messages;
  try {
    messages = (await import(`../../messages/${validLocale}.json`)).default;
  } catch (error) {
    console.log(error);
    return notFound();
  }

  return (
    <html lang={validLocale}>
      <body>
        <NextIntlClientProvider locale={validLocale} messages={messages}>
          {/* @ts-expect-error Async Server Component */}
          <Header />

          {children}

          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}