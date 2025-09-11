import { getTranslations } from 'next-intl/server';
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { Upload } from "lucide-react"

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
        <div className='text-center flex items-center justify-center flex-col'>
          <h1
            className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl max-w-4xl font-bold mb-4 sm:mb-6"
          >
            {t('hero.title')}
            <span className="text-blue-200 block sm:inline italic"> {t('hero.titleHighlight')}</span>
          </h1>
          <p
            className="sm:text-2xl mb-6 sm:mb-8 text-blue-200 italic max-w-2xl mx-auto lg:mx-0 font-medium"
          >
            {t('hero.description')}
          </p>
        </div>

        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start flex-wrap"
        >
          <Link href="/ai-diagnosis">
            <Button
              variant="outline"
              className="rounded-full px-20 w-full sm:w-auto bg-transparent hover:bg-[#2b6b73] hover:text-white text-sm sm:text-base   transition-all hover:border-transparent duration-300"
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {t('hero.getDiagnosis')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}