'use client';

import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('legal.privacy');

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-24">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <p className="mb-4">
        {t('intro')}
      </p>

      {/* Definitions */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('definitions.title')}</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>{t('definitions.user').split(' - ')[0]}</strong> - <span style={{ fontWeight: 400 }}>{t('definitions.user').split(' - ').slice(1).join(' - ')}</span></li>
          <li><strong>{t('definitions.personalData').split(' - ')[0]}</strong> - <span style={{ fontWeight: 400 }}>{t('definitions.personalData').split(' - ').slice(1).join(' - ')}</span></li>
          <li><strong>{t('definitions.confidentiality').split(' - ')[0]}</strong> - <span style={{ fontWeight: 400 }}>{t('definitions.confidentiality').split(' - ').slice(1).join(' - ')}</span></li>
          <li><strong>{t('definitions.anonymization').split(' - ')[0]}</strong> - <span style={{ fontWeight: 400 }}>{t('definitions.anonymization').split(' - ').slice(1).join(' - ')}</span></li>
          <li><strong>{t('definitions.specialCategories').split(' - ')[0]}</strong> - <span style={{ fontWeight: 400 }}>{t('definitions.specialCategories').split(' - ').slice(1).join(' - ')}</span></li>
        </ul>
      </section>

      {/* Information We Collect */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('collect.title')}</h2>
        <p className="mb-2">{t('collect.body')}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{t('collect.userProvided')}</li>
          <li>{t('collect.identification')}</li>
          <li>{t('collect.contact')}</li>
          <li>{t('collect.feedback')}</li>
          <li>{t('collect.usage')}</li>
          <li>{t('collect.cookies')}</li>
        </ul>
      </section>

      {/* How We Use Your Data */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('use.title')}</h2>
        <p className="mb-2">{t('use.purposes')}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{t('use.p1')}</li>
          <li>{t('use.p2')}</li>
          <li>{t('use.p3')}</li>
          <li>{t('use.p4')}</li>
          <li>{t('use.p5')}</li>
        </ul>
        <p className="mt-2">{t('use.note')}</p>
      </section>

      {/* When We May Disclose Data */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('disclosure.title')}</h2>
        <p className="">{t('disclosure.body')}</p>
      </section>

      {/* Your Rights and Choices */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('rights.title')}</h2>
        <p className="mb-2">{t('rights.body')}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{t('rights.r1')}</li>
          <li>{t('rights.r2')}</li>
          <li>{t('rights.r3')}</li>
          <li>{t('rights.r4')}</li>
          <li>{t('rights.r5')}</li>
          <li>{t('rights.r6')}</li>
          <li>{t('rights.r7')}</li>
        </ul>
        <p className="mt-2">{t('rights.exercise')}</p>
        <p className="mt-2">{t('rights.automation')}</p>
      </section>

      {/* Cross-Border Transfers */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('crossBorder.title')}</h2>
        <p className="">{t('crossBorder.body')}</p>
      </section>

      {/* Data Retention & Security */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('retention.title')}</h2>
        <p className="">{t('retention.body')}</p>
      </section>

      {/* Changes to This Policy */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('changes.title')}</h2>
        <p className="">{t('changes.body')}</p>
      </section>

      {/* Contact Us */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('contact.title')}</h2>
        <div className="space-y-1">
          <p>{t('contact.email')}</p>
          <p>{t('contact.phone')}</p>
        </div>
      </section>

      {/* Dispute Resolution */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('dispute.title')}</h2>
        <p className="">{t('dispute.body')}</p>
      </section>

      <p className="text-gray-500 dark:text-gray-400 mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}
