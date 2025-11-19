import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { getPackageById, packages } from "../data"
import { Check, Clock, FileText, Heart, Stethoscope, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { locales } from "@/i18n"

interface PackageDetailPageProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

// Generate static params for all packages
export async function generateStaticParams() {
  const params: { locale: string; id: string }[] = []
  
  locales.forEach((locale) => {
    packages.forEach((pkg) => {
      params.push({
        locale,
        id: pkg.id.toString(),
      })
    })
  })
  
  return params
}

// Metadata generation
export async function generateMetadata({ params }: PackageDetailPageProps) {
  const { id } = await params
  const pkg = getPackageById(parseInt(id))
  
  if (!pkg) {
    return {
      title: "Package Not Found",
    }
  }

  return {
    title: `${pkg.nameKey} Package - DiagnoAI`,
    description: pkg.description,
  }
}

async function PackageDetailContent({ 
  packageData, 
  locale 
}: { 
  packageData: ReturnType<typeof getPackageById>
  locale: string 
}) {
  const t = await getTranslations({ locale })

  if (!packageData) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US").format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 pt-16">
      {/* Hero Section with animated gradient */}
      <div 
        className={`relative bg-gradient-to-br ${packageData.color} py-16 sm:py-20 md:py-24 overflow-hidden animate-in fade-in duration-700`}
      >
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <pattern
              id={`pattern-${packageData.id}`}
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
              <circle cx="12" cy="12" r="1" fill="white" />
              <rect x="5" y="5" width="2" height="2" fill="white" />
              <rect x="15" y="15" width="2" height="2" fill="white" />
            </pattern>
            <rect
              width="100"
              height="100"
              fill={`url(#pattern-${packageData.id})`}
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            href="/pakets"
            className="inline-flex items-center text-white hover:text-white/80 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base">{t("packages.title")}</span>
          </Link>

          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-in slide-in-from-bottom-4 duration-700"
            style={{
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            {t(packageData.nameKey)}
          </h1>
          {packageData.subtitleKey && (
            <p className="text-white text-lg sm:text-xl md:text-2xl opacity-90 animate-in slide-in-from-bottom-5 duration-700 delay-100">
              {t(packageData.subtitleKey)}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12 animate-in slide-in-from-bottom-6 duration-700 delay-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t("packages.duration")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {packageData.duration} {t("packages.duration")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t("packages.tests")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {packageData.tests} {t("packages.tests")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 mb-8 sm:mb-12 animate-in slide-in-from-bottom-7 duration-700 delay-300">
          <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed">
            {packageData.description}
          </p>
        </div>

        {/* Examinations & Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 animate-in slide-in-from-left duration-700 delay-400">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl mr-3">
                <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              {t("packages.keyExaminations")}
            </h3>
            <ul className="space-y-4">
              {packageData.examinations.map((exam: string, idx: number) => (
                <li 
                  key={idx} 
                  className="flex items-start group animate-in slide-in-from-left duration-500"
                  style={{ animationDelay: `${400 + idx * 50}ms` }}
                >
                  <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg mr-3 mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    {exam}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 animate-in slide-in-from-right duration-700 delay-400">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl mr-3">
                <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              {t("packages.healthBenefits")}
            </h3>
            <ul className="space-y-4">
              {packageData.benefits.map((benefit: string, idx: number) => (
                <li 
                  key={idx} 
                  className="flex items-start group animate-in slide-in-from-right duration-500"
                  style={{ animationDelay: `${400 + idx * 50}ms` }}
                >
                  <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg mr-3 mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Package Includes */}
        <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 mb-8 sm:mb-12 animate-in slide-in-from-bottom-8 duration-700 delay-500">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            {t("packages.packageIncludes")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {packageData.includes.map((item: string, idx: number) => (
              <div 
                key={idx} 
                className="text-center group animate-in zoom-in duration-500"
                style={{ animationDelay: `${500 + idx * 100}ms` }}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-gray-700 rounded-2xl shadow-md mx-auto mb-3 flex items-center justify-center group-hover:scale-110 group-hover:shadow-xl transition-all">
                  <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 dark:text-green-400" />
                </div>
                <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 leading-tight">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 animate-in slide-in-from-bottom-9 duration-700 delay-600">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-2">
                {t("packages.programPrice")}
              </p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                {packageData.priceLabel && (
                  <span className="text-lg sm:text-xl font-normal text-gray-500 dark:text-gray-400">
                    from{" "}
                  </span>
                )}
                {formatPrice(packageData.price)}{" "}
                <span className="text-lg sm:text-xl font-normal text-gray-500 dark:text-gray-400">
                  UZS
                </span>
              </p>
            </div>
            <a 
              href="mailto:contactdiagnoai@gmail.com" 
              className="w-full lg:w-auto"
            >
              <Button
                size="lg"
                className="w-full lg:w-auto text-lg px-8 py-6 bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
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

export default async function PackageDetailPage({ params }: PackageDetailPageProps) {
  const { id, locale } = await params
  const packageData = getPackageById(parseInt(id))

  if (!packageData) {
    notFound()
  }

  return <PackageDetailContent packageData={packageData} locale={locale} />
}
