"use client"

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button"
import { Upload, Brain, Clock } from "lucide-react"
import { delay, motion, Variants } from "framer-motion" // Import Framer Motion
import HeroBgImg from "@/assets/images/hero/hero-bg.webp"

// Define animation variants for reusability
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger child animations
      delayChildren: 0.3,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: {
    scale: 1.05, // Subtle hover effect
    transition: { duration: 0.2 },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: "easeInOut" },
  },
};

interface HeroSectionProps {
  handleGetDiagnosis: () => void;
  handleUploadAnalysis: () => void;
  handleEmergencyHelp: () => void;
}

export function HeroSection({ handleGetDiagnosis, handleUploadAnalysis, handleEmergencyHelp }: HeroSectionProps) {
  const t = useTranslations('Index');

  return (
    <section
      style={{
        backgroundImage: `url(${HeroBgImg.src})`,
      }}
      className="relative bg-gradient-to-br from-blue-600 text-white py-12 sm:py-16 bg-cover md:py-20 px-[3%] md:px-[8%] bg-black bg-no-repeat"
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF33] to-[#2B6A73B2] z-10"
        variants={overlayVariants as Variants}
        initial="hidden"
        animate="visible"
      ></motion.span>
      <motion.div
        className="container relative max-w-6xl mx-auto px-1 sm:px-6 lg:px-8 z-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="items-center">
          <div className="text-center lg:text-left">
            <motion.h1
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
              variants={textVariants as Variants}
            >
              {t('hero.title')}
              <span className="text-blue-200 block sm:inline"> {t('hero.titleHighlight')}</span>
            </motion.h1>
            <motion.p
              className="sm:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto lg:mx-0 font-semibold"
              variants={textVariants as Variants}
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start my-14 md:my-32 flex-wrap"
              variants={containerVariants}
            >
              <motion.div variants={buttonVariants as Variants} whileHover="hover">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent hover:bg-[#2B6A73] hover:text-white text-sm sm:text-base"
                  onClick={handleGetDiagnosis}
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t('hero.getDiagnosis')}
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants as Variants} whileHover="hover">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white bg-transparent text-white hover:bg-[#2B6A73] hover:text-white text-sm sm:text-base"
                  onClick={handleUploadAnalysis}
                >
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t('hero.uploadAnalysis')}
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants as Variants} whileHover="hover">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white bg-transparent text-white hover:bg-[#2B6A73] hover:text-white text-sm sm:text-base"
                  onClick={handleEmergencyHelp}
                >
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t('hero.emergencyHelp')}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}