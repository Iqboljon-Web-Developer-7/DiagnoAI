import { Metadata } from "next";

export const MetaData: Metadata = {
    title: {
        default: "Diagno AI",
        template: "%s | Diagno AI"
    },
    description: "Diagno AI - sun'iy intellekt yordamida tibbiy tashxis, shoshilinch yordam va sog'liqni saqlash xizmatlarini taqdim etadi. 24/7 tezkor, ishonchli va xavfsiz tibbiy yordam oling.",
    keywords: [
        "sun'iy intellekt tashxisi",
        "tibbiy AI",
        "shoshilinch yordam",
        "sog'liqni saqlash",
        "teletibbiyot",
        "virtual shifokor",
        "Diagno AI",
        "simptomlarni tekshirish",
        "onlayn konsultatsiya",
        "tibbiy yordam"
    ],
    authors: [
        { name: "Diagno AI Jamoasi", url: "https://diagnoai.uz" }
    ],
    creator: "Diagno AI",
    publisher: "Diagno AI",
    openGraph: {
        title: "Diagno AI - Sun'iy intellekt yordamida tibbiy tashxis va shoshilinch yordam",
        description: "Diagno AI bilan tezkor, ishonchli va xavfsiz sun'iy intellekt yordamida tibbiy tashxis va shoshilinch yordam oling.",
        url: "https://diagnoai.uz",
        siteName: "Diagno AI",
        images: [
            {
                url: "https://diagnoai.uz/og-image.png",
                width: 1200,
                height: 630,
                alt: "Diagno AI Open Graph Rasmi"
            }
        ],
        locale: "uz_UZ",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "Diagno AI - Sun'iy intellekt yordamida tibbiy tashxis va shoshilinch yordam",
        description: "Diagno AI bilan tezkor, ishonchli va xavfsiz sun'iy intellekt yordamida tibbiy tashxis va shoshilinch yordam oling.",
        site: "@diagnoai",
        creator: "@diagnoai",
        images: ["https://diagnoai.uz/og-image.png"]
    },
    metadataBase: new URL("https://diagnoai.uz"),
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1
        }
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico'
    },
    category: "sog'liqni saqlash",
}