import { Iphone } from '@/components/ui/iphone';
import React from 'react';

export default function HowItWork() {
  return (
    <section className="w-full py-20 md:py-28 px-4 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience seamless diagnostics with our cutting-edge AI technology.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Side */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Visit AI Diagnosis Page
                </h3>
                <p className="text-gray-600">
                  Navigate to our AI diagnosis page and start your health assessment instantly—no installation needed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Describe Your Symptoms
                </h3>
                <p className="text-gray-600">
                  Answer a few quick questions about how you feel—our AI analyzes your responses in real time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Get AI Insights
                </h3>
                <p className="text-gray-600">
                  Receive personalized guidance and next-step recommendations powered by advanced AI within moments.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition-all duration-200 hover:scale-105">
                Try AI Diagnosis
                <svg
                  className="w-5 h-5"
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
            </div>
          </div>

          {/* Phone Side */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-200 rounded-3xl blur-xl opacity-30" />
              <Iphone
                className="w-full max-w-xs md:max-w-sm min-w-60"
                videoSrc="https://videos.pexels.com/video-files/4250244/4250244-uhd_1440_2160_30fps.mp4"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
