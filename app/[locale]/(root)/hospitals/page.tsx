import { Card, CardContent } from "@/components/ui/card"
import ClientHospitalsPage from "./ClientHospitalPage"
import { getTranslations } from "next-intl/server"

export default async function HospitalsPage() {
  const t = await getTranslations("hospitals")
  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("pageTitle") || "Find a Hospital"}</h1>
          <p className="text-xl text-gray-600">{t("pageDescription") || "Explore top hospitals near you"}</p>
        </div>

        <Card className="mb-8 bg-transparent border-none">
          <CardContent className="p-4">
            <ClientHospitalsPage />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}