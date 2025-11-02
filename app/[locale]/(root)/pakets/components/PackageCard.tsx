"use client"

import { Clock, FileText } from "lucide-react"
import { useState } from "react"
import PackageModal from "./PackageModal"
import { useTranslations } from "next-intl"

interface PackageProps {
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

function PackageCard({ package: pkg }: PackageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const t = useTranslations()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US").format(price)
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden transition-all duration-300 hover:shadow-2xl dark:hover:shadow-gray-900/70 hover:-translate-y-1">
        <div
          className={`relative h-32 sm:h-40 md:h-48 bg-gradient-to-br ${pkg.color} flex items-center justify-center overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id={`pattern-${pkg.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
                <circle cx="12" cy="12" r="1" fill="white" />
                <rect x="5" y="5" width="2" height="2" fill="white" />
                <rect x="15" y="15" width="2" height="2" fill="white" />
              </pattern>
              <rect width="100" height="100" fill={`url(#pattern-${pkg.id})`} />
            </svg>
          </div>

          <div className="relative text-center z-10 px-2 sm:px-4">
            <h3
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 tracking-wide"
              style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              {t(pkg.nameKey)}
            </h3>
            {pkg.subtitleKey && (
              <p className="text-white text-xs sm:text-sm opacity-90 px-2 sm:px-4">
                {t(pkg.subtitleKey)}
              </p>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-around mb-4 sm:mb-5 md:mb-6 pb-4 sm:pb-5 md:pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-1.5 sm:p-2 rounded-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {t("packages.duration")}
                </p>
                <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {pkg.duration} {t("packages.duration")}
                </p>
              </div>
            </div>

            <div className="w-px h-8 sm:h-10 md:h-12 bg-gray-200 dark:bg-gray-700 mx-2"></div>

            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-1.5 sm:p-2 rounded-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {t("packages.tests")}
                </p>
                <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {pkg.tests} {t("packages.tests")}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4 sm:mb-5 md:mb-6">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 break-words">
              {pkg.priceLabel && (
                <span className="text-sm sm:text-base md:text-lg font-normal text-gray-500 dark:text-gray-400">
                  from{" "}
                </span>
              )}
              {formatPrice(pkg.price)}{" "}
              <span className="text-sm sm:text-base md:text-lg font-normal text-gray-500 dark:text-gray-400">
                UZS
              </span>
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg dark:shadow-blue-900/50"
          >
            {t("packages.learnMore")}
          </button>
        </div>
      </div>

      <PackageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} package={pkg} />
    </>
  )
}

export default PackageCard
