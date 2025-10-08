import { serverFetch } from "@/app/actions";
import { getTranslations } from "next-intl/server";
import { DoctorList } from "./DoctorList";
import { Doctor } from "./types";
import { StethoscopeIcon } from "lucide-react";

export default async function Page({params}: {params:Promise<{ locale: string }>}) {
  const { locale } = await params;

  const t = await getTranslations("doctors")

  const doctors:Doctor[] = await serverFetch(`/api/${locale}/doctors/`)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-12">
      <div className="max-w-[100rem] mx-auto px-2 py-4 sm:py-6 sm:px-6 lg:px-8 lg:py-8 mt-2">
         <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <StethoscopeIcon className="w-4 h-4" />
            <span>{t("badgeTitle")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t("pageTitle")}
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t("pageDescription")}
          </p>
        </div>
        {/* <div className="sm:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('pageTitle') || 'Find a Doctor'}
          </h1>
          <p className="sm:text-xl text-gray-600 dark:text-gray-300">
            {t('pageDescription') || 'Book appointments with top doctors'}
          </p>
        </div> */}

        <DoctorList doctors={doctors!} />
      </div>
    </div>
  );
}