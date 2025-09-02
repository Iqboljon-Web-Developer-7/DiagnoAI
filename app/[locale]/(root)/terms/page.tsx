'use client';

import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('legal.terms');

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('accept.title')}</h2>
        <p className="text-gray-700">
          {t('accept.body')}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('disclaimer.title')}</h2>
        <p className="text-gray-700">
          {t('disclaimer.body')}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('responsibility.title')}</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>{t('responsibility.item1')}</li>
          <li>{t('responsibility.item2')}</li>
          <li>{t('responsibility.item3')}</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('liability.title')}</h2>
        <p className="text-gray-700">
          {t('liability.body')}
        </p>
      </section>

      <p className="text-gray-500 mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}
