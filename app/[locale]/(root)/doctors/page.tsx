import { serverFetch } from "@/app/actions";
import { getTranslations } from "next-intl/server";
import { DoctorList } from "./DoctorList";
import { Doctor } from "./types";

export default async function Page({params}: {params:Promise<{ locale: string }>}) {
  const { locale } = await params;

  const t = await getTranslations("doctors")

  const doctors:Doctor[] = await serverFetch(`/api/${locale}/doctors/`)

  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      <div className="max-w-[100rem] mx-auto px-2 py-4 sm:py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="sm:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('pageTitle') || 'Find a Doctor'}
          </h1>
          <p className="sm:text-xl text-gray-600">
            {t('pageDescription') || 'Book appointments with top doctors'}
          </p>
        </div>

        <DoctorList doctors={doctors!} />
      </div>
    </div>
  );
}