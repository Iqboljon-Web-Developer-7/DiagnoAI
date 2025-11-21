import { getTranslations } from "next-intl/server";
import { DoctorList } from "./DoctorList";
import { serverFetch } from "@/app/actions";
import { Doctor } from "./types";

export default async function Page({params}: {params:Promise<{ locale: string }>}) {
  const { locale } = await params;

  const doctors:Doctor[] = await serverFetch(`/api/${locale}/doctors/`)
  const t = await getTranslations("doctors")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-12">
      <div className="max-w-400 mx-auto px-2 py-4 sm:py-6 sm:px-6 lg:px-8 lg:py-8 mt-2">
         <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t("pageTitle")}
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t("pageDescription")}
          </p>
        </div>

        <DoctorList doctors={doctors!} />
      </div>
    </div>
  );
}