"use client"

import React  from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
export default function Carousel({ testimonials, navigation = true, pagination }: { 
  testimonials: Array<{
    id: number;
    imageSrc: {
      src:string
    };
    name: string;
  }>,
  navigation?: boolean,
  pagination?: boolean 
}) {
  let modules = [Autoplay];
  if (pagination) {
    modules.push(Pagination);
  }

  return (
      <Swiper
        loop={true}
        spaceBetween={25}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        slidesPerView={5}
        navigation={navigation}
        modules={modules}
        className="mySwiper"
      >
        {testimonials.map((image, index) => (
          <SwiperSlide key={index}>
            <Image priority={true} onClick={() => window.open(image.imageSrc.src, '_blank')} src={image.imageSrc.src} width={200} height={100} className='object-contain' alt={`Slide ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
  );
}
