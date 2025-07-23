import { getTranslations } from 'next-intl/server';
import { Button } from "@/components/ui/button"
import { Upload, Brain, Clock } from "lucide-react"
import HeroBgImg from "@/assets/images/hero/hero-bg.webp"
import { Link } from "@/i18n/navigation"

interface HeroSectionProps {
  diagnosisPath: string;
  analysisPath: string;
  emergencyPath: string;
}

export async function HeroSection({ diagnosisPath, analysisPath, emergencyPath }: HeroSectionProps) {
  const t = await getTranslations('Index');

  return (
    <section
      style={{
        backgroundImage: `url(${HeroBgImg.src})`,
      }}
      className="relative bg-gradient-to-br from-blue-600 text-white py-12 sm:py-16 bg-cover md:py-20 px-[3%] md:px-[8%] bg-indigo-100 bg-no-repeat"
    >
      <span
        className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF33] to-[#2B6A73B2] z-10"
      ></span>
      <div
        className="container relative max-w-6xl mx-auto px-1 sm:px-6 lg:px-8 z-10"
      >
        <div className="items-center">
          <div className="text-center lg:text-left">
            <h1
              className="text-2xl max-w-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in-down delay-300 opacity-0 duration-700"
            >
              {t('hero.title')}
              <span className="text-blue-200 block sm:inline"> {t('hero.titleHighlight')}</span>
            </h1>
            <p
              className="sm:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto lg:mx-0 font-semibold animate-fade-in-down delay-500 opacity-0 duration-700"
            >
              {t('hero.description')}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start my-14 md:my-32 flex-wrap animate-fade-in-down delay-700 opacity-0 duration-700"
            >
              <div>
                <Link href={diagnosisPath}>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent hover:bg-[#2B6A73] hover:text-white text-sm sm:text-base hover:scale-105 transition-transform"
                  >
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {t('hero.getDiagnosis')}
                  </Button>
                </Link>
              </div>
              <div>
                <Link href={analysisPath}>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-white bg-transparent text-white hover:bg-[#2B6A73] hover:text-white text-sm sm:text-base hover:scale-105 transition-transform"
                  >
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {t('hero.uploadAnalysis')}
                  </Button>
                </Link>
              </div>
              <div>
                <Link href={emergencyPath}>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-white bg-transparent text-white hover:bg-[#2B6A73] hover:text-white text-sm sm:text-base hover:scale-105 transition-transform"
                  >
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {t('hero.emergencyHelp')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}