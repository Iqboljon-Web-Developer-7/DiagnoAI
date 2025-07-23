import { HeroSection } from "@/app/[locale]/components/hero-section";
import { HowItWorksSection } from "@/app/[locale]/components/how-it-works-section";
import { FeaturesSection } from "@/app/[locale]/components/features-section";
import { TestimonialsSection } from "@/app/[locale]/components/testimonials-section";
import { CTASection } from "@/app/[locale]/components/cta-section";

export default async function HomePage() {

  return (
    <div className="bg-gray-100">
      <HeroSection
        diagnosisPath="/diagnosis"
        analysisPath="/analysis"
        emergencyPath="/emergency-help"
      />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection
        diagnosisPath="/diagnosis"
        emergencyPath="/emergency-help"
      />
    </div>
  );
}