"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Brain, FileText, ImageIcon, AlertTriangle, CheckCircle, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAppContext } from "@/context/app-context"
import { LoginModal } from "@/components/login-modal"
import { SuccessToast } from "@/components/success-toast"
import { useTranslations, useMessages } from "next-intl"

// Define the type for the diagnosis object
interface Diagnosis {
  diagnosis: string
  confidence: number
  status: string
  doctor: string
}

// Define the type for the AppContext
interface AppContextType {
  isLoggedIn: boolean
  addDiagnosis: (diagnosis: Diagnosis) => void
}

// Define the type for translations
interface AiDiagnosisTranslations {
  title: string
  description: string
  uploadTitle: string
  uploadDescription: string
  uploadPrompt: string
  supportedFormats: string
  uploadedFilesLabel: string
  removeButton: string
  symptomsTitle: string
  symptomsDescription: string
  symptomsPlaceholder: string
  symptomBadges: {
    headache: string
    fever: string
    cough: string
    abdominalPain: string
    fatigue: string
  }
  analyzeButton: string
  analyzingText: string
  analysisProgressLabel: string
  resultsTitle: string
  resultsDescription: string
  awaitingAnalysis: string
  diagnosisTitle: string
  diagnosisName: string
  confidenceLabel: string
  urgencyLabel: string
  urgencyLevels: {
    medium: string
  }
  recommendedSpecialistTitle: string
  specialistName: string
  specialistDescription: string
  viewDoctorsButton: string
  recommendationsTitle: string
  recommendations: string[]
  saveResultButton: string
  detailedReportButton: string
}

export default function AIDiagnosisPage() {
  const translations = useTranslations('aiDiagnosis');
  const { isLoggedIn, addDiagnosis } = useAppContext() as AppContextType

  const messages = useMessages();
  const keys = Object.keys(messages.aiDiagnosis.recommendations);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [symptoms, setSymptoms] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false)
  const [analysisProgress, setAnalysisProgress] = useState<number>(0)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(!isLoggedIn)
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string>("")

  // Symptom keys for rendering badges
  const symptomKeys: (keyof AiDiagnosisTranslations["symptomBadges"])[] = [
    "headache",
    "fever",
    "cough",
    "abdominalPain",
    "fatigue",
  ]

  // Handle file upload with typed event
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    setUploadedFiles((prev) => [...prev, ...files])
  }

  // Handle analysis process
  const handleAnalyze = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setAnalysisComplete(true)

          addDiagnosis({
            diagnosis: translations('diagnosisName'),
            confidence: 87,
            status: "Yangi", // Note: This could be translated if needed
            doctor: "Dr. Aziza Karimova",
          })

          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  // Remove file by index
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Add symptom to the list
  const handleAddSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) return

    const newSymptoms = symptoms ? `${symptoms}, ${symptom}` : symptom
    setSymptoms(newSymptoms)
  }

  // Save result and show toast
  const handleSaveResult = () => {
    setToastMessage(translations("saveResultButton")) // Use translation for consistency
    setShowSuccessToast(true)
  }

  // Download report and show toast
  const handleDownloadReport = () => {
    setToastMessage(translations("detailedReportButton")) // Use translation for consistency
    setShowSuccessToast(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{translations('title')}</h1>
          <p className="text-lg text-gray-600">{translations('description')}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>{translations("symptomsTitle")}</span>
                </CardTitle>
                <CardDescription>{translations("uploadDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={translations("symptomsPlaceholder")}
                  value={symptoms}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSymptoms(e.target.value)}
                  className="min-h-32 rounded-t-lg rounded-b-none ring-0 focus-visible:ring-0"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-b-lg p-2 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex items-center p-1 gap-3">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <p className="font-medium text-gray-700">{translations("uploadPrompt")}</p>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-700">{translations("uploadedFilesLabel")}</h4>
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
                          {translations("removeButton")}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button
                  variant={'outline'}
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (uploadedFiles.length === 0 && !symptoms.trim())}
                  className="w-full text-white hover:text-white transition-all bg-[#2B6A73] hover:bg-[#268391] text-lg py-6"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {translations("analyzingText")}
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      {translations("analyzeButton")}
                    </>
                  )}
                </Button>

                {isAnalyzing && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{translations("analysisProgressLabel")}</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
            {analysisComplete && (
              <div className="grid grid-cols-2 gap-2">
                {/* Diagnosis Result */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-green-800">{translations("diagnosisTitle")}</CardTitle>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold text-green-900 mb-2">{translations("diagnosisName")}</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-green-700">{translations("confidenceLabel")}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={87} className="flex-1" />
                          <span className="text-sm font-bold text-green-800">87%</span>
                        </div>
                      </div>

                      <div className="flex">
                        <span className="text-sm font-medium text-green-700">{translations("urgencyLabel")}</span>
                        <Badge variant="outline" className="ml-2 border-yellow-400 text-yellow-700">
                          {translations("urgencyLevels.medium")}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>{translations("recommendationsTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {keys.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          {index < 3 ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                          )}
                          <span className={`${index >= 3 && "text-red-500"}`}>{translations(`recommendations.${rec}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>


            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!analysisComplete ? (
              <Card>
                <CardHeader>
                  <CardTitle>{translations("resultsTitle")}</CardTitle>
                  <CardDescription>{translations("resultsDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">{translations("awaitingAnalysis")}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>

                {/* Recommended Specialist */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <span>{translations("recommendedSpecialistTitle")}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* <div className="font-medium text-blue-600">{translations("specialistName")}</div> */}
                      <p className="text-sm text-gray-600 my-2">{translations("specialistDescription")}</p>
                      <Link href="/recommended-providers">
                        <Button size={"sm"} className="w-full bg-green-600 hover:bg-green-700">{translations("viewDoctorsButton")}</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>



                {/* Action Buttons */}
                <div className="space-y-3">

                  <Button variant="outline" className="w-full" onClick={handleSaveResult}>
                    {translations("saveResultButton")}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleDownloadReport}>
                    {translations("detailedReportButton")}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {showSuccessToast && <SuccessToast message={toastMessage} onClose={() => setShowSuccessToast(false)} />}
    </div>
  )
}