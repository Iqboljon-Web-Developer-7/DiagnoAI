"use client"

import { Check, Clock, FileText, Heart, Stethoscope } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

interface PackageModalProps {
  package: {
    id: number
    nameKey: string
    subtitleKey?: string
    duration: number
    tests: number
    price: number
    color: string
    priceLabel?: string
  }
}

function PackageModal({ package: pkg }: PackageModalProps) {
  const t = useTranslations()

  const details = t.raw(`packageDetails.${pkg.id}`) as {
    description?: string
    examinations?: string[]
    benefits?: string[]
    includes?: string[]
  } | null

  const examinations = details && Array.isArray(details.examinations) ? details.examinations : []
  const benefits = details && Array.isArray(details.benefits) ? details.benefits : []
  const includes = details && Array.isArray(details.includes) ? details.includes : []
  const description = details && typeof details.description === "string" ? details.description : ""

  return (
    <div className="invisibleScrollbar shadow-inset-deep max-w-4xl w-full max-h-[90vh] overflow-auto bg-slate-200 dark:bg-slate-800 rounded-2xl border-transparent">
      <div className={`bg-gradient-to-br ${pkg.color} py-6 sm:py-8 md:py-12 px-4 sm:px-5 md:px-6 rounded-t-lg`}> 
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
          {t(pkg.nameKey)}
        </h2>
        {pkg.subtitleKey && (
          <p className="text-white text-xs sm:text-sm md:text-base text-opacity-90">{t(pkg.subtitleKey)}</p>
        )}
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 leading-relaxed">
          {description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center">
              <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-sm sm:text-base md:text-xl">{t("packages.keyExaminations")}</span>
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {examinations.map((exam: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 dark:text-green-400 mr-2 sm:mr-3 mt-0.5 shrink-0" />
                  <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                    {exam}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600 dark:text-red-400 shrink-0" />
              <span className="text-sm sm:text-base md:text-xl">{t("packages.healthBenefits")}</span>
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {benefits.map((benefit: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 dark:text-green-400 mr-2 sm:mr-3 mt-0.5 shrink-0" />
                  <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gradient from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            {t("packages.packageIncludes")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {includes.map((item: string, idx: number) => (
              <div key={idx} className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/50 mx-auto mb-2 flex items-center justify-center">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 dark:text-green-400" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-5 md:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-1">{t("packages.programPrice")}</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 break-words">
                {pkg.priceLabel && (
                  <span className="text-sm sm:text-base md:text-lg font-normal text-gray-500 dark:text-gray-400">
                    from{" "}
                  </span>
                )}
                {new Intl.NumberFormat("en-US").format(pkg.price)}{" "}
                <span className="text-sm sm:text-base md:text-lg font-normal text-gray-500 dark:text-gray-400">
                  UZS
                </span>
              </p>
              <div className="flex items-center flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {pkg.duration} {t("packages.duration")}
                </span>
                <span className="flex items-center">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {pkg.tests} {t("packages.tests")}
                </span>
              </div>
            </div>
            <a href="mailto:contactdiagnoai@gmail.com" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                className="w-full cursor-pointer hover:text-slate-200 bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
              >
                {t("packages.bookNow")}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackageModal
