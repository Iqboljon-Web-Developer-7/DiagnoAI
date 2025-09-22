import { serverFetch } from "@/app/actions";
import { getTranslations } from "next-intl/server";
import { DoctorList } from "./DoctorList";
import { Doctor } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default async function Page({params}: {params:Promise<{ locale: string }>}) {
  const { locale } = await params;

  console.log(locale);
  

  const t = await getTranslations("doctors")

  const doctors:Doctor[] = await serverFetch(`${BASE_URL}/api/${locale}/doctors/`)

  console.log(`${BASE_URL}/api/${locale}/doctors/`);
  

  console.log(doctors);
  

  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      <div className="max-w-7xl mx-auto px-2 py-4 sm:py-6 sm:px-6 lg:px-8 lg:py-8">
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