'use client'

import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useAutoplay } from './EmblaCarouselAutoPlay'
import { useInView } from 'react-intersection-observer'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { PlayCircle, Quote, StopCircle } from 'lucide-react'
import Image from 'next/image'

type EmblaOptionsType = {
  container?: string | HTMLElement | null | undefined;
  slides?: string | HTMLElement[] | NodeListOf<HTMLElement> | null | undefined;
  dragFree?: boolean | undefined;
  breakpoints?: {
    [key: string]: EmblaOptionsType;
  } | undefined;
}

type PropType = {
  slides: any[]
  options?: EmblaOptionsType
  type: string
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, type } = props

  const options = {
    loop: true,
    dragFree: true,
    duration: 32,
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ delay: 3500 })
  ])

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5, triggerOnce: true, delay: 1100
  })

  const { autoplayIsPlaying, toggleAutoplay } = useAutoplay(emblaApi)

  useEffect(() => {
    if (inView && emblaApi && !autoplayIsPlaying) {
      setTimeout(() => {
        toggleAutoplay()
      }, 500);
    }
  }, [inView])

  return (
    <div className="embla" ref={inViewRef}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container gap-0">
          {type == 'partners' && slides.map((slide) => (
            <div key={slide.id} className="border mx-2 shrink-0 max-w-80 bg-[#edf2f4] rounded-xl p-6 sm:p-8 mb-5  relative">
              <div className="flex items-center justify-center h-full">
                <Image
                  loading="lazy"
                  src={slide?.imageSrc}
                  alt='slide-image'
                  width={250}
                  height={250}
                  placeholder="blur"  // Adds blur placeholder to avoid blank/white during load
                  sizes="(max-width: 768px) 100vw, 33vw"  // Optimize fetch based on viewport
                />
              </div>
            </div>
          ))}
          {type == 'testimonials' && slides.map((slide) => (
            <div key={slide.id} className="border mx-2 my-4 shrink-0 max-w-80 bg-gray-50 rounded-xl p-6 sm:p-8 pb-4 sm:pb-3 relative">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-blue-200" />
              </div>
              <div className="mb-6">
                <p className="text-gray-600 text-sm sm:text-base italic">
                  {slide.content}
                </p>
              </div>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage
                    loading="lazy"
                    className='object-cover'
                    src={slide?.imageSrc}
                    alt={slide.name}
                    width={50}
                    height={50}
                  />
                  <AvatarFallback>{slide.fallback}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {slide.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {slide.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="embla__play !p-0 !justify-end"
        onClick={toggleAutoplay}
        type="button"
        aria-label={autoplayIsPlaying ? "Stop auto-play slideshow" : "Start auto-play slideshow"}
      >
        {autoplayIsPlaying ? <StopCircle /> : <PlayCircle />}
      </button>
    </div>
  )
}

export default EmblaCarousel