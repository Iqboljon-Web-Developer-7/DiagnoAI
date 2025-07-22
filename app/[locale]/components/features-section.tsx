"use client"

import { useTranslations } from 'next-intl';
import { Brain, UserCheck, Clock } from "lucide-react"

export function FeaturesSection() {
  const t = useTranslations('Index');

  return (
    <section className="py-8 xs:py-10 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="mb-8 xs:mb-10 sm:mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 xs:mb-4">
            {t('features.title')}
          </h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl">
            {t('features.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8 lg:gap-12">
          {/* AI Diagnosis */}
          <div className="bg-white rounded-xl p-4 xs:p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-3 xs:mb-4 sm:mb-6">
              <Brain className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600" />
            </div>
            <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold mb-2 xs:mb-3 text-gray-900">
              {t('features.aiDiagnosis.title')}
            </h3>
            <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-gray-600">
              {t('features.aiDiagnosis.description')}
            </p>
          </div>

          {/* Doctor Consultation */}
          <div className="bg-white rounded-xl p-4 xs:p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-100 rounded-lg flex items-center justify-center mb-3 xs:mb-4 sm:mb-6">
              <UserCheck className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600" />
            </div>
            <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold mb-2 xs:mb-3 text-gray-900">
              {t('features.doctorConsultation.title')}
            </h3>
            <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-gray-600">
              {t('features.doctorConsultation.description')}
            </p>
          </div>

          {/* Emergency Help */}
          <div className="bg-white rounded-xl p-4 xs:p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-red-100 rounded-lg flex items-center justify-center mb-3 xs:mb-4 sm:mb-6">
              <Clock className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-600" />
            </div>
            <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold mb-2 xs:mb-3 text-gray-900">
              {t('features.emergencyHelp.title')}
            </h3>
            <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-gray-600">
              {t('features.emergencyHelp.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}