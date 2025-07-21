'use client';

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Brain, FileText, ImageIcon, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/context/store";
import { LoginModal } from "@/components/login-modal";
import { useTranslations, useMessages } from "next-intl";
import { useToast } from "@/hooks/use-toast";

interface Diagnosis {
  diagnosis: string;
  confidence: number;
  status: string;
  doctor: string;
}

const symptomKeys = ["headache", "fever", "cough", "abdominalPain", "fatigue"] as const;

export default function AIDiagnosisPage() {
  const t = useTranslations('aiDiagnosis');
  const messages = useMessages();
  const { isLoggedIn, addDiagnosis } = useAppStore();

  const [files, setFiles] = useState<File[]>([]);
  const [symptoms, setSymptoms] = useState('');
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(!isLoggedIn);

  const { toast } = useToast()


  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...(e.target.files ? Array.from(e.target.files) : [])]);
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSymptom = (symptom: string) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms(prev => prev ? `${prev}, ${symptom}` : symptom);
    }
  };

  const startAnalysis = () => {
    if (!isLoggedIn) return setShowLoginModal(true);
    if (!files.length && !symptoms.trim()) return;

    setAnalyzing(true);
    setProgress(0);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setAnalyzing(false);
          setComplete(true);

          addDiagnosis({
            diagnosis: t('diagnosisName'),
            confidence: 87,
            status: "Yangi",
            doctor: "Dr. Aziza Karimova",
          });

          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const download = (msg: string) => (
    toast({ title: msg })
  )

  const recommendations = Object.keys(messages.aiDiagnosis.recommendations);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-lg text-gray-600">{t('description')}</p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Symptom & File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>{t("symptomsTitle")}</CardTitle>
                <CardDescription>{t("uploadDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={t("symptomsPlaceholder")}
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  className="min-h-32 mb-2"
                />
                <div className="border-2 border-dashed p-2 text-center hover:border-blue-400 transition rounded">
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" id="file-upload" className="hidden" onChange={handleFileUpload} />
                  <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-3">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span>{t("uploadPrompt")}</span>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-700">{t("uploadedFilesLabel")}</h4>
                    {files.map((file, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <div className="flex items-center gap-2 text-sm">
                          {file.type.startsWith("image/") ? <ImageIcon className="text-blue-600 w-5 h-5" /> : <FileText className="text-green-600 w-5 h-5" />}
                          <span>{file.name}</span>
                          <span className="text-gray-500 text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(i)} className="text-red-600">
                          {t("removeButton")}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analyze Button */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={startAnalysis}
                  disabled={analyzing || (!files.length && !symptoms.trim())}
                  className="w-full bg-[#2B6A73] hover:bg-[#268391] text-white text-lg py-6"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t("analyzingText")}
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      {t("analyzeButton")}
                    </>
                  )}
                </Button>

                {analyzing && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{t("analysisProgressLabel")}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Result */}
            {complete && (
              <div className="grid grid-cols-2 gap-2">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-green-800">{t("diagnosisTitle")}</CardTitle>
                      <CheckCircle className="text-green-600 w-6 h-6" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold text-green-900 mb-2">{t("diagnosisName")}</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-green-700">{t("confidenceLabel")}</span>
                        <div className="flex items-center mt-1 gap-2">
                          <Progress value={87} />
                          <span className="font-bold text-green-800">87%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-700">{t("urgencyLabel")}</span>
                        <Badge variant="outline" className="border-yellow-400 text-yellow-700">
                          {t("urgencyLevels.medium")}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("recommendationsTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          {i < 3 ? <CheckCircle className="text-green-600 w-4 h-4 mt-0.5" /> : <AlertTriangle className="text-red-500 w-4 h-4 mt-0.5" />}
                          <span className={i >= 3 ? "text-red-500" : ""}>{t(`recommendations.${rec}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {!complete ? (
              <Card>
                <CardHeader>
                  <CardTitle>{t("resultsTitle")}</CardTitle>
                  <CardDescription>{t("resultsDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t("awaitingAnalysis")}</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("recommendedSpecialistTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 my-2">{t("specialistDescription")}</p>
                    <Link href="/recommended-providers">
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                        {t("viewDoctorsButton")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full" onClick={() => download(t("saveResultButton"))}>
                    {t("saveResultButton")}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => download(t("detailedReportButton"))}>
                    {t("detailedReportButton")}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
