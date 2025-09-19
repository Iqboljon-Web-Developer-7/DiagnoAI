"use client"

import { useTranslations } from 'next-intl';
import { TypeAnimation } from 'react-type-animation';

export default function ExampleComponent () {
    //  <h1
    //         className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl max-w-4xl font-bold mb-4 sm:mb-6"
    //       >
    //         {t('hero.title')}
    //         <span className="text-blue-300 block sm:inline italic"> {t('hero.titleHighlight')}</span>
    //       </h1>
    const t = useTranslations("Index")
  return (

    <TypeAnimation
      sequence={[
        t("hero.1"),
        2000,
        t("hero.2"),
        2000,
        t("hero.3"),
        2000,
        t("hero.4"),
        2000,
        t("hero.5"),
        2000
      ]}
      wrapper="h1"
      speed={50}
    //   style={{ fontSize: '2em', display: 'inline-block' }}
      repeat={Infinity}
      className='text-4xl sm:text-4xl md:text-5xl lg:text-7xl max-w-4xl font-bold mb-4 sm:mb-6'
    />
  );
};