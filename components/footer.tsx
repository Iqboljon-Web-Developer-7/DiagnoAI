import Link from "next/link"
import { Brain } from "lucide-react"
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('Footer')

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">{t('brand')}</span>
            </div>
            <p className="text-gray-400">{t('description')}</p>
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

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  )
}
