"use client"

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Brain, UserCheck, MessageSquare, Star, Shield, Clock, Users, Quote, Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
// import { Header } from "@/components/header"
// import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import { useState } from "react"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  const t = useTranslations('Index');
  const router = useRouter()
  const { isLoggedIn } = useAppContext()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  
  // const handleGetDiagnosis = () => {
  //   if (isLoggedIn) {
  //     router.push("/ai-diagnosis")
  //   } else {
  //     setIsLoginModalOpen(true)
  //   }
  // }

  const handleGetDiagnosis = () => {
    if (isLoggedIn) {
      router.push("/ai-diagnosis")
    } else {
      setIsLoginModalOpen(true)
    }
  }

  const handleEmergencyHelp = () => {
    router.push("/emergency-help")
  }

  const handleUploadAnalysis = () => {
    if (isLoggedIn) {
      router.push("/ai-diagnosis")
    } else {
      setIsLoginModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                {t('hero.title')}
                <span className="text-blue-200 block sm:inline"> {t('hero.titleHighlight')}</span>
              </h1>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto lg:mx-0">
                {t('hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm sm:text-base" onClick={handleGetDiagnosis}>
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t('hero.getDiagnosis')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-black hover:bg-white hover:text-blue-600 text-sm sm:text-base"
                  onClick={handleUploadAnalysis}
                >
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t('hero.uploadAnalysis')}
                </Button>
                <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base" onClick={handleEmergencyHelp}>
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t('hero.emergencyHelp')}
                </Button>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-base sm:text-lg">{t('features.uploadAnalysis')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-base sm:text-lg">{t('features.aiAnalysis')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-base sm:text-lg">{t('features.findDoctor')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-base sm:text-lg">{t('features.consultation')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t('howItWorks.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('features.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* AI Diagnosis */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
                {t('features.aiDiagnosis.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {t('features.aiDiagnosis.description')}
              </p>
            </div>

            {/* Doctor Consultation */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
                {t('features.doctorConsultation.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {t('features.doctorConsultation.description')}
              </p>
            </div>

            {/* Emergency Help */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
                {t('features.emergencyHelp.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {t('features.emergencyHelp.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('testimonials.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 relative">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-blue-200" />
              </div>
              <div className="mb-6">
                <p className="text-gray-600 text-sm sm:text-base italic">
                  {t('testimonials.testimonial1.content')}
                </p>
              </div>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage src="/testimonial1.jpg" alt={t('testimonials.testimonial1.name')} />
                  <AvatarFallback>T1</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {t('testimonials.testimonial1.name')}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {t('testimonials.testimonial1.role')}
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 relative">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-blue-200" />
              </div>
              <div className="mb-6">
                <p className="text-gray-600 text-sm sm:text-base italic">
                  {t('testimonials.testimonial2.content')}
                </p>
              </div>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage src="/testimonial2.jpg" alt={t('testimonials.testimonial2.name')} />
                  <AvatarFallback>T2</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {t('testimonials.testimonial2.name')}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {t('testimonials.testimonial2.role')}
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 relative">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-blue-200" />
              </div>
              <div className="mb-6">
                <p className="text-gray-600 text-sm sm:text-base italic">
                  {t('testimonials.testimonial3.content')}
                </p>
              </div>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage src="/testimonial3.jpg" alt={t('testimonials.testimonial3.name')} />
                  <AvatarFallback>T3</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {t('testimonials.testimonial3.name')}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {t('testimonials.testimonial3.role')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-10 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 text-sm sm:text-base px-8"
                onClick={handleGetDiagnosis}
              >
                {t('cta.primaryButton')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-black hover:bg-white hover:text-blue-600 text-sm sm:text-base px-8"
                onClick={handleEmergencyHelp}
              >
                {t('cta.secondaryButton')}
              </Button>
            </div>
          </div>
        </div>
      </section>
     

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => router.push("/ai-diagnosis")}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={() => {
          setIsRegisterModalOpen(false)
          setIsLoginModalOpen(true)
        }}
        onSuccess={() => router.push("/ai-diagnosis")}
      />
    </div>
  )
}