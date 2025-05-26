"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Brain, FileText, ImageIcon, AlertTriangle, CheckCircle, User } from "lucide-react"
import Link from "next/link"

export default function AIDiagnosisPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [symptoms, setSymptoms] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setAnalysisComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Diagno AI</span>
            </Link>

            <nav className="flex items-center space-x-6">
              <Link href="/emergency-help" className="text-red-600 hover:text-red-700 font-medium">
                Shoshilinch Yordam
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                Shaxsiy Kabinet
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Tibbiy Tahlil</h1>
          <p className="text-lg text-gray-600">
            Analizlaringizni yuklang va sun'iy intellekt yordamida professional tashxis oling
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload and Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Analiz va Rasmlar Yuklash</span>
                </CardTitle>
                <CardDescription>
                  Tibbiy analizlar, rentgen rasmlari yoki boshqa tibbiy hujjatlarni yuklang
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Fayllarni bu yerga tashlang yoki tanlash uchun bosing
                    </p>
                    <p className="text-sm text-gray-500">PDF, JPG, PNG, DOC formatlarini qo'llab-quvvatlaymiz</p>
                  </label>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-700">Yuklangan fayllar:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {file.type.startsWith("image/") ? (
                            <ImageIcon className="w-5 h-5 text-blue-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-green-600" />
                          )}
                          <span className="text-sm font-medium">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          O'chirish
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Symptoms Input */}
            <Card>
              <CardHeader>
                <CardTitle>Simptomlar va Shikoyatlar</CardTitle>
                <CardDescription>Hozirgi holatingizdagi simptomlarni batafsil yozing</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Masalan: Bosh og'rig'i, isitma, yo'tal, qorin og'rig'i va boshqa simptomlarni yozing..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-32"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                    Bosh og'rig'i
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                    Isitma
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                    Yo'tal
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                    Qorin og'rig'i
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                    Charchash
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Button */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (uploadedFiles.length === 0 && !symptoms.trim())}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="w-5 h-5 mr-2 animate-spin" />
                      Tahlil qilinmoqda...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      AI Tahlil Boshlash
                    </>
                  )}
                </Button>

                {isAnalyzing && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Tahlil jarayoni</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!analysisComplete ? (
              <Card>
                <CardHeader>
                  <CardTitle>Tahlil Natijalari</CardTitle>
                  <CardDescription>
                    Fayllarni yuklang va simptomlarni kiriting, so'ngra tahlil tugmasini bosing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Tahlil kutilmoqda...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Diagnosis Result */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-green-800">Ehtimoliy Tashxis</CardTitle>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold text-green-900 mb-2">Viral Infeksiya (ARVI)</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-green-700">Ishonchlilik darajasi:</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={87} className="flex-1" />
                          <span className="text-sm font-bold text-green-800">87%</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-green-700">Shoshilinchlik darajasi:</span>
                        <Badge variant="outline" className="ml-2 border-yellow-400 text-yellow-700">
                          O'rtacha
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Specialist */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Tavsiya etilgan mutaxassis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="font-medium text-blue-600">Terapevt</div>
                      <p className="text-sm text-gray-600">
                        Umumiy amaliyot shifokori bilan konsultatsiya tavsiya etiladi
                      </p>
                      <Button className="w-full" variant="outline">
                        <User className="w-4 h-4 mr-2" />
                        Shifokorlarni ko'rish
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tavsiyalar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>Ko'p suyuqlik iste'mol qiling</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>Dam oling va uyquni to'liq oling</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>Isitma 38.5°C dan yuqori bo'lsa, shifokorga murojaat qiling</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <span>Simptomlar 7 kundan ko'p davom etsa, tekshiruv o'tkazing</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href="/recommended-providers">
                    <Button className="w-full bg-green-600 hover:bg-green-700">Shifokorlarni ko'rish</Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    Natijani saqlash
                  </Button>
                  <Button variant="outline" className="w-full">
                    Batafsil hisobot
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
