import { Metadata } from "next";

export const MetaData:Metadata = {
    title: {
        default: 'Diagno AI',
        template: '%s | Diagno AI'
    },
    description: 'Diagno AI provides AI-powered medical diagnosis, emergency assistance, and healthcare services. Get instant, reliable, and secure health support 24/7.',
    keywords: [
        'AI diagnosis',
        'medical AI',
        'emergency assistance',
        'healthcare',
        'telemedicine',
        'virtual doctor',
        'Diagno AI',
        'symptom checker',
        'online consultation',
        'health support'
    ],
    authors: [
        { name: 'Diagno AI Team', url: 'https://diagno-ai-startup.vercel.app' }
    ],
    creator: 'Diagno AI',
    publisher: 'Diagno AI',
    openGraph: {
        title: 'Diagno AI - AI-powered Medical Diagnosis & Emergency Help',
        description: 'Get instant, reliable, and secure AI-powered medical diagnosis and emergency assistance with Diagno AI.',
        url: 'https://diagno-ai-startup.vercel.app',
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
        title: 'Diagno AI - AI-powered Medical Diagnosis & Emergency Help',
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
        apple: '/favicon.ico'
    },
    category: 'healthcare'
}