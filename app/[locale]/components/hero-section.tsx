import { getTranslations } from 'next-intl/server';
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { Upload } from "lucide-react"

export async function HeroSection() {
  const t = await getTranslations('Index');

  return (
    <section
      className="relative bg-gradient-to-br from-blue-600 text-white py-12 sm:py-16 bg-cover md:py-20 px-[3%] md:px-[8%] bg-sky-800 bg-no-repeat h-[100svh] flex items-center "
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
        className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF33] to-[#2B6A73B2] z-10"
      ></span>
      <div
        className="container relative max-w-6xl mx-auto z-10"
      >
        <div className="items-center">
          <div className="text-center items-center justify-center flex flex-col animate-fade-in-down delay-300 opacity-0 duration-500">
            <h1
              className="text-3xl max-w-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
            >
              {t('hero.title')}
              <span className="text-blue-200 block sm:inline"> {t('hero.titleHighlight')}</span>
            </h1>
            <p
              className="sm:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto lg:mx-0 font-semibold"
            >
              {t('hero.description')}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start my-14 md:my-32 flex-wrap"
            >
              <Link href="/ai-diagnosis">
                <Button
                  variant="outline"
                  className="px-20 w-full sm:w-auto bg-transparent hover:bg-[#2B6A73] hover:text-white text-sm sm:text-base   transition-all hover:border-transparent duration-300"
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t('hero.getDiagnosis')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}