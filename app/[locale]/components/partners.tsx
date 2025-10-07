import { getTranslations } from 'next-intl/server';
import Img1 from "@/assets/images/partners/1.png"
import Img2 from "@/assets/images/partners/2.png"
import Img3 from "@/assets/images/partners/3.png"
import Img4 from "@/assets/images/partners/4.png"
import Img5 from "@/assets/images/partners/5.png"
import Img6 from "@/assets/images/partners/6.png"

import dynamic from 'next/dynamic';

const EmblaCarousel = dynamic(() => import('@/components/TestimoniolsCarousel/EmblaCarousel'), {
  loading: () => <div className="h-[200px] bg-gray-200 dark:bg-gray-800 animate-pulse">Loading carousel...</div>
});

const testimonialData = [
  { id: 1, imageSrc: Img1, name: "Abdullayev Aziz" },
  { id: 2, imageSrc: Img2, name: "Madina Karimova" },
  { id: 3, imageSrc: Img3, name: "Sardor Umarov" },
  { id: 4, imageSrc: Img4, name: "Nilufar Toshpulatova" },
  { id: 5, imageSrc: Img5, name: "Botir Ismoilov" },
  { id: 6, imageSrc: Img6, name: "Botir Ismoilov" },
  { id: 7, imageSrc: Img1, name: "Abdullayev Aziz" },
  { id: 8, imageSrc: Img2, name: "Madina Karimova" },
  { id: 9, imageSrc: Img3, name: "Sardor Umarov" },
  { id: 10, imageSrc: Img4, name: "Nilufar Toshpulatova" },
  { id: 11, imageSrc: Img5, name: "Botir Ismoilov" },
  { id: 12, imageSrc: Img6, name: "Botir Ismoilov" },
];
export async function Partners() {
  const t = await getTranslations('Index');

  return (
    <section className="py-8 sm:py-10 sm:pt-14">
      <div className="mx-auto px-1">
        <div className="mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl leading-loose font-bold text-gray-900 dark:text-gray-100 mb-3">
            {t('partners.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            {t('partners.description')}
          </p>
        </div>
        <EmblaCarousel slides={testimonialData} type='partners' />
      </div>
    </section>
  )
}