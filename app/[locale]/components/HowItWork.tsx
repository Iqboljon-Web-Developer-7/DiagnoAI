// app/components/HowItWork.tsx
"use client";

import { Iphone } from '@/components/ui/iphone';
import { Link } from '@/i18n/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HowItWork() {
  const t = useTranslations('how-it-works'); // namespace = file name without .json
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 sm:py-16 md:py-20 lg:py-28 px-4 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md text-sm sm:text-base">
                1
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {t('step1.title')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {t('step1.desc')}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md text-sm sm:text-base">
                2
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {t('step2.title')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {t('step2.desc')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md text-sm sm:text-base">
                3
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {t('step3.title')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {t('step3.desc')}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3 sm:pt-4">
              <Link href="/ai-diagnosis">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition-all duration-200 hover:scale-105 text-sm sm:text-base">
                  {t('cta')}
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>

          {/* iPhone Demo */}
          <div className="flex justify-center mt-8 md:mt-0">
            <div className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-sm">
              <div className="absolute -inset-3 sm:-inset-4 bg-indigo-200 dark:bg-indigo-900 rounded-3xl blur-xl opacity-30" />
              <Iphone
                className="w-full min-w-[240px]"
                videoSrc={inView ? "/how-to-use.webm" : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}