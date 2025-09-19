import { getTranslations } from 'next-intl/server';
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { StarsIcon } from "lucide-react"
import ExampleComponent from './AutoWritten';
 
export async function HeroSection() {
  const t = await getTranslations('Index');

  return (
    <section
      className="relative bg-gradient-to-br from-blue-600 text-white py-12 sm:py-16 bg-cover md:py-20 px-[3%] md:px-[8%] bg-sky-800 bg-no-repeat min-h-[38rem] h-[100svh] flex items-center "
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
      >
        <source src="/hero-mobile.webm" media="(max-width: 767px)" />
        <source src="/hero-desktop.webm" media="(min-width: 768px)" />
      </video>
      <span
        className="absolute inset-0 bg-black/20 z-10"
      ></span>
      <span
        className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF33] to-[#2B6A73B2] z-10"
      ></span>
      <div className="flex items-center justify-center flex-col mx-auto animate-fade-in-down delay-300 opacity-0 duration-500 py-60 z-20 gap-14">
        <div className='text-center flex items-center justify-center flex-col min-h-64'>
          <ExampleComponent />
        </div>

        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start flex-wrap"
        >
          <Link href="/ai-diagnosis">
            <Button
              variant="outline"
              className='button hover:bg-transparent'
            >
              <StarsIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {t('hero.getDiagnosis')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}