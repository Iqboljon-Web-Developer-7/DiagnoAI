import { useTranslations } from "next-intl"
import PackageCard from "./components/PackageCard"


const packages = [
  {
    id: 1,
    nameKey: "packageNames.basic",
    duration: 2,
    tests: 47,
    price: 2500000,
    color: "from-slate-400 to-slate-500",
  },
  {
    id: 2,
    nameKey: "packageNames.silver",
    duration: 3,
    tests: 55,
    price: 4500000,
    color: "from-slate-300 to-slate-400",
    priceLabel: "from",
  },
  {
    id: 3,
    nameKey: "packageNames.gold",
    duration: 4,
    tests: 67,
    price: 7700000,
    color: "from-yellow-600 to-yellow-700",
  },
  {
    id: 4,
    nameKey: "packageNames.platinum",
    duration: 5,
    tests: 71,
    price: 12000000,
    color: "from-slate-700 to-slate-900",
  },
  {
    id: 5,
    nameKey: "packageNames.light",
    subtitleKey: "packageSubtitles.womenCheckup",
    duration: 2,
    tests: 27,
    price: 1970000,
    color: "from-rose-900 to-rose-950",
  },
  {
    id: 6,
    nameKey: "packageNames.full",
    subtitleKey: "packageSubtitles.womenCheckup",
    duration: 2.5,
    tests: 58,
    price: 3980000,
    color: "from-rose-800 to-rose-900",
  },
  {
    id: 7,
    nameKey: "packageNames.cardio",
    subtitleKey: "packageSubtitles.cardioCheckup",
    duration: 2,
    tests: 24,
    price: 1880000,
    color: "from-emerald-900 to-emerald-950",
  },
]

function PackagesPage() {
  const t = useTranslations()

  return (
    <div className="pt-16 min-h-screen bg-gradient from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6 px-2">
            {t("packages.title")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-3 sm:px-4">
            {t("packages.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>

      </main>
    </div>
  )
}

export default PackagesPage
