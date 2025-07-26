import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Brain, UserCheck, MessageSquare } from "lucide-react"

export async function HowItWorksSection() {
  const t = await getTranslations('Index');

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12 md:mb-16 text-center sm:text-left">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto sm:mx-0">
            {t('howItWorks.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <Card className="text-center border-2 hover:border-blue-200 transition-colors duration-300">
            <CardHeader className="space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">{t('howItWorks.step1.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-600">{t('howItWorks.step1.description')}</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 hover:border-green-200 transition-colors duration-300">
            <CardHeader className="space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">{t('howItWorks.step2.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-600">{t('howItWorks.step2.description')}</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 hover:border-purple-200 transition-colors duration-300">
            <CardHeader className="space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">{t('howItWorks.step3.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-600">{t('howItWorks.step3.description')}</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 hover:border-orange-200 transition-colors duration-300">
            <CardHeader className="space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">{t('howItWorks.step4.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-600">{t('howItWorks.step4.description')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}