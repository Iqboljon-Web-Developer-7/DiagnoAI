import { HeroSection } from "@/app/[locale]/components/hero-section";
import { HowItWorksSection } from "@/app/[locale]/components/how-it-works-section";
import { FeaturesSection } from "@/app/[locale]/components/features-section";
import { TestimonialsSection } from "@/app/[locale]/components/testimonials-section";
import { CTASection } from "@/app/[locale]/components/cta-section";
import { Partners } from "./components/partners";

import bgSquares from "@/assets/images/useful/bg-square.webp"

export default async function HomePage() {
  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <HeroSection />
      {/* @ts-expect-error Async Server Component */}
      <HowItWorksSection />
      {/* @ts-expect-error Async Server Component */}
      <FeaturesSection />
      <div style={{ backgroundImage: `url(${bgSquares.src})` }} className="bg-cover">
        {/* @ts-expect-error Async Server Component */}
        <Partners />
        {/* @ts-expect-error Async Server Component */}
        <TestimonialsSection />
      </div>
      {/* @ts-expect-error Async Server Component */}
      <CTASection />
    </>
  );
}