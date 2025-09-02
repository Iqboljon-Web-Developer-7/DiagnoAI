"use client"

import Link from "next/link"
import { useState } from 'react'
import { useTranslations } from "next-intl"
import { usePathname } from "@/i18n/navigation"
import { ArrowDown, ArrowUp } from "lucide-react"

export function Footer() {
  const t = useTranslations('Footer')
  const [openSection, setOpenSection] = useState<string | null>(null)

  const pathname = usePathname()

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <footer className={`bg-[#274c77] text-white py-12 z-20 relative ${pathname == '/ai-diagnosis' || pathname == '/auth/register' || pathname == '/auth/login' ? 'hidden' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-3 md:gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold">{t("brand")}</h2>
            <p className="text-indigo-100">{t('description')}</p>
          </div>

          <div className="md:block">
            <button
              onClick={() => toggleSection('services')}
              className="w-full flex text-xl justify-between items-center font-semibold md:cursor-default md:pointer-events-none"
            >
              {t('services.title')}
              <span className="md:hidden">{openSection === 'services'  ? <ArrowUp size={18}/> : <ArrowDown size={18} />}</span>
            </button>
            <ul className={`text-sm sm:text-base space-y-2 mt-2 text-gray-300 overflow-hidden transition-all duration-300 ${openSection === 'services' ? 'max-h-[500px]' : 'md:max-h-[500px] max-h-0'}`}>
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
            </ul>
          </div>

          <div className="md:block">
            <button
              onClick={() => toggleSection('company')}
              className="w-full flex text-xl justify-between items-center font-semibold md:cursor-default md:pointer-events-none"
            >
              {t('company.title')}
              <span className="md:hidden">{openSection === 'company' ? <ArrowUp size={18}/> : <ArrowDown size={18} />}</span>
            </button>
            <ul className={`text-sm sm:text-base space-y-2 mt-2 text-gray-300 overflow-hidden transition-all duration-300 ${openSection === 'company' ? 'max-h-[500px]' : 'md:max-h-[500px] max-h-0'}`}>
              <li>
                <Link href="/about-us" className="hover:text-white">
                  {t('company.about')}
                </Link>
              </li>
              <li>
                <Link href="mailto:contactdiagnoai@gmail.com" className="hover:text-white">
                  {t('company.contact')}
                </Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-white">
                  {t('education')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:block">
            <button
              onClick={() => toggleSection('help')}
              className="w-full flex text-xl justify-between items-center font-semibold md:cursor-default md:pointer-events-none"
            >
              {t('help.title')}
              <span className="md:hidden">{openSection === 'help' ? <ArrowUp size={18}/> : <ArrowDown size={18} />}</span>
            </button>
            <ul className={`text-sm sm:text-base space-y-2 mt-2 text-gray-300 overflow-hidden transition-all duration-300 ${openSection === 'help' ? 'max-h-[500px]' : 'md:max-h-[500px] max-h-0'}`}>
              <li>
                <Link href="mailto:contactdiagnoai@gmail.com" className="hover:text-white">
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

      </div>
        <div className="border-t border-indigo-400 mt-8 pt-8 text-center text-gray-300">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        </div>
    </footer>
  )
}
