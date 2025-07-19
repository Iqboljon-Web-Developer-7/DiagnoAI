"use client"

import { useTranslations } from 'next-intl';
import { Brain, UserCheck, Clock } from "lucide-react"

export function FeaturesSection() {
  const t = useTranslations('Index');

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {t('features.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* AI Diagnosis */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
              {t('features.aiDiagnosis.title')}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {t('features.aiDiagnosis.description')}
            </p>
          </div>

          {/* Doctor Consultation */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
              {t('features.doctorConsultation.title')}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {t('features.doctorConsultation.description')}
            </p>
          </div>

          {/* Emergency Help */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
              {t('features.emergencyHelp.title')}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {t('features.emergencyHelp.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}