import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: {
    default: 'AI Diagnosis | Diagno AI',
    template: '%s | Diagno AI'
  },
  description: 'Get instant, reliable, and secure AI-powered medical diagnosis and emergency assistance with Diagno AI. Describe your symptoms and receive a preliminary assessment powered by advanced artificial intelligence.',
  keywords: [
    'AI diagnosis',
    'medical AI',
    'symptom checker',
    'healthcare',
    'emergency assistance',
    'virtual doctor',
    'Diagno AI',
    'online consultation',
    'health support',
    'telemedicine'
  ],
  authors: [
    { name: 'Diagno AI Team', url: 'https://diagno-ai-startup.vercel.app' }
  ],
  creator: 'Diagno AI',
  publisher: 'Diagno AI',
  openGraph: {
    title: 'AI Diagnosis | Diagno AI',
    description: 'Get instant, reliable, and secure AI-powered medical diagnosis and emergency assistance with Diagno AI.',
    url: 'https://diagno-ai-startup.vercel.app/ai-diagnosis',
    siteName: 'Diagno AI',
    images: [
      {
        url: 'https://diagno-ai-startup.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Diagno AI Open Graph Image'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Diagnosis | Diagno AI',
    description: 'Get instant, reliable, and secure AI-powered medical diagnosis and emergency assistance with Diagno AI.',
    site: '@diagnoai',
    creator: '@diagnoai',
    images: ['https://diagno-ai-startup.vercel.app/og-image.png']
  },
  metadataBase: new URL('https://diagno-ai-startup.vercel.app'),
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest',
  category: 'healthcare'
}

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      {children}
    </>
  )
}

export default layout