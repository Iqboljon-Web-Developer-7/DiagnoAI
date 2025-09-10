import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Shield, Clock, Users, Award, Globe, Heart } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

import aboutBg from "@/assets/images/useful/about-bg.jpg"

import aboutImg from "@/assets/images/about/about-bg-new.jpg"

import Javohir from "@/assets/images/about/Javohir.jpg"
import Sunnatillo from "@/assets/images/about/Sunnatillo.webp"
import Iqboljon from "@/assets/images/about/Iqboljon.jpg"
import Shahobiddin from "@/assets/images/about/Shahobiddin.jpg"
import Firdavs from "@/assets/images/about/Firdavs.jpg"

interface TeamMember {
  name: string;
  role: string;
  description: string;
}

interface TeamMembersData {
  about: {
    team: {
      members: {
        [key: string]: TeamMember;
      };
    };
  };
}

const teamMembersData: TeamMembersData = {
  about: {
    team: {
      members: {
        member1: {
          name: "Sunnat Panjiyev Sherzod o'g'li",
          role: "Co-Founder & Yurist",
          description: "Graduated from Tashkent State Law University, Bachelor. Experience: 2022-2025."
        },
        member2: {
          name: "Javohir Jahonov Jasur o'g'li",
          role: "Founder & Backend Developer",
          description: "Graduated from PDP University, Bachelor. Experience: 2023-2027."
        },
        member3: {
          name: "Iqboljon Ummataliyev Kamoliddin o'g'li",
          role: "Frontend Developer",
          description: "Graduated from Najot Ta'lim, IT Park & SAMMI. Experience: 2022-2025."
        },
        member4: {
          name: "Firdavs Safarmakhmadov",
          role: "Web-dizayner & Grafik dizayner",
          description: "Graduated from ProWeb & Central Asian University, Bachelor. Experience: 2023-2027."
        },
        member5: {
          name: "Shahobiddin",
          role: "AI Mutaxassis",
          description: "Graduated from PDP University, Bachelor. Experience: 2023-2027."
        }
      }
    }
  }
}

const timelineItems = [
  {
    year: "2025 Fevral",
    title: "Boshlanish",
    description:
      "AI va tibbiyotga qiziqqan eng yaxshi mutaxassislarni bir jamoaga to‘pladik. Maqsad — eng dolzarb tibbiy muammoni topish va hal qilish.",
    position: "left",
  },
  {
    year: "2025 Mart",
    title: "Muammo aniqlash",
    description:
      "Keng tahlillar va shifokorlar bilan uchrashuvlar orqali eng katta muammo sifatida erta diagnostika kechikishini tanladik.",
    position: "right",
  },
  {
    year: "2025 Aprel",
    title: "Ilk prototip",
    description:
      "Minimal ishlaydigan AI modelini yaratdik va kichik klinikalarda testdan o‘tkaza boshladik.",
    position: "left",
  },
  {
    year: "2025 May",
    title: "Dastlabki natijalar",
    description:
      "Testlar ijobiy bo‘ldi — model ayrim kasalliklarni ancha tez aniqlashga muvaffaq bo‘ldi.",
    position: "right",
  },
  {
    year: "2025 Avgust",
    title: "Kengaytirish rejalari",
    description:
      "Investitsiya jalb qilish va ko‘proq klinikalar bilan hamkorlik qilish bo‘yicha muzokaralar boshlandi.",
    position: "left",
  },
];

export default async function AboutPage() {
  const translations = await getTranslations("about")

  const teamMembers = Object.keys(teamMembersData.about?.team?.members || {}).map((key, index) => ({
    name: teamMembersData.about.team.members[key].name,
    role: teamMembersData.about.team.members[key].role,
    description: teamMembersData.about.team.members[key].description,
    image: [Sunnatillo.src, Javohir.src, Iqboljon.src, Firdavs.src, Shahobiddin.src][index],
  }))

  return (
    <div className="min-h-screen" style={{ backgroundImage: `url(${aboutBg.src})` }}>
      {/* Hero Section */}
      <section
        style={{ backgroundImage: `url(${aboutImg.src})` }}
        className="relative bg-gradient-to-br from-blue-600 text-white py-12 sm:py-16 bg-cover bg-bottom md:py-20 px-[8%] bg-black bg-no-repeat min-h-[30rem] flex items-center w-full"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF33] to-[#2B6A73B2]"></span>
        <div className="container max-w-7xl   px-4 sm:px-6 lg:px-8 relative animate-fade-in-down opacity-0 delay-300">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-blue-500">{translations("hero.title")}</h1>
          <p className="md:text-2xl mb-8 text-blue-400 max-w-3xl">{translations("hero.description")}</p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20  relative animate-fade-in-down opacity-0 delay-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{translations("mission.title")}</h2>
              <p className="text-lg text-gray-600 mb-6">{translations("mission.description1")}</p>
              <p className="text-lg text-gray-600 mb-6">{translations("mission.description2")}</p>
              <div className="space-y-4">
                {["item1", "item2", "item3", "item4"].map((item, index) => (
                  <div key={item} className="flex items-start space-x-3">
                    <span>{index + 1}.</span>
                    <p className="text-gray-700">{translations(`mission.checklist.${item}`)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-2 md:p-8 rounded-2xl">
              <div className="grid sm:grid-cols-2 gap-6">
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

      <section className="py-20  ">
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
      <section className="py-20  ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{translations("team.title")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl">{translations("team.description")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <Image
                    width={400}
                    height={440}
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-96 object-cover object-top"
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

      {/* Timeline Section */}
      <section className="w-full py-16 px-4 bg-[#eff7f6]">
        <div className="container">
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
              <span className="top-[50%] sticky left-1/2 transform -translate-x-1/2 bg-[#2b6a73] w-4 h-4 inline-block rounded-full z-20"></span>
              <span className="top-[52%] sticky left-1/2 transform -translate-x-1/2 bg-[#eff7f6] w-4 h-4 z-10 flex justify-center">
                <div className="w-[26rem] sm:w-[30rem] h-[712px] shrink-0 bg-[#eff7f6] z-10"></div>
              </span>
              {timelineItems.map((item, index) => (
                <div key={item.year || index} className="relative">
                  <div
                    className={`flex relative ${item.position === "left" ? "justify-start" : "justify-end"} w-full`}
                  >
                    <span className={`absolute left-1/2 transform -translate-x-1/2 flex items-center ${item.position === "left" ? "justify-end" : "justify-start"} bg-[#2b6a73] w-4 h-4 rounded-full`}>
                      <div className="h-[1px] w-40 sm:w-52 transform -translate-y-1/2 top-1/2 bg-[#2b6a73] shrink-0"></div>
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
                          <p className="font-normal text-[#00000080] z-20">
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
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 z-20 relative">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">{translations("cta.title")}</h2>
          <p className="text-xl text-blue-100 mb-8">{translations("cta.description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full">
                {translations("cta.contactButton")}
              </Button>
            </Link>
            <Link href="/careers">
              <Button
                size="lg"
                variant="outline"
                className="border-white hover:bg-white hover:text-blue-600 w-full"
              >
                {translations("cta.careersButton")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}