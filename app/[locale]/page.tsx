"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { HeroSection } from "@/app/[locale]/components/hero-section"
import { HowItWorksSection } from "@/app/[locale]/components/how-it-works-section"
import { FeaturesSection } from "@/app/[locale]/components/features-section"
import { TestimonialsSection } from "@/app/[locale]/components/testimonials-section"
import { CTASection } from "@/app/[locale]/components/cta-section"

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
      <HeroSection
        handleGetDiagnosis={handleGetDiagnosis}
        handleUploadAnalysis={handleUploadAnalysis}
        handleEmergencyHelp={handleEmergencyHelp}
      />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection
        handleGetDiagnosis={handleGetDiagnosis}
        handleEmergencyHelp={handleEmergencyHelp}
      />


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