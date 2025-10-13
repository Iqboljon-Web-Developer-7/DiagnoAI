'use client';

import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('legal.terms');

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 pt-24">
      <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
      <h2 className="text-xl font-semibold mb-6">{t('subtitle')}</h2>

      <section className="mb-6">
        <p className="text-gray-700 mb-4">{t('intro')}</p>
        <p className="text-gray-700 mb-4">{t('public_offer')}</p>
        <p className="text-gray-700 mb-4">{t('acceptance')}</p>
        <p className="text-gray-700 mb-4">{t('agreement')}</p>
        <p className="text-gray-700">{t('validity')}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('terms_and_definitions.title')}</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>{t('terms_and_definitions.1-1')}</li>
          <li>{t('terms_and_definitions.1-2')}</li>
          <li>{t('terms_and_definitions.1-3')}</li>
          <li>{t('terms_and_definitions.1-4')}</li>
          <li>{t('terms_and_definitions.1-5')}</li>
          <li>{t('terms_and_definitions.1-5-1')}</li>
          <li>{t('terms_and_definitions.1-6')}</li>
          <li>{t('terms_and_definitions.1-6-1')}</li>
          <li>{t('terms_and_definitions.1-7')}</li>
          <li>{t('terms_and_definitions.1-8')}</li>
          <li>{t('terms_and_definitions.1-9')}</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('contract_subject.title')}</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>{t('contract_subject.2-1')}</li>
          <li>{t('contract_subject.2-2')}</li>
          <li>{t('contract_subject.2-3')}</li>
          <li>{t('contract_subject.2-4')}</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('service_and_payment_terms.title')}</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>{t('service_and_payment_terms.3-1')}</li>
          <li>{t('service_and_payment_terms.3-2')}</li>
          <li>{t('service_and_payment_terms.3-3')}</li>
          <li>{t('service_and_payment_terms.3-4')}</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('rights_and_obligations.title')}</h2>

        <h3 className="text-lg font-medium mt-4 mb-2">{t('rights_and_obligations.user_rights.title')}</h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>{t('rights_and_obligations.user_rights.4-1-1')}</li>
          <li>{t('rights_and_obligations.user_rights.4-1-2')}</li>
          <li>{t('rights_and_obligations.user_rights.4-1-3')}</li>
        </ul>

        <h3 className="text-lg font-medium mt-4 mb-2">{t('rights_and_obligations.user_obligations.title')}</h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>{t('rights_and_obligations.user_obligations.4-2-1')}</li>
          <li>{t('rights_and_obligations.user_obligations.4-2-2')}</li>
          <li>{t('rights_and_obligations.user_obligations.4-2-3')}</li>
          <li>{t('rights_and_obligations.user_obligations.4-2-4')}</li>
          <li>{t('rights_and_obligations.user_obligations.4-2-5')}</li>
          <li>{t('rights_and_obligations.user_obligations.4-2-6')}</li>
          <li>{t('rights_and_obligations.user_obligations.4-2-7')}</li>
          <li>{t('rights_and_obligations.user_obligations.4-2-8')}</li>
          <li>{t('rights_and_obligations.user_obligations.4-2-9')}</li>
          <li>{t('rights_and_obligations.user_obligations.4-2-10')}</li>
          <li>{t('rights_and_obligations.user_obligations.4-2-11')}</li>
          <li>{t('rights_and_obligations.user_obligations.4-2-12')}</li>
          <li>{t('rights_and_obligations.user_obligations.4-2-13')}</li>
        </ul>

        <h3 className="text-lg font-medium mt-4 mb-2">{t('rights_and_obligations.platform_rights.title')}</h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>{t('rights_and_obligations.platform_rights.4-3-1')}</li>
          <li>{t('rights_and_obligations.platform_rights.4-3-2')}</li>
          <li>{t('rights_and_obligations.platform_rights.4-3-3')}</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('responsibilities.title')}</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>{t('responsibilities.5-1')}</li>
          <li>{t('responsibilities.5-2')}</li>
          <li>{t('responsibilities.5-3')}</li>
          <li>{t('responsibilities.5-4')}</li>
          <li>{t('responsibilities.5-5')}</li>
          <li>{t('responsibilities.5-6')}</li>
          <li>{t('responsibilities.5-7')}</li>
          <li>{t('responsibilities.5-8')}</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('force_majeure.title')}</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>{t('force_majeure.6-1')}</li>
          <li>{t('force_majeure.6-2')}</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('final_provisions.title')}</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>{t('final_provisions.7-1')}</li>
          <li>{t('final_provisions.7-2')}</li>
          <li>{t('final_provisions.7-3')}</li>
          <li>{t('final_provisions.7-4')}</li>
          <li>{t('final_provisions.7-5')}</li>
        </ul>
      </section>

      <p className="text-gray-500 mt-8">
        {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}
