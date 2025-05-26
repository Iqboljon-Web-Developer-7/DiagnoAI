"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Phone, MapPin, Clock, Mic, Upload, Brain, Navigation } from "lucide-react"
import Link from "next/link"

export default function EmergencyHelpPage() {
  const [symptoms, setSymptoms] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [emergencyLevel, setEmergencyLevel] = useState<"low" | "medium" | "high" | null>(null)

  const handleEmergencyAnalysis = () => {
    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setEmergencyLevel("high") // Simulate high emergency
    }, 2000)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  return (
    <div className="min-h-screen bg-red-50">
      {/* Emergency Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xl font-bold">Diagno AI - Shoshilinch Yordam</span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-red-700 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">24/7 Faol</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Alert */}
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h2 className="text-lg font-bold text-red-800">Shoshilinch Tibbiy Yordam</h2>
              <p className="text-red-700">Agar hayotingiz xavf ostida bo'lsa, darhol 103 raqamiga qo'ng'iroq qiling!</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Emergency Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Emergency Buttons */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Tezkor Yordam</CardTitle>
                <CardDescription>Umumiy shoshilinch holatlar uchun tezkor tugmalar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 h-auto py-4">
                    <div className="text-center">
                      <AlertTriangle className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-sm font-medium">Yurak og'rig'i</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 h-auto py-4">
                    <div className="text-center">
                      <AlertTriangle className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-sm font-medium">Nafas olishda qiyinchilik</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 h-auto py-4">
                    <div className="text-center">
                      <AlertTriangle className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-sm font-medium">Bosh aylanishi</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 h-auto py-4">
                    <div className="text-center">
                      <AlertTriangle className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-sm font-medium">Kuchli qon ketish</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Symptom Description */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Holatni Tasvirlang</CardTitle>
                <CardDescription>
                  Hozirgi holatingizdagi simptomlarni batafsil yozing yoki ovozli xabar yuboring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Qanday simptomlar bor? Qachondan boshlab? Og'riq darajasi qanday? Batafsil yozing..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-32 border-red-200 focus:border-red-400"
                />

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={toggleRecording}
                    className={`flex-1 ${isRecording ? "bg-red-100 border-red-400" : "border-red-200"}`}
                  >
                    <Mic className={`w-4 h-4 mr-2 ${isRecording ? "text-red-600" : ""}`} />
                    {isRecording ? "Yozuv to'xtatish" : "Ovozli xabar"}
                  </Button>

                  <Button variant="outline" className="border-red-200">
                    <Upload className="w-4 h-4 mr-2" />
                    Rasm yuklash
                  </Button>
                </div>

                {isRecording && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="text-red-700 text-sm">Ovoz yozilmoqda...</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency Analysis */}
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <Button
                  onClick={handleEmergencyAnalysis}
                  disabled={isAnalyzing || (!symptoms.trim() && !isRecording)}
                  className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="w-5 h-5 mr-2 animate-spin" />
                      Shoshilinch tahlil qilinmoqda...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Shoshilinch Tahlil Qilish
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Results */}
          <div className="space-y-6">
            {emergencyLevel ? (
              <>
                {/* Emergency Level */}
                <Card className="border-red-300 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-800 flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Shoshilinchlik Darajasi</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <Badge className="bg-red-600 text-white text-lg px-4 py-2 mb-3">YUQORI XAVF</Badge>
                      <p className="text-red-800 font-medium mb-4">Darhol tibbiy yordam kerak!</p>
                      <div className="space-y-2">
                        <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                          <Phone className="w-5 h-5 mr-2" />
                          103 ga qo'ng'iroq qilish
                        </Button>
                        <Button variant="outline" className="w-full border-red-300 text-red-700" size="lg">
                          <Navigation className="w-5 h-5 mr-2" />
                          Eng yaqin shifoxona
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Immediate Actions */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-800">Darhol Bajariladigan Harakatlar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3 text-sm">
                      <li className="flex items-start space-x-2">
                        <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <span>Xotirjam bo'ling va chuqur nafas oling</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <span>Darhol 103 raqamiga qo'ng'iroq qiling</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                        <span>Xavfsiz joyda qoling va yordam kutib turing</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          4
                        </span>
                        <span>Yaqin odamlaringizga xabar bering</span>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                {/* Nearby Hospitals */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-800 flex items-center space-x-2">
                      <MapPin className="w-5 h-5" />
                      <span>Yaqin Shifoxonalar</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border border-red-200 rounded-lg p-3">
                        <div className="font-medium text-red-800">Respublika Shifoxonasi</div>
                        <div className="text-sm text-gray-600">2.3 km • 8 daqiqa</div>
                        <div className="text-sm text-green-600">24/7 Shoshilinch bo'lim</div>
                      </div>
                      <div className="border border-red-200 rounded-lg p-3">
                        <div className="font-medium text-red-800">Markaziy Klinika</div>
                        <div className="text-sm text-gray-600">3.1 km • 12 daqiqa</div>
                        <div className="text-sm text-green-600">Kardiologiya bo'limi</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-800">Shoshilinch Tahlil</CardTitle>
                  <CardDescription>
                    Holatingizdagi simptomlarni kiriting va shoshilinchlik darajasini aniqlang
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <AlertTriangle className="w-16 h-16 text-red-300 mx-auto mb-4" />
                    <p className="text-red-600">Tahlil kutilmoqda...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emergency Contacts */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Shoshilinch Raqamlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Tez yordam</span>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Phone className="w-4 h-4 mr-1" />
                      103
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Yong'in xizmati</span>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                      <Phone className="w-4 h-4 mr-1" />
                      101
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Politsiya</span>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                      <Phone className="w-4 h-4 mr-1" />
                      102
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
