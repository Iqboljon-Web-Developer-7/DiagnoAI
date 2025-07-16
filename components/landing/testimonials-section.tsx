"use client"

import { useTranslations } from 'next-intl';
import { Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function TestimonialsSection() {
  const t = useTranslations('Index');

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {t('testimonials.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Testimonial 1 */}
          <div className="bg-gray-50 rounded-xl p-6 sm:p-8 relative">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
              <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-blue-200" />
            </div>
            <div className="mb-6">
              <p className="text-gray-600 text-sm sm:text-base italic">
                {t('testimonials.testimonial1.content')}
              </p>
            </div>
            <div className="flex items-center">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarImage src="/testimonial1.jpg" alt={t('testimonials.testimonial1.name')} />
                <AvatarFallback>T1</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {t('testimonials.testimonial1.name')}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {t('testimonials.testimonial1.role')}
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-gray-50 rounded-xl p-6 sm:p-8 relative">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
              <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-blue-200" />
            </div>
            <div className="mb-6">
              <p className="text-gray-600 text-sm sm:text-base italic">
                {t('testimonials.testimonial2.content')}
              </p>
            </div>
            <div className="flex items-center">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarImage src="/testimonial2.jpg" alt={t('testimonials.testimonial2.name')} />
                <AvatarFallback>T2</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {t('testimonials.testimonial2.name')}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {t('testimonials.testimonial2.role')}
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-gray-50 rounded-xl p-6 sm:p-8 relative">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
              <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-blue-200" />
            </div>
            <div className="mb-6">
              <p className="text-gray-600 text-sm sm:text-base italic">
                {t('testimonials.testimonial3.content')}
              </p>
            </div>
            <div className="flex items-center">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarImage src="/testimonial3.jpg" alt={t('testimonials.testimonial3.name')} />
                <AvatarFallback>T3</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {t('testimonials.testimonial3.name')}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {t('testimonials.testimonial3.role')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}