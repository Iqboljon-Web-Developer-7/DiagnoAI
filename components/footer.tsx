import Link from "next/link"
import { getTranslations } from 'next-intl/server'

export async function Footer() {
  const t = await getTranslations('Footer')

  return (
    <footer className="bg-[#2B6A73] text-white py-12 z-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold">{t("brand")}</h2>
            <p className="text-indigo-100">{t('description')}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('services.title')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/ai-diagnosis" className="hover:text-white">
                  {t('services.aiDiagnosis')}
                </Link>
              </li>
              <li>
                <Link href="/emergency-help" className="hover:text-white">
                  {t('services.emergencyHelp')}
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-white">
                  {t('services.doctors')}
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="hover:text-white">
                  {t('services.consultation')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('company.title')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  {t('company.about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  {t('company.contact')}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  {t('company.careers')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  {t('company.blog')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('help.title')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/support" className="hover:text-white">
                  {t('help.support')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  {t('help.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  {t('help.terms')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  {t('help.faq')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white mt-8 pt-8 text-center text-gray-400">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  )
}
