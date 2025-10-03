"use client"

import NeuroMedicine from "@/assets/images/home/infinite-carousel types/neurology.svg"
import Cardiology from "@/assets/images/home/infinite-carousel types/cardiolog.svg"
import Orthopedics from "@/assets/images/home/infinite-carousel types/arthopedic-surgery.svg"
import Pediatrics from "@/assets/images/home/infinite-carousel types/phychiatry.svg"
import Radiology from "@/assets/images/home/infinite-carousel types/nutrition.svg"
import Oncology from "@/assets/images/home/infinite-carousel types/ancology.svg"
import Dermatology from "@/assets/images/home/infinite-carousel types/dermotolog.svg"
import Rheumatology from "@/assets/images/home/infinite-carousel types/rheumatology.svg"
import { useTranslations } from "next-intl"

const InfiniteCarousel =   () => {
  const t =   useTranslations("Index")
  const slides = [
    { img: NeuroMedicine, title: t("carouselTitles.neurology") },
    { img: Cardiology, title: t("carouselTitles.cardiology") },
    { img: Orthopedics, title: t("carouselTitles.orthopedics") },
    { img: Pediatrics, title: t("carouselTitles.pediatrics") },
    { img: Radiology, title: t("carouselTitles.radiology") },
    { img: Oncology, title: t("carouselTitles.oncology") },
    { img: Dermatology, title: t("carouselTitles.dermatology") },
    { img: Rheumatology, title: t("carouselTitles.rheumatology") },
  ]

  const trackSlides = [...slides, ...slides, ...slides]

  return (
    <div className="relative flex items-center justify-center mx-auto overflow-hidden w-[99.4vw] py-8 bg-white dark:bg-gray-900 shadow-lg">
      {/* Left gradient */}
      <div
        className="absolute left-0 top-0 h-full w-52 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right,var(--gradient-bg,rgba(255,255,255,1)),var(--gradient-bg-transparent,rgba(255,255,255,0)))"
        }}
      />
      {/* Right gradient */}
      <div
        className="absolute right-0 top-0 h-full w-52 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left,var(--gradient-bg,rgba(255,255,255,1)),var(--gradient-bg-transparent,rgba(255,255,255,0)))"
        }}
      />
      <div
        className="flex gap-24 animate-[scroll_32s_linear_infinite]"
        style={{
          width: "calc(250px * 14)",
          // CSS variables for gradient colors
          // Light mode
          "--gradient-bg": "rgba(255,255,255,1)",
          "--gradient-bg-transparent": "rgba(255,255,255,0)",
          // Dark mode override
          // These will be overridden by dark mode below
        } as React.CSSProperties}
      >
        {trackSlides.map((item, idx) => (
          <div
            className="flex items-center justify-center gap-4 w-[166px]"
            key={idx}
          >
            <img src={item.img.src} height="70" width="50" alt={item.title} />
            <p className="text-xl text-gray-900 dark:text-gray-100">{item.title}</p>
          </div>
        ))}
      </div>
      <style jsx global>{`
        .dark .relative > div {
          --gradient-bg: rgba(17,24,39,1);
          --gradient-bg-transparent: rgba(17,24,39,0);
        }
      `}</style>
    </div>
  )
}

export default InfiniteCarousel
