'use client'

import React  from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useAutoplay } from './EmblaCarouselAutoPlay'

import "./css/styles.css"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {   PlayCircle, Quote, StopCircle } from 'lucide-react'

type EmblaOptionsType = {
    container?: string | HTMLElement | null | undefined;
    slides?: string | HTMLElement[] | NodeListOf<HTMLElement> | null | undefined;
    dragFree?: boolean | undefined;
    breakpoints?: {
        [key: string]: EmblaOptionsType;
    } | undefined;
}

type SlideType = {
  id: number
  imageSrc: string
  fallback: string
  content: string
  name: string
  role: string
}

type PropType = {
  slides: SlideType[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: false, delay: 3000 })
  ])
 

  const { autoplayIsPlaying, toggleAutoplay } =
    useAutoplay(emblaApi)

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container gap-0">
          {slides.map((slide) => (
            <div key={slide.id} className="border mx-2 my-4 shrink-0 max-w-80 bg-gray-50 rounded-xl p-6 sm:p-8 relative">
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
                    src={slide.imageSrc}
                    alt={slide.name}
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

      <button className="embla__play !p-0 !justify-end" onClick={toggleAutoplay} type="button">
        {autoplayIsPlaying ? <StopCircle /> : <PlayCircle />}
      </button>
    </div>
  )
}

export default EmblaCarousel
