"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Brain, UserCheck, MessageSquare, Star, Shield, Clock, Users } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import { useState } from "react"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"

export default function HomePage() {
  const router = useRouter()
  const { isLoggedIn } = useAppContext()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

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
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Sizning salomatligingiz uchun
                <span className="text-blue-200"> sun'iy intellekt</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Analizni yuklang, tahlil qiling va shifokor tavsiyalarini oling. AI yordamida tez va aniq tashxis olish
                imkoniyati.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleGetDiagnosis}>
                  <Upload className="w-5 h-5 mr-2" />
                  Tashxis olish
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={handleUploadAnalysis}
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Analizni yuklash
                </Button>
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleEmergencyHelp}>
                  <Clock className="w-5 h-5 mr-2" />
                  Shoshilinch yordam
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg">Analiz yuklash</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg">AI tahlil qilish</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg">Shifokor topish</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg">Konsultatsiya</span>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Qanday ishlaydi?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              4 oddiy qadamda professional tibbiy tahlil va shifokor tavsiyalarini oling
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">1. Analiz yuklash</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Tibbiy analizlaringizni, rasmlarni yoki simptomlaringizni yuklang</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">2. AI tahlil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Sun'iy intellekt ma'lumotlaringizni chuqur tahlil qiladi</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">3. Shifokor topish</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Sizning holatiga mos mutaxassislarni tavsiya qilamiz</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">4. Konsultatsiya</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Shifokor bilan onlayn yoki oflayn uchrashuvni belgilang</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Nega Diagno AI?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Ishonchli va xavfsiz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Barcha ma'lumotlar shifrlangan va tibbiy standartlarga mos ravishda saqlanadi
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Clock className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>24/7 mavjud</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Istalgan vaqtda tashxis olish va shoshilinch yordam xizmatlari</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Professional shifokorlar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Tajribali mutaxassislar bilan to'g'ridan-to'g'ri bog'lanish imkoniyati</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Foydalanuvchilar fikri</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <CardTitle className="text-lg">Anvar Karimov</CardTitle>
                <CardDescription>Toshkent</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "Diagno AI yordamida tez va aniq tashxis oldim. Shifokor tavsiyalari juda foydali bo'ldi."
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <CardTitle className="text-lg">Malika Rahimova</CardTitle>
                <CardDescription>Samarqand</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "Shoshilinch yordam bo'limi hayotimni saqlab qoldi. Juda tez va professional xizmat."
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <CardTitle className="text-lg">Bobur Toshmatov</CardTitle>
                <CardDescription>Buxoro</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">"AI tahlili juda aniq. Shifokor bilan onlayn konsultatsiya ham qulay."</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Bugun salomatligingizga g'amxo'rlik qiling</h2>
          <p className="text-xl text-blue-100 mb-8">
            AI yordamida tez tashxis oling va professional shifokorlar bilan bog'laning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handleGetDiagnosis}>
              Bepul tashxis olish
            </Button>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Batafsil ma'lumot
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

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
