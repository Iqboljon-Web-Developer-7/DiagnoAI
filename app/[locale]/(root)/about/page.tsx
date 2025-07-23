"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Shield, Clock, Users, Award, Globe, Heart } from "lucide-react"
import Link from "next/link"
import { useTranslations, useMessages } from "next-intl"

import aboutImg from "@/assets/images/about/about-bg.jpg"
import AlisherKarimovImage from "@/assets/images/doctor/doctor-man-1.jpg"
import DilnozaRahimovaImage from "@/assets/images/doctor/doctor-woman-1.jpg"
import BoburToshmatovImage from "@/assets/images/doctor/doctor-man-2.jpg"
import MalikaUsmonovaImage from "@/assets/images/doctor/doctor-woman-2.jpg"
import Image from "next/image"

export default function AboutPage() {
  const timelineItems = [
    {
      year: "2020",
      title: "Bizning tarixmiz",
      description:
        "Diagno AI g'oyasi shakllandi va dastlabki tadqiqotlar boshlandi.",
      position: "left",
    },
    {
      year: "2021",
      title: "Birinchi prototip",
      description:
        "Dastlabki AI algoritmlari ishlab chiqildi va sinovdan o'tkazildi.",
      position: "right",
    },
    {
      year: "2022",
      title: "Beta versiya",
      description:
        "Platforma cheklangan foydalanuvchilar doirasida sinovdan o'tkazildi.",
      position: "left",
    },
    {
      year: "2023",
      title: "Rasmiy ishga tushirish",
      description:
        "Diagno AI platformasi rasman ishga tushirildi va keng jamoatchilikka taqdim etildi.",
      position: "right",
    },
    {
      year: "2024",
      title: "Kengaytirish",
      description:
        "Yangi funktsiyalar va xizmatlar qo'shildi, foydalanuvchilar soni 100,000 dan oshdi.",
      position: "left",
    },
  ];

  const translations = useTranslations("about")
  const messages = useMessages()

  // Extract team members from messages
  const teamMembers = Object.keys(messages.about?.team?.members || {}).map((key, index) => ({
    name: messages.about.team.members[key].name,
    role: messages.about.team.members[key].role,
    description: messages.about.team.members[key].description,
    image: [AlisherKarimovImage.src, DilnozaRahimovaImage.src, BoburToshmatovImage.src, MalikaUsmonovaImage.src][index],
  }))

  // Extract milestones from messages
  // const milestones = Object.keys(messages.about?.history?.milestones || {}).map((key) => ({
  //   year: messages.about.history.milestones[key].year,
  //   title: messages.about.history.milestones[key].title,
  //   description: messages.about.history.milestones[key].description,
  // }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        style={{ backgroundImage: `url(${aboutImg.src})` }}
        className="relative bg-gradient-to-br from-blue-600 text-white py-12 sm:py-16 bg-cover md:py-20 px-[8%] bg-black bg-no-repeat min-h-96">
        <span className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF33] to-[#2B6A73B2]"></span>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">{translations("hero.title")}</h1>
          <p className="md:text-2xl mb-8 text-blue-50 max-w-3xl">{translations("hero.description")}</p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{translations("mission.title")}</h2>
              <p className="text-lg text-gray-600 mb-6">{translations("mission.description1")}</p>
              <p className="text-lg text-gray-600 mb-6">{translations("mission.description2")}</p>
              <div className="space-y-4">
                {["item1", "item2", "item3", "item4"].map((item, index) => (
                  <div key={item} className="flex items-start space-x-3">
                    <span>{index + 1}.</span><p className="text-gray-700">{translations(`mission.checklist.${item}`)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <Users className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{translations("mission.stats.users.value")}</h3>
                    <p className="text-gray-600">{translations("mission.stats.users.label")}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Brain className="w-12 h-12 text-green-600 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{translations("mission.stats.analyses.value")}</h3>
                    <p className="text-gray-600">{translations("mission.stats.analyses.label")}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Heart className="w-12 h-12 text-red-600 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{translations("mission.stats.accuracy.value")}</h3>
                    <p className="text-gray-600">{translations("mission.stats.accuracy.label")}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Globe className="w-12 h-12 text-purple-600 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{translations("mission.stats.countries.value")}</h3>
                    <p className="text-gray-600">{translations("mission.stats.countries.label")}</p>
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
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{translations("values.title")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl">{translations("values.description")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {["value1", "value2", "value3"].map((value, index) => (
              <Card key={value} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  {index === 0 && <Shield className="w-12 h-12 text-blue-600 mb-4" />}
                  {index === 1 && <Award className="w-12 h-12 text-green-600 mb-4" />}
                  {index === 2 && <Clock className="w-12 h-12 text-purple-600 mb-4" />}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{translations(`values.${value}.title`)}</h3>
                  <p className="text-gray-600">{translations(`values.${value}.description`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{translations("team.title")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl">{translations("team.description")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <Image
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

      <section className="w-full container mx-auto py-16 px-4 bg-white">
        <div className="mb-12">
          <h1 className="font-medium text-3xl text-[#1e1e1e]">
            Bizning tarixmiz
          </h1>
          <p className="font-normal text-xl text-[#00000080] [font-family:'Rubik',Helvetica]">
            Diagno AI platformasining rivojlanish yo&#39;li
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-dashed border-[#2b6a73]"></div>
          <div className="relative flex flex-col">
            <span className="top-[35%] sticky left-1/2 transform -translate-x-1/2 bg-[#2b6a73] w-4 h-4 inline-block rounded-full z-20"></span>
            <span className="top-[37%] sticky left-1/2 transform -translate-x-1/2 bg-white w-4 h-4 z-10 flex justify-center">
              <div className="w-[30rem] h-[712px] shrink-0 bg-white z-10"></div>
            </span>
            {timelineItems.map((item, index) => (
              <div key={item.year || index} className="relative">
                <div
                  className={`flex relative ${item.position === "left" ? "justify-start" : "justify-end"} w-full`}
                >
                  <span className={`absolute left-1/2 transform -translate-x-1/2 flex items-center ${item.position === "left" ? "justify-start" : "justify-end"} bg-[#2b6a73] w-4 h-4 rounded-full`}>
                    <div className="h-[1px] w-52 transform -translate-y-1/2 top-1/2 bg-[#2b6a73] shrink-0"></div>
                  </span>
                  <Card
                    className={`bg-transparent w-full max-w-[700px] border-none shadow-none ${item.position === "right" ? "ml-auto" : "mr-auto"}`}
                  >
                    <CardContent className="p-0">
                      <div
                        className={`flex flex-col ${item.position === "right" ? "items-end text-right" : "items-start text-left"}`}
                      >
                        <h2 className="font-medium text-[#1e1e1e] text-xl mb-2 z-20">
                          {item.title}
                        </h2>
                        <span className="font-normal text-[#2b6a73] text-lg z-20">
                          {item.year}
                        </span>
                        <p className="  font-normal text-[#00000080] z-20">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 z-20 relative">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">{translations("cta.title")}</h2>
          <p className="text-xl text-blue-100 mb-8">{translations("cta.description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                {translations("cta.contactButton")}
              </Button>
            </Link>
            <Link href="/careers">
              <Button
                size="lg"
                variant="outline"
                className="border-white hover:bg-white hover:text-blue-600"
              >
                {translations("cta.careersButton")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div >
  )
}