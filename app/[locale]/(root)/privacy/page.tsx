'use client';

import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('legal.privacy');

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <p className="mb-4 text-gray-700">
        {t('intro')}
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('collect.title')}</h2>
        <p className="text-gray-700">
          {t('collect.body')}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('use.title')}</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>{t('use.item1')}</li>
          <li>{t('use.item2')}</li>
          <li>{t('use.item3')}</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('security.title')}</h2>
        <p className="text-gray-700">
          {t('security.body')}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('rights.title')}</h2>
        <p className="text-gray-700">
          {t('rights.body')}
        </p>
      </section>

      <p className="text-gray-500 mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}
