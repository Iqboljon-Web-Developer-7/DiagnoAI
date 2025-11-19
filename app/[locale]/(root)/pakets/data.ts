export interface Package {
  id: number
  nameKey: string
  subtitleKey?: string
  duration: number
  tests: number
  price: number
  color: string
  priceLabel?: string
  description: string
  examinations: string[]
  benefits: string[]
  includes: string[]
}

export const packages: Package[] = [
  {
    id: 1,
    nameKey: "packageNames.basic",
    duration: 2,
    tests: 47,
    price: 2500000,
    color: "from-slate-400 to-slate-500",
    description: "Asosiy paket muntazam tekshiruvlar uchun mos keladigan asosiy salomatlik skriningini taklif qiladi. Bu keng qamrovli paket umumiy salomatlik holatini baholash va salomatlik muammolarini erta aniqlash uchun asosiy testlarni o'z ichiga oladi.",
    examinations: [
      "Umumiy qon tahlili (UQT)",
      "Qon glukozasi (och qoringa)",
      "Jigar funksiyasi testlari",
      "Buyrak funksiyasi testlari",
      "Xolesterin profili",
      "Siydik tahlili",
      "Asosiy qalqonsimon bez funksiyasi"
    ],
    benefits: [
      "Umumiy salomatlik muammolarini erta aniqlash",
      "Metabolik salomatlikni baholash",
      "Asosiy a'zolar funksiyasini baholash",
      "Iqtisodiy samarali salomatlik skriningi"
    ],
    includes: [
      "Qon testlari",
      "Siydik testlari",
      "Asosiy konsultatsiya",
      "Salomatlik hisoboti"
    ]
  },
  {
    id: 2,
    nameKey: "packageNames.silver",
    duration: 3,
    tests: 55,
    price: 4500000,
    color: "from-slate-300 to-slate-400",
    priceLabel: "from",
    description: "Kumush paket qo'shimcha tekshiruvlar bilan yanada keng qamrovli salomatlik baholashini taqdim etadi. Salomatlik holatini kengaytirilgan diagnostika imkoniyatlari bilan chuqur baholashni istaganlar uchun ideal.",
    examinations: [
      "Umumiy qon tahlili (UQT)",
      "Keng qamrovli metabolit paneli",
      "Kengaytirilgan lipid profili",
      "Jigar funksiyasi paneli",
      "Buyrak funksiyasi paneli",
      "Qalqonsimon bez funksiyasi testlari",
      "D vitamini darajasi",
      "To'liq siydik tahlili"
    ],
    benefits: [
      "Keng qamrovli metabolit baholash",
      "Batafsil a'zolar funksiyasini tahlil qilish",
      "Vitamin yetishmovchiligini aniqlash",
      "Kengaytirilgan profilaktik yordam"
    ],
    includes: [
      "Kengaytirilgan qon paneli",
      "Ilg'or testlar",
      "Shifokor konsultatsiyasi",
      "Batafsil hisobot"
    ]
  },
  {
    id: 3,
    nameKey: "packageNames.gold",
    duration: 4,
    tests: 67,
    price: 7700000,
    color: "from-yellow-600 to-yellow-700",
    description: "Oltin paket ilg'or diagnostika bilan premium keng qamrovli salomatlik skriningini taklif qiladi. Salomatlik monitoringini va kasalliklarni erta aniqlashni ustuvor qilgan shaxslar uchun mukammal.",
    examinations: [
      "Umumiy qon tahlili (UQT)",
      "Keng qamrovli metabolit paneli",
      "Ilg'or lipid profili",
      "To'liq jigar funksiyasi paneli",
      "Buyrak funksiyasi keng qamrovli",
      "To'liq qalqonsimon bez paneli",
      "Vitamin paneli (D, B12, Folat)",
      "Gormon skriningi",
      "Yurak belgilari",
      "To'liq siydik tahlili"
    ],
    benefits: [
      "Premium salomatlik baholash",
      "Ilg'or kasallik aniqlash",
      "Gormonal muvozanatni baholash",
      "Yurak salomatligini skrining",
      "Keng qamrovli salomatlik tekshiruvi"
    ],
    includes: [
      "Premium test paneli",
      "Mutaxassis konsultatsiyasi",
      "Keng qamrovli hisobot",
      "Keyingi kuzatuv tavsiyalari"
    ]
  },
  {
    id: 4,
    nameKey: "packageNames.platinum",
    duration: 5,
    tests: 71,
    price: 12000000,
    color: "from-slate-700 to-slate-900",
    description: "Platina paket - bu bizning eng keng qamrovli salomatlik tekshiruvimiz bo'lib, keng qamrovli skrining va ilg'or diagnostikani taklif qiladi. Mavjud bo'lgan eng chuqur salomatlik baholashini qidirayotganlar uchun mo'ljallangan.",
    examinations: [
      "Umumiy qon tahlili (UQT)",
      "Keng qamrovli metabolit paneli",
      "Ilg'or lipid profili",
      "To'liq jigar funksiyasi paneli",
      "Buyrak funksiyasi keng qamrovli",
      "To'liq qalqonsimon bez paneli",
      "To'liq vitamin paneli",
      "To'liq gormon profili",
      "Ilg'or yurak belgilari",
      "Onkologik belgilar skriningi",
      "To'liq siydik tahlili",
      "EKG (Elektrokardiogramma)"
    ],
    benefits: [
      "Eng keng qamrovli salomatlik baholash",
      "Saraton erta aniqlash skriningi",
      "To'liq gormonal baholash",
      "Ilg'or yurak baholash",
      "Premium salomatlik dasturi"
    ],
    includes: [
      "Premium test to'plami",
      "Ko'p mutaxassis konsultatsiyasi",
      "Keng qamrovli salomatlik hisoboti",
      "Shaxsiylashtirilgan tavsiyalar",
      "Keyingi kuzatuv rejasi"
    ]
  },
  {
    id: 5,
    nameKey: "packageNames.light",
    subtitleKey: "packageSubtitles.womenCheckup",
    duration: 2,
    tests: 27,
    price: 1970000,
    color: "from-rose-900 to-rose-950",
    description: "Yengil ayollar salomatligini tekshirish paketi maxsus ayollar uchun mo'ljallangan bo'lib, asosiy ayollar salomatligi skriningiga e'tibor qaratadi. Bu paket ayollar salomatligini kuzatishga va umumiy muammolarni erta aniqlashga yordam beradi.",
    examinations: [
      "Umumiy qon tahlili (UQT)",
      "Qon glukozasi",
      "Keng qamrovli metabolit paneli",
      "Qalqonsimon bez funksiyasi testlari",
      "D vitamini va B12",
      "Siydik tahlili",
      "Pap smear",
      "Ko'krak salomatligini skrining"
    ],
    benefits: [
      "Ayollar uchun maxsus salomatlik skriningi",
      "Reproduktiv salomatlikni baholash",
      "Gormonal muvozanatni baholash",
      "Ayollar salomatligi muammolarini erta aniqlash"
    ],
    includes: [
      "Ayollar salomatligi testlari",
      "Ginekologik skrining",
      "Shifokor konsultatsiyasi",
      "Salomatlik hisoboti"
    ]
  },
  {
    id: 6,
    nameKey: "packageNames.full",
    subtitleKey: "packageSubtitles.womenCheckup",
    duration: 2.5,
    tests: 58,
    price: 3980000,
    color: "from-rose-800 to-rose-900",
    description: "To'liq ayollar salomatligini tekshirish paketi ayollar uchun maxsus moslashtirilgan keng qamrovli skriningni taqdim etadi. Bu keng paket ilg'or diagnostika imkoniyatlari bilan ayollar salomatligining barcha aspektlarini qamrab oladi.",
    examinations: [
      "Umumiy qon tahlili (UQT)",
      "Keng qamrovli metabolit paneli",
      "To'liq lipid profili",
      "To'liq qalqonsimon bez paneli",
      "To'liq vitamin paneli",
      "To'liq gormon profili (FSH, LH, Estrogen, Progesteron)",
      "CA-125 (Tuxumdon saratoni belgisi)",
      "CA 15-3 (Ko'krak saratoni belgisi)",
      "Pap smear va HPV testi",
      "Ko'krak ultratovush tekshiruvi",
      "Chanoq ultratovush tekshiruvi",
      "To'liq siydik tahlili"
    ],
    benefits: [
      "Keng qamrovli ayollar salomatligini baholash",
      "Reproduktiv salomatlikni baholash",
      "Saratoni aniqlash belgilari",
      "To'liq gormonal profil",
      "Ilg'or ginekologik baholash"
    ],
    includes: [
      "To'liq ayollar salomatligi paneli",
      "Ginekolog mutaxassisi konsultatsiyasi",
      "Ultratovush tasvirlash",
      "Keng qamrovli hisobot",
      "Shaxsiylashtirilgan tavsiyalar"
    ]
  },
  {
    id: 7,
    nameKey: "packageNames.cardio",
    subtitleKey: "packageSubtitles.cardioCheckup",
    duration: 2,
    tests: 24,
    price: 1880000,
    color: "from-emerald-900 to-emerald-950",
    description: "Kardio tekshiruv paketi maxsus yurak-qon tomir salomatligiga e'tibor qaratadi. Bu maqsadli skrining yurak salomatligini baholash, potentsial yurak muammolarini aniqlash va sog'lom yurak-qon tomir tizimini saqlash bo'yicha tavsiyalar berishga yordam beradi.",
    examinations: [
      "Umumiy qon tahlili (UQT)",
      "To'liq lipid profili",
      "Yurak fermentlari (CK-MB, Troponin)",
      "BNP (Miya natriuretik peptid)",
      "Homotsistein",
      "CRP (C-reaktiv oqsil)",
      "EKG (Elektrokardiogramma)",
      "Exokardiogramma",
      "Stress testi"
    ],
    benefits: [
      "Keng qamrovli yurak baholash",
      "Yurak kasalliklarini erta aniqlash",
      "Xavf omillarini baholash",
      "Profilaktikaga qaratilgan skrining",
      "Yurak funksiyasini tahlil qilish"
    ],
    includes: [
      "Yurak testlari",
      "EKG va Exokardiogramma",
      "Kardiolog konsultatsiyasi",
      "Yurak salomatligi hisoboti",
      "Profilaktika rejasi"
    ]
  }
]

export function getPackageById(id: number): Package | undefined {
  return packages.find(pkg => pkg.id === id)
}
