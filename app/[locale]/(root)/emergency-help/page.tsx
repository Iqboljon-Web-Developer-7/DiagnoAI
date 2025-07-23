"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Phone, MapPin, Mic, Upload, Navigation, Loader2 } from "lucide-react"
import { useTranslations, useMessages } from "next-intl"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function EmergencyHelpPage() {
  const translations = useTranslations("emergency")
  const [symptoms, setSymptoms] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [emergencyLevel, setEmergencyLevel] = useState<"low" | "medium" | "high" | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  console.log(selectedImage);
  const { toast } = useToast()

  const messages = useMessages()
  const immediateActions = Object.keys(messages.emergency?.immediateActions || {})

  const handleEmergencyAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setEmergencyLevel("high")
    }, 2000)
  }

  const toggleRecording = () => {
    if (!isRecording) {
      setToastMessage(translations("toastMessages.recordingStarted"))
      setShowSuccessToast(true)
    } else {
      setToastMessage(translations("toastMessages.recordingStopped"))
      setShowSuccessToast(true)
      setSymptoms((prev) => prev + (prev ? ", " : "") + translations("toastMessages.recordedText"))
    }
    setIsRecording(!isRecording)
  }

  const handleEmergencyCall = (number: string) => {
    setToastMessage(translations("toastMessages.calling", { number }))
    setShowSuccessToast(true)
  }

  const handleQuickEmergency = (emergencyKey: string) => {
    const emergencyText = translations(`quickEmergencyButtons.${emergencyKey}`)
    setSelectedEmergency(emergencyText)
    setSymptoms(emergencyText)
    setToastMessage(translations("toastMessages.emergencySelected", { emergency: emergencyText }))
    setShowSuccessToast(true)
  }

  const handleUploadFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setSelectedImage(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        setToastMessage(translations("toastMessages.imageUploaded"))
        setShowSuccessToast(true)
        setSymptoms((prev) => prev + (prev ? ", " : "") + translations("toastMessages.imageAdded", { fileName: file.name }))
      }
    }
    input.click()
  }

  const handleFindHospital = () => {
    setToastMessage(translations("toastMessages.findingHospital"))
    setShowSuccessToast(true)
  }

  useEffect(() => {
    if (showSuccessToast) {
      toast({
        title: toastMessage,
      });
    }
  }, [showSuccessToast, toast, toastMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex flex-col">
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Emergency Alert */}
        <div className="bg-red-100 border-2 border-red-400 rounded-xl p-4 sm:p-6 mb-6 md:mb-8 shadow-md transition-all hover:shadow-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-red-800">{translations("alertTitle")}</h2>
              <p className="text-sm sm:text-base text-red-700 mt-1">{translations("alertDescription")}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Emergency Input Section */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Quick Emergency Buttons */}
            <Card className="border-red-200 bg-red-50 shadow-md rounded-xl overflow-hidden transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-800 text-base sm:text-lg md:text-xl">{translations("quickEmergencyTitle")}</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600">{translations("quickEmergencyDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {["chestPain", "breathingDifficulty", "dizziness", "severeBleeding"].map((key) => (
                    <Button
                      key={key}
                      variant="outline"
                      className={`border-red-300 text-red-700 hover:bg-red-50 h-auto py-3 sm:py-4 text-sm sm:text-base transition-all ${selectedEmergency === translations(`quickEmergencyButtons.${key}`) ? "bg-red-100 ring-2 ring-red-400" : ""
                        }`}
                      onClick={() => handleQuickEmergency(key)}
                      aria-label={translations(`quickEmergencyButtons.${key}`)}
                    >
                      <div className="text-center">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-red-600" />
                        <div className="font-medium">{translations(`quickEmergencyButtons.${key}`)}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Symptom Description */}
            <Card className="border-red-200 bg-red-50 shadow-md rounded-xl overflow-hidden transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-800 text-base sm:text-lg md:text-xl">{translations("symptomDescriptionTitle")}</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600">{translations("symptomDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <Textarea
                  placeholder={translations("symptomPlaceholder")}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-32 sm:min-h-40 border-red-200 focus:border-red-400 focus:ring-red-400 text-sm sm:text-base rounded-lg"
                />

                {imagePreview && (
                  <div className="relative border border-red-200 rounded-lg p-2 bg-white shadow-sm">
                    <Image src={imagePreview} alt="Uploaded" className="max-h-40 sm:max-h-48 w-full object-contain rounded" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 sm:h-8 sm:w-8 p-0 border-red-300 text-red-600 hover:bg-red-100"
                      onClick={() => {
                        setSelectedImage(null)
                        setImagePreview(null)
                      }}
                      aria-label="Remove image"
                    >
                      ×
                    </Button>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    onClick={toggleRecording}
                    className={`flex-1 border-red-200 text-sm sm:text-base hover:bg-red-50 transition-all ${isRecording ? "bg-red-100 border-red-400 text-red-600" : ""
                      }`}
                    aria-label={isRecording ? translations("recordButton.stop") : translations("recordButton.start")}
                  >
                    <Mic className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${isRecording ? "text-red-600" : "text-gray-600"}`} />
                    {isRecording ? translations("recordButton.stop") : translations("recordButton.start")}
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 text-sm sm:text-base hover:bg-red-50 transition-all"
                    onClick={handleUploadFile}
                    aria-label={translations("uploadImageButton")}
                  >
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
                    {translations("uploadImageButton")}
                  </Button>
                </div>

                {isRecording && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-red-700 text-sm sm:text-base">{translations("recordingStatus")}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency Analysis */}
            <Card className="border-red-200 shadow-md rounded-xl overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6">
                <Button
                  onClick={handleEmergencyAnalysis}
                  disabled={isAnalyzing || (!symptoms.trim() && !isRecording)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-base sm:text-lg py-5 sm:py-6 rounded-lg shadow-md transition-all disabled:bg-red-300 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label={isAnalyzing ? translations("analyzeButton.analyzing") : translations("analyzeButton.default")}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                      {translations("analyzeButton.analyzing")}
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      {translations("analyzeButton.default")}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Results */}
          <div className="space-y-4 sm:space-y-6">
            {emergencyLevel ? (
              <>
                {/* Emergency Level */}
                <Card className="border-red-300 bg-red-50 shadow-md rounded-xl overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader className="bg-red-100">
                    <CardTitle className="text-red-800 text-base sm:text-lg md:text-xl flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>{translations("emergencyLevelTitle")}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Badge className="bg-red-600 text-white px-4 py-2 mb-3 animate-bounce">
                      {translations("highRiskBadge")}
                    </Badge>
                    <p className="text-red-800 font-medium text-sm sm:text-base mb-4">{translations("highRiskMessage")}</p>
                    <div className="space-y-2 mt-8">
                      <Button
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base py-3 sm:py-4 rounded-lg shadow-md transition-all"
                        size="lg"
                        onClick={() => handleEmergencyCall("103")}
                        aria-label={translations("call103Button")}
                      >
                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                        {translations("call103Button")}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-red-300 text-red-700 hover:bg-red-50 text-sm sm:text-base py-3 sm:py-4 rounded-lg transition-all"
                        size="lg"
                        onClick={handleFindHospital}
                        aria-label={translations("findHospitalButton")}
                      >
                        <Navigation className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                        {translations("findHospitalButton")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Immediate Actions */}
                <Card className="border-red-200 bg-red-50 shadow-md rounded-xl overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-red-800 text-base sm:text-lg md:text-xl">{translations("immediateActionsTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <ol className="space-y-3 text-sm sm:text-base">
                      {immediateActions.map((action, index) => (
                        <li key={action} className="flex items-start space-x-2">
                          <span className="bg-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          <span>{translations(`immediateActions.${action}`)}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                {/* Nearby Hospitals */}
                <Card className="border-red-200 bg-red-50 shadow-md rounded-xl overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-red-800 text-base sm:text-lg md:text-xl flex items-center space-x-2">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>{translations("nearbyHospitalsTitle")}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3">
                      {["hospital1", "hospital2"].map((hospital) => (
                        <div
                          key={hospital}
                          className="border border-red-200 rounded-lg p-3 cursor-pointer hover:bg-red-50 transition-all"
                          onClick={handleFindHospital}
                          role="button"
                          tabIndex={0}
                          aria-label={`Select ${translations(`${hospital}.name`)}`}
                        >
                          <div className="font-medium text-red-800 text-sm sm:text-base">{translations(`${hospital}.name`)}</div>
                          <div className="text-sm text-gray-600">{translations(`${hospital}.distance`)}</div>
                          <div className="text-sm text-green-600">{translations(`${hospital}.department`)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-red-200 shadow-md rounded-xl overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-red-800 text-base sm:text-lg md:text-xl">{translations("analysisTitle")}</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-600">{translations("analysisDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 text-center py-8">
                  <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-red-300 mx-auto mb-4" />
                  <p className="text-red-600 text-sm sm:text-base">{translations("analysisPending")}</p>
                </CardContent>
              </Card>
            )}

            {/* Emergency Contacts */}
            <Card className="border-red-200 bg-red-50 shadow-md rounded-xl overflow-hidden transition-all hover:shadow-lg">
              <CardHeader >
                <CardTitle className="text-red-800 text-base sm:text-lg md:text-xl">{translations("emergencyContactsTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  {["ambulance", "fireService", "police"].map((contact, index) => (
                    <div key={contact} className="flex items-center justify-between">
                      <span className="font-medium text-sm sm:text-base">{translations(`emergencyContacts.${contact}`)}</span>
                      <Button
                        size="sm"
                        className={`${contact === "ambulance"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "border-red-300 text-red-700 hover:bg-red-50"
                          } text-sm sm:text-base transition-all`}
                        variant={contact === "ambulance" ? "default" : "outline"}
                        onClick={() => handleEmergencyCall(index === 0 ? "103" : index === 1 ? "101" : "102")}
                        aria-label={`Call ${translations(`emergencyContacts.${contact}`)}`}
                      >
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                        {index === 0 ? "103" : index === 1 ? "101" : "102"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

    </div>
  )
}