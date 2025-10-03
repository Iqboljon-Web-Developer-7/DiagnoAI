import { locales } from '@/i18n';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header/header';
import { Footer } from '@/components/layout/footer';
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
          color="#2299DD" // Customize color
          height={3} // Bar thickness
          showSpinner={false} // No spinner for clean UX
          zIndex={1600} // Ensure it’s above other elements
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
            {/* @ts-expect-error Async Server Component */}
            <Header />

            {children}

            <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}