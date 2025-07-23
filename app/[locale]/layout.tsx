import { locales } from '@/i18n';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/footer';
import { Header } from '@/components/Header/header';

interface LocaleLayout {
  children: React.ReactNode;
  params: { locale: "uz" | "en" | "ru" };
}

export default async function LocaleLayout({ children, params }: LocaleLayout) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    return notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}