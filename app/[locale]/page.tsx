import { HeroSection } from "@/app/[locale]/components/hero-section";
import { HowItWorksSection } from "@/app/[locale]/components/how-it-works-section";
import { FeaturesSection } from "@/app/[locale]/components/features-section";
import { TestimonialsSection } from "@/app/[locale]/components/testimonials-section";
import { CTASection } from "@/app/[locale]/components/cta-section";

export default async function HomePage() {
  return (
    <div className="bg-gray-100">
      {/* @ts-expect-error Async Server Component */}
      <HeroSection
        diagnosisPath="/ai-diagnosis"
        emergencyPath="/emergency-help"
      />
      {/* @ts-expect-error Async Server Component */}
      <HowItWorksSection />
      {/* @ts-expect-error Async Server Component */}
      <FeaturesSection />
      {/* @ts-expect-error Async Server Component */}
      <TestimonialsSection />
      {/* @ts-expect-error Async Server Component */}
      <CTASection
        diagnosisPath="/ai-diagnosis"
        emergencyPath="/about"
      />
    </div>
  );
}