import { useTranslations } from 'next-intl';

export default function FAQPage() {
  const t = useTranslations('legal.faq');
  const questions = t.raw('questions');

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <div className="space-y-6">
        {Object.entries(questions).map(([key, faq]) => (
          <div key={key} className="border-b pb-4">
            <h2 className="text-xl font-semibold">{(faq as {question: string}).question}</h2>
            <p className="text-gray-700 mt-2">{(faq as {answer: string}).answer}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
