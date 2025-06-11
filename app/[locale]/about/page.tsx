import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Shield, Clock, Users, Award, Globe, Heart, CheckCircle } from "lucide-react"
import Link from "next/link"

import AlisherKarimovImage from "@/assets/images/doctor/doctor-man-1.jpg"
import DilnozaRahimovaImage from "@/assets/images/doctor/doctor-woman-1.jpg"
import BoburToshmatovImage from "@/assets/images/doctor/doctor-man-2.jpg"
import MalikaUsmonovaImage from "@/assets/images/doctor/doctor-woman-2.jpg"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Alisher Karimov",
      role: "Bosh shifokor, Asoschisi",
      image: AlisherKarimovImage.src,
      description:
        "20 yillik tajribaga ega kardiolog. Diagno AI platformasining g'oyasi va asosiy konsepsiyasini ishlab chiqqan.",
    },
    {
      name: "Dilnoza Rahimova",
      role: "Bosh texnologiya direktori",
      image: DilnozaRahimovaImage.src,
      description: "Sun'iy intellekt va tibbiy ma'lumotlar tahlili bo'yicha mutaxassis. MIT bitiruvchisi.",
    },
    {
      name: "Dr. Bobur Toshmatov",
      role: "Tibbiy maslahatchi",
      image: BoburToshmatovImage.src,
      description:
        "Terapevt va jamoat salomatligi bo'yicha mutaxassis. Jahon sog'liqni saqlash tashkiloti bilan hamkorlik qilgan.",
    },
    {
      name: "Malika Usmonova",
      role: "Mahsulot menejeri",
      image: MalikaUsmonovaImage.src,
      description: "Tibbiy dasturiy ta'minot va foydalanuvchi tajribasi bo'yicha 8 yillik tajribaga ega mutaxassis.",
    },
  ]

  const milestones = [
    {
      year: "2020",
      title: "Loyiha boshlandi",
      description: "Diagno AI g'oyasi shakllandi va dastlabki tadqiqotlar boshlandi.",
    },
    {
      year: "2021",
      title: "Birinchi prototip",
      description: "Dastlabki AI algoritmlari ishlab chiqildi va sinovdan o'tkazildi.",
    },
    {
      year: "2022",
      title: "Beta versiya",
      description: "Platforma cheklangan foydalanuvchilar doirasida sinovdan o'tkazildi.",
    },
    {
      year: "2023",
      title: "Rasmiy ishga tushirish",
      description: "Diagno AI platformasi rasman ishga tushirildi va keng jamoatchilikka taqdim etildi.",
    },
    {
      year: "2024",
      title: "Kengaytirish",
      description: "Yangi funktsiyalar va xizmatlar qo'shildi, foydalanuvchilar soni 100,000 dan oshdi.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Biz haqimizda</h1>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Diagno AI - bu sun'iy intellekt yordamida tibbiy tashxis va shifokor tavsiyalarini taqdim etuvchi
            innovatsion platforma
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Bizning vazifamiz</h2>
              <p className="text-lg text-gray-600 mb-6">
                Diagno AI platformasining asosiy maqsadi - sun'iy intellekt texnologiyalari yordamida sifatli tibbiy
                yordam olish imkoniyatini kengaytirish va tibbiy xizmatlarni hammabop qilish.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Biz shifokorlar va bemorlar o'rtasidagi aloqani yaxshilash, tashxis qo'yish jarayonini tezlashtirish va
                tibbiy xizmatlarni masofadan turib taqdim etish orqali sog'liqni saqlash tizimini
                takomillashtirmoqchimiz.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <p className="text-gray-700">Tibbiy xizmatlarni hammabop qilish</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <p className="text-gray-700">Tashxis qo'yish jarayonini tezlashtirish</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <p className="text-gray-700">Shifokorlar va bemorlar o'rtasidagi aloqani yaxshilash</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <p className="text-gray-700">Masofadan turib tibbiy yordam ko'rsatish</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">100,000+</h3>
                    <p className="text-gray-600">Foydalanuvchilar</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Brain className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">500,000+</h3>
                    <p className="text-gray-600">AI tahlillar</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">95%</h3>
                    <p className="text-gray-600">Aniqlik darajasi</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">10+</h3>
                    <p className="text-gray-600">Davlatlar</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Bizning qadriyatlarimiz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Diagno AI platformasi quyidagi asosiy qadriyatlarga asoslangan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Ishonchlilik va xavfsizlik</h3>
                <p className="text-gray-600">
                  Foydalanuvchilar ma'lumotlari xavfsizligi va maxfiyligi bizning eng muhim ustuvorligimiz. Barcha
                  ma'lumotlar shifrlangan va tibbiy standartlarga mos ravishda saqlanadi.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sifat va aniqlik</h3>
                <p className="text-gray-600">
                  AI algoritmlarimiz doimiy ravishda takomillashtiriladi va eng so'nggi tibbiy ma'lumotlar bilan
                  yangilanadi. Biz eng yuqori aniqlik darajasiga erishish uchun harakat qilamiz.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tezkorlik va qulaylik</h3>
                <p className="text-gray-600">
                  Foydalanuvchilarimizga istalgan vaqtda va istalgan joyda tez va qulay tibbiy yordam olish imkoniyatini
                  taqdim etamiz. 24/7 xizmat ko'rsatish bizning asosiy tamoyilimiz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Bizning jamoa</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Diagno AI platformasi ortida turgan tajribali mutaxassislar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-48 object-cover object-top"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-gray-600">{member.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our History */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Bizning tarixmiz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Diagno AI platformasining rivojlanish yo'li</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className="w-1/2 pr-8 text-right">
                    {index % 2 === 0 ? (
                      <>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{milestone.title}</h3>
                        <p className="text-blue-600 font-medium mb-2">{milestone.year}</p>
                        <p className="text-gray-600">{milestone.description}</p>
                      </>
                    ) : (
                      <div className="w-4 h-4 bg-blue-600 rounded-full relative left-full transform translate-x-1/2"></div>
                    )}
                  </div>
                  <div className="w-1/2 pl-8">
                    {index % 2 === 1 ? (
                      <>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{milestone.title}</h3>
                        <p className="text-blue-600 font-medium mb-2">{milestone.year}</p>
                        <p className="text-gray-600">{milestone.description}</p>
                      </>
                    ) : (
                      <div className="w-4 h-4 bg-blue-600 rounded-full relative right-full transform -translate-x-1/2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Bizning jamoamizga qo'shiling</h2>
          <p className="text-xl text-blue-100 mb-8">
            Diagno AI platformasi bilan hamkorlik qiling va tibbiy xizmatlarni rivojlantirishga hissa qo'shing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Bog'lanish
              </Button>
            </Link>
            <Link href="/careers">
              <Button
                size="lg"
                variant="outline"
                className="border-white hover:bg-white hover:text-blue-600"
              >
                Vakansiyalar
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
