"use client"

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Brain, UserCheck, MessageSquare } from "lucide-react"

export function HowItWorksSection() {
  const t = useTranslations('Index');

  return (
    <section className="py-12 bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t('howItWorks.title')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl">
            {t('howItWorks.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">{t('howItWorks.step1.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{t('howItWorks.step1.description')}</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 hover:border-green-200 transition-colors">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">{t('howItWorks.step2.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{t('howItWorks.step2.description')}</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 hover:border-purple-200 transition-colors">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">{t('howItWorks.step3.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{t('howItWorks.step3.description')}</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 hover:border-orange-200 transition-colors">
            <CardHeader>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">{t('howItWorks.step4.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{t('howItWorks.step4.description')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}