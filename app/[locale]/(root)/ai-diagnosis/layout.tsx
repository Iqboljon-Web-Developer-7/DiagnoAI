import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: {
    default: 'AI Tashxis | Diagno AI',
    template: '%s | Diagno AI'
  },
  description: 'Diagno AI bilan tezkor, ishonchli va xavfsiz AI-quvvatli tibbiy tashxis va shoshilinch yordam oling. Alomatlaringizni tasvirlab, ilg\'or sun\'iy intellekt tomonidan dastlabki baholashni oling.',
  keywords: [
    'AI tashxis',
    'tibbiy AI',
    'alomat tekshiruvchi',
    'sog\'liqni saqlash',
    'shoshilinch yordam',
    'virtual shifokor',
    'Diagno AI',
    'onlayn konsultatsiya',
    'sog\'liqni qo\'llab-quvvatlash',
    'teletibbiyot'
  ],
  authors: [
    { name: 'Diagno AI Jamoasi', url: 'https://diagnoai.uz' }
  ],
  creator: 'Diagno AI',
  publisher: 'Diagno AI',
  openGraph: {
    title: 'AI Tashxis | Diagno AI',
    description: 'Diagno AI bilan tezkor, ishonchli va xavfsiz AI-quvvatli tibbiy tashxis va shoshilinch yordam oling.',
    url: 'https://diagnoai.uz/ai-diagnosis',
    siteName: 'Diagno AI',
    images: [
      {
        url: 'https://diagnoai.uz/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Diagno AI Open Graph Rasmi'
      }
    ],
    locale: 'uz_UZ',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tashxis | Diagno AI',
    description: 'Diagno AI bilan tezkor, ishonchli va xavfsiz AI-quvvatli tibbiy tashxis va shoshilinch yordam oling.',
    site: '@diagnoai',
    creator: '@diagnoai',
    images: ['https://diagnoai.uz/og-image.png']
  },
  metadataBase: new URL('https://diagnoai.uz'),
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    }
  },
}

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      {children}
    </>
  )
}

export default layout