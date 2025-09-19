import { HeroSection } from "@/app/[locale]/components/hero-section";
import { HowItWorksSection } from "@/app/[locale]/components/how-it-works-section";
import { FeaturesSection } from "@/app/[locale]/components/features-section";
import { TestimonialsSection } from "@/app/[locale]/components/testimonials-section";
import { CTASection } from "@/app/[locale]/components/cta-section";
import { Partners } from "./components/partners";

import bgSquares from "@/assets/images/useful/bg-square.webp"
import { Suspense } from "react";
import Image from "next/image";
import InfiniteCarousel from "./components/InfiniteCarousel Types/InfiniteCarousel";

export default async function HomePage() {
  return (
    <>
      <Suspense fallback={<div>Loading hero...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <HeroSection />
      </Suspense>
      <Suspense fallback={<div>Loading how it works...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <HowItWorksSection />
      </Suspense>
      <InfiniteCarousel />
      <Suspense fallback={<div>Loading features...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <FeaturesSection />
      </Suspense>
      <Suspense fallback={<div>Loading partners...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <Partners />
      </Suspense>
      <Suspense fallback={<div>Loading testimonials...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <TestimonialsSection />
      </Suspense>
      <Suspense fallback={<div>Loading CTA...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <CTASection />
      </Suspense>
    </>
  );
}