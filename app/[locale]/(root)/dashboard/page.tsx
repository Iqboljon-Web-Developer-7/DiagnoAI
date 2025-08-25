"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  FileText,
  Calendar,
  MessageSquare,
  BookOpen,
  Settings,
  Upload,
  Download,
  Clock,
  User,
  Heart,
  Activity,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useAppStore } from "@/context/store"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { user, diagnoses, appointments, addAppointment } = useAppStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("diagnoses")
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    console.log(user);
    
    if (!user) {
      router.push("/")
    }
  }, [router, user])

  const handleDownload = (diagnosisId: string) => {
    console.log(diagnosisId);
    setToastMessage("Hisobot yuklab olindi")
    setShowSuccessToast(true)
  }

  const handleReschedule = (appointmentId: string) => {
    console.log(appointmentId);
    setToastMessage("Qayta rejalashtirish oynasi ochildi")
    setShowSuccessToast(true)
  }

  const handleCancel = (appointmentId: string) => {
    console.log(appointmentId);
    setToastMessage("Uchrashish bekor qilindi")
    setShowSuccessToast(true)
  }

  const handleStartConsultation = () => {
    setToastMessage("Yangi maslahat boshlandi")
    setShowSuccessToast(true)
  }

  const handleBookAppointment = () => {
    setIsLoading(true)
    setTimeout(() => {
      addAppointment({
        doctor: "Dr. Nodira Karimova",
        specialty: "Terapevt",
        date: "2024-01-30",
        time: "15:00",
        type: "Onlayn konsultatsiya",
        status: "Tasdiqlangan",
      })
      setIsLoading(false)
      setToastMessage("Qabulga muvaffaqiyatli yozildingiz")
      setShowSuccessToast(true)
    }, 2000)
  }

  const healthStats = [
    { label: "Jami tashxislar", value: diagnoses?.length?.toString(), icon: Brain, color: "blue" },
    { label: "Shifokor uchrashuvlari", value: appointments?.length?.toString(), icon: User, color: "green" },
    { label: "Faol davolanish", value: "2", icon: Heart, color: "red" },
    { label: "Sog&apos;liq ko&apos;rsatkichi", value: "85%", icon: Activity, color: "purple" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Xush kelibsiz, {user?.name}!</h1>
          <p className="text-lg text-gray-600">Sizning shaxsiy tibbiy kabinetingiz</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {healthStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tezkor Harakatlar</CardTitle>
            <CardDescription>Eng ko&apos;p ishlatiladigan xizmatlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/ai-diagnosis">
                <Button className="w-full h-20 bg-blue-600 hover:bg-blue-700 flex-col space-y-2">
                  <Brain className="w-6 h-6" />
                  <span>Yangi Tashxis</span>
                </Button>
              </Link>
              <Link href="/emergency-help">
                <Button className="w-full h-20 bg-red-600 hover:bg-red-700 flex-col space-y-2">
                  <Clock className="w-6 h-6" />
                  <span>Shoshilinch Yordam</span>
                </Button>
              </Link>
              <Link href="/ai-diagnosis">
                <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                  <Upload className="w-6 h-6" />
                  <span>Analiz Yuklash</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full h-20 flex-col space-y-2"
                onClick={handleBookAppointment}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Calendar className="w-6 h-6" />}
                <span>Qabulga Yozilish</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="diagnoses">Mening Tashxislarim</TabsTrigger>
            <TabsTrigger value="appointments">Qabulga Yozilganlar</TabsTrigger>
            <TabsTrigger value="consultations">Maslahatlar</TabsTrigger>
            <TabsTrigger value="library">Sog&apos;liq Kutubxonasi</TabsTrigger>
            <TabsTrigger value="settings">Sozlamalar</TabsTrigger>
          </TabsList>

          {/* Diagnoses Tab */}
          <TabsContent value="diagnoses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>So&apos;nggi Tashxislar</CardTitle>
                <CardDescription>AI yordamida olingan tashxislaringiz tarixi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {diagnoses.map((diagnosis: {
                    id: string;
                    diagnosis: string;
                    date: string;
                    status: string;
                    confidence: number;
                    doctor: string;
                  }) => (
                    <div key={diagnosis.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{diagnosis.diagnosis}</h3>
                          <p className="text-sm text-gray-600">{diagnosis.date}</p>
                        </div>
                        <Badge variant={diagnosis.status === "Tugallangan" ? "default" : "secondary"}>
                          {diagnosis.status}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Ishonchlilik darajasi:</span>
                          <span className="font-medium">{diagnosis.confidence}%</span>
                        </div>
                        <Progress value={diagnosis.confidence} className="h-2" />

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Shifokor:</span>
                          <span className="font-medium">{diagnosis.doctor}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-1" />
                          Batafsil
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownload(diagnosis.id)}>
                          <Download className="w-4 h-4 mr-1" />
                          Yuklab olish
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kelgusi Uchrashuvlar</CardTitle>
                <CardDescription>Shifokorlar bilan rejalashtirilgan uchrashuvlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment: {
                    id: string;
                    doctor: string;
                    specialty: string;
                    date: string;
                    time: string;
                    type: string;
                    status: string;
                  }) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                          <p className="text-sm text-blue-600">{appointment.specialty}</p>
                        </div>
                        <Badge variant={appointment.status === "Tasdiqlangan" ? "default" : "secondary"}>
                          {appointment.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Sana:</span>
                          <p className="font-medium">{appointment.date}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Vaqt:</span>
                          <p className="font-medium">{appointment.time}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Turi:</span>
                          <p className="font-medium">{appointment.type}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" onClick={() => handleReschedule(appointment.id)}>
                          <Calendar className="w-4 h-4 mr-1" />
                          Qayta rejalashtirish
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCancel(appointment.id)}>
                          Bekor qilish
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consultations Tab */}
          <TabsContent value="consultations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shifokor Maslahatlar</CardTitle>
                <CardDescription>Shifokorlar bilan yozishmalar va maslahatlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Hozircha faol maslahatlar yo&apos;q</p>
                  <Button onClick={handleStartConsultation}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Yangi maslahat boshlash
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sog&apos;liq Kutubxonasi</CardTitle>
                <CardDescription>Foydali maqolalar, videolar va elektron kitoblar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold mb-2">Viral infeksiyalar</h3>
                    <p className="text-sm text-gray-600 mb-3">ARVI va gripp haqida to&apos;liq ma&apos;lumot</p>
                    <Button size="sm" variant="outline">
                      O&apos;qish
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <BookOpen className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="font-semibold mb-2">Sog&apos;lom turmush tarzi</h3>
                    <p className="text-sm text-gray-600 mb-3">Sog&apos;lom ovqatlanish va sport</p>
                    <Button size="sm" variant="outline">
                      O&apos;qish
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <BookOpen className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-semibold mb-2">Stress boshqaruvi</h3>
                    <p className="text-sm text-gray-600 mb-3">Ruhiy salomatlik va stress</p>
                    <Button size="sm" variant="outline">
                      O&apos;qish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil Sozlamalari</CardTitle>
                <CardDescription>Shaxsiy ma&apos;lumotlar va xizmat sozlamalari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h3 className="font-medium">Shaxsiy ma&apos;lumotlar</h3>
                      <p className="text-sm text-gray-600">Ism, telefon, email</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Tahrirlash
                    </Button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h3 className="font-medium">Xavfsizlik</h3>
                      <p className="text-sm text-gray-600">Parol va ikki bosqichli autentifikatsiya</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Sozlash
                    </Button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h3 className="font-medium">Bildirishnomalar</h3>
                      <p className="text-sm text-gray-600">Email va SMS xabarnomalar</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Boshqarish
                    </Button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-medium">Maxfiylik</h3>
                      <p className="text-sm text-gray-600">Ma&apos;lumotlar maxfiyligi va ruxsatlar</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Ko&apos;rish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showSuccessToast && (
        <>
          {toast({
            title: toastMessage,
          })}
        </>
      )}
    </div>
  )
}
