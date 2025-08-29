import type { Metadata } from 'next'
import React, { FC } from 'react'

export const metadata: Metadata = {
  title: {
    default: 'About | Diagno AI',
    template: '%s | Diagno AI'
  },
  description: 'Learn more about Diagno AI, our mission, vision, and the team dedicated to providing AI-powered medical diagnosis, emergency assistance, and healthcare services.',
  keywords: [
    'About Diagno AI',
    'Our Team',
    'Mission',
    'Vision',
    'Medical AI',
    'Healthcare',
    'Emergency Assistance',
    'Company Information',
    'Diagno AI'
  ],
  authors: [
    { name: 'Diagno AI Team', url: 'https://diagnoai.uz' }
  ],
  creator: 'Diagno AI',
  publisher: 'Diagno AI',
  openGraph: {
    title: 'About Diagno AI',
    description: 'Discover the story, mission, and team behind Diagno AI, the platform for AI-powered medical diagnosis and emergency help.',
    url: 'https://diagnoai.uz/about',
    siteName: 'Diagno AI',
    images: [
      {
        url: 'https://diagnoai.uz/og-image.png',
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
    title: 'About Diagno AI',
    description: 'Learn about the Diagno AI team, our mission, and how we are transforming healthcare with AI.',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest',
  category: 'healthcare'
}

const layout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

export default layout