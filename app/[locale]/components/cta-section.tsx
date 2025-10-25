import { getTranslations } from 'next-intl/server';
import { Button } from "@/components/ui/button"
import { Link } from '@/i18n/navigation'

export async function CTASection() {
  const t = await getTranslations('Index');

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-linear-to-br from-blue-600 to-blue-800 text-white dark:from-blue-900 dark:to-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-10 max-w-2xl mx-auto dark:text-blue-200">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/ai-diagnosis" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant={'outline'}
                className="w-full bg-worm-grey dark:bg-worm-dark text-blue-600 hover:bg-blue-50 text-sm sm:text-base px-8  dark:text-blue-500 dark:hover:bg-gray-200"
              >
                {t('cta.primaryButton')}
              </Button>
            </Link>
            <Link href="/about-us" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="default"
                className="w-full bg-blue-400 dark:border-none border-white text-black hover:bg-white hover:text-blue-600 text-sm sm:text-base px-8 dark:border-gray-300 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-blue-400"
              >
                {t('cta.secondaryButton')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}