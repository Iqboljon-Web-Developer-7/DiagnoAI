"use client"

import { useRouter } from "next/navigation"
import { useAppStore } from "@/context/store"
import { HeroSection } from "@/app/[locale]/components/hero-section"
import { HowItWorksSection } from "@/app/[locale]/components/how-it-works-section"
import { FeaturesSection } from "@/app/[locale]/components/features-section"
import { TestimonialsSection } from "@/app/[locale]/components/testimonials-section"
import { CTASection } from "@/app/[locale]/components/cta-section"

export default function HomePage() {
  const router = useRouter()
  const { isLoggedIn } = useAppStore()

  const handleGetDiagnosis = () => {
    if (isLoggedIn) {
      router.push("/ai-diagnosis")
    }

  }
  const handleEmergencyHelp = () => {
    router.push("/emergency-help")
  }

  const handleUploadAnalysis = () => {
    if (isLoggedIn) {
      router.push("/ai-diagnosis")
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

    </div>
  )
}
