"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Shield, Users, Award, Globe, CheckCircle, Zap, Target, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

import Javohir from "@/assets/images/about/Javohir.jpg"
import Sunnatillo from "@/assets/images/about/Sunnatillo.webp"
import Iqboljon from "@/assets/images/about/Iqboljon.jpg"
import Shahobiddin from "@/assets/images/about/Shahobiddin.jpg"
import Firdavs from "@/assets/images/about/Firdavs.jpg"
import Sanjarbek from "@/assets/images/about/Sanjarbek.png"

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  position: string
}

export default function AboutPage() {
  const t = useTranslations("about")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
          }
        })
      },
      { threshold: 0.1, rootMargin: '-50px' }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const teamMembers: TeamMember[] = [
    {
      name: t("team.members.member1.name"),
      role: t("team.members.member1.role"),
      description: t("team.members.member1.description"),
      image: Sunnatillo.src
    },
    {
      name: t("team.members.member2.name"),
      role: t("team.members.member2.role"),
      description: t("team.members.member2.description"),
      image: Javohir.src
    },
    {
      name: t("team.members.member3.name"),
      role: t("team.members.member3.role"),
      description: t("team.members.member3.description"),
      image: Iqboljon.src
    },
    {
      name: t("team.members.member4.name"),
      role: t("team.members.member4.role"),
      description: t("team.members.member4.description"),
      image: Shahobiddin.src
    },
    {
      name: t("team.members.member5.name"),
      role: t("team.members.member5.role"),
      description: t("team.members.member5.description"),
      image: Firdavs.src
    },
    {
      name: t("team.members.member6.name"),
      role: t("team.members.member6.role"),
      description: t("team.members.member6.description"),
      image: Sanjarbek.src
    }
  ]

  const timelineItems: TimelineItem[] = [
    {
      year: t("timeline.items.item1.year"),
      title: t("timeline.items.item1.title"),
      description: t("timeline.items.item1.description"),
      position: "left"
    },
    {
      year: t("timeline.items.item2.year"),
      title: t("timeline.items.item2.title"),
      description: t("timeline.items.item2.description"),
      position: "right"
    },
    {
      year: t("timeline.items.item3.year"),
      title: t("timeline.items.item3.title"),
      description: t("timeline.items.item3.description"),
      position: "left"
    },
    {
      year: t("timeline.items.item4.year"),
      title: t("timeline.items.item4.title"),
      description: t("timeline.items.item4.description"),
      position: "right"
    },
    {
      year: t("timeline.items.item5.year"),
      title: t("timeline.items.item5.title"),
      description: t("timeline.items.item5.description"),
      position: "left"
    }
  ]

  const statsData = [
    { icon: Users, value: t("mission.stats.users.value"), label: t("mission.stats.users.label"), color: "text-blue-600 dark:text-blue-400", bgColor: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900" },
    { icon: Brain, value: t("mission.stats.analyses.value"), label: t("mission.stats.analyses.label"), color: "text-emerald-600 dark:text-emerald-400", bgColor: "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900" },
    { icon: Target, value: t("mission.stats.accuracy.value"), label: t("mission.stats.accuracy.label"), color: "text-rose-600 dark:text-rose-400", bgColor: "from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900" },
    { icon: Globe, value: t("mission.stats.countries.value"), label: t("mission.stats.countries.label"), color: "text-purple-600 dark:text-purple-400", bgColor: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900" }
  ]

  const valuesData = [
    {
      icon: Shield,
      title: t("values.value1.title"),
      description: t("values.value1.description"),
      color: "text-blue-600 dark:text-blue-400",
      bgGradient: "from-blue-500 to-cyan-500 dark:from-blue-900 dark:to-cyan-900",
      iconBg: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
    },
    {
      icon: Award,
      title: t("values.value2.title"),
      description: t("values.value2.description"),
      color: "text-emerald-600 dark:text-emerald-400",
      bgGradient: "from-emerald-500 to-teal-500 dark:from-emerald-900 dark:to-teal-900",
      iconBg: "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900"
    },
    {
      icon: Zap,
      title: t("values.value3.title"),
      description: t("values.value3.description"),
      color: "text-purple-600 dark:text-purple-400",
      bgGradient: "from-purple-500 to-indigo-500 dark:from-purple-900 dark:to-indigo-900",
      iconBg: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
    }
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <section className="relative bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-20 md:py-32 overflow-hidden dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&w=1920')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/90 to-purple-900/90 dark:from-blue-950/90 dark:to-purple-950/90"></div>

        {/* Animated background elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-linear-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse dark:from-blue-800 dark:to-cyan-800"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-linear-to-br from-indigo-400 to-purple-400 rounded-full opacity-20 animate-pulse delay-1000 dark:from-indigo-800 dark:to-purple-800"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-linear-to-br from-cyan-400 to-blue-400 rounded-full opacity-15 animate-pulse delay-500 dark:from-cyan-800 dark:to-blue-800"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="bg-linear-to-r from-blue-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400">
                  {t("hero.title")}
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed dark:text-blue-200">
                {t("hero.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll">
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight dark:text-white">
                <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                  {t("mission.title")}
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed dark:text-gray-300">
                {t("mission.description1")}
              </p>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed dark:text-gray-300">
                {t("mission.description2")}
              </p>

              <div className="space-y-6">
                {["item1", "item2", "item3", "item4"].map((item, index) => (
                  <div key={item} className="flex items-start space-x-4 group hover:bg-blue-50 p-4 rounded-xl transition-all duration-300 dark:hover:bg-blue-950">
                    <div className="shrink-0">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mt-1 transition-transform group-hover:scale-110 dark:text-emerald-400" />
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors dark:text-gray-200 dark:group-hover:text-white">
                      {t(`mission.checklist.${item}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-on-scroll">
              <div className="grid grid-cols-2 gap-2 md:gap-6">
                {statsData.map((stat, index) => (
                  <Card key={index} className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden group dark:bg-blue-950">
                    <CardContent className="p-4 md:p-6 relative">
                      <div className={`absolute inset-0 bg-linear-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      <div className="relative z-10">
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-linear-to-br ${stat.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
                        </div>
                        <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors dark:text-white dark:group-hover:text-blue-200">{stat.value}</h3>
                        <p className="text-gray-600 md:text-lg group-hover:text-gray-700 transition-colors dark:text-gray-300 dark:group-hover:text-white">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="values" className="py-20 lg:py-32 bg-white relative overflow-hidden dark:bg-blue-950">
        <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/50 dark:to-purple-950/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 dark:text-white">
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                {t("values.title")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed dark:text-gray-300">
              {t("values.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {valuesData.map((value, index) => (
              <Card key={index} className="animate-on-scroll bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 overflow-hidden group dark:bg-blue-950">
                <CardContent className="pt-12 pb-8 text-center relative">
                  <div className={`absolute inset-0 bg-linear-to-br ${value.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className={`w-20 h-20 rounded-full bg-linear-to-br ${value.iconBg} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className={`w-10 h-10 ${value.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-gray-800 transition-colors dark:text-white dark:group-hover:text-blue-200">{value.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors dark:text-gray-300 dark:group-hover:text-white">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="py-20 lg:py-32 bg-linear-to-br from-slate-50 to-blue-50 relative overflow-hidden dark:from-slate-950 dark:to-blue-950">
        <div className="absolute top-10 right-10 w-40 h-40 bg-linear-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse dark:from-blue-900 dark:to-purple-900"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-linear-to-br from-indigo-200 to-cyan-200 rounded-full opacity-20 animate-pulse delay-1000 dark:from-indigo-900 dark:to-cyan-900"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 dark:text-white">
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                {t("team.title")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed dark:text-gray-300">
              {t("team.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="animate-on-scroll overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 bg-white group dark:bg-blue-950">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      width={400}
                      height={400}
                      src={member.image}
                      alt={member.name}
                      className="w-full h-80 object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <p className="text-sm font-medium">{member.role}</p>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-4 text-lg dark:text-blue-400">{member.role}</p>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors dark:text-gray-300 dark:group-hover:text-white">{member.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:px-4 bg-[rgb(239,247,246)] dark:bg-blue-950">
        <div className="max-w-[90vw] mx-auto">
          <div className="mb-12">
            <h1 className="font-medium text-3xl text-[#1e1e1e] dark:text-white">
              {t("timeline.title")}
            </h1>
            <p className="font-normal text-xl text-[#00000080] font-['Rubik',Helvetica] dark:text-gray-300">
              {t("timeline.description")}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-dashed border-[#2b6a73]"></div>
            <div className="relative flex flex-col gap-4">
              <span className="top-[50%] sticky left-1/2 transform -translate-x-1/2 bg-[#2b6a73] w-4 h-4 inline-block rounded-full z-20"></span>
              <span className="top-[52%] sticky left-1/2 transform -translate-x-1/2 bg-[#eff7f6]  w-4 h-4 z-10 flex justify-center">
                <div className="w-104 sm:w-120 h-[712px] shrink-0 bg-[#eff7f6] dark:bg-blue-950 z-10"></div>
              </span>
              {timelineItems.map((item, index) => (
                <div key={item.year || index} className="relative">
                  <div
                    className={`flex relative ${item.position === "left" ? "justify-start" : "justify-end"} w-full`}
                  >
                    <span className={`absolute left-1/2 transform -translate-x-1/2 flex items-center ${item.position === "left" ? "justify-end" : "justify-start"} bg-[#2b6a73] w-4 h-4 rounded-full`}>
                      <div className="h-px w-40 sm:w-52 transform -translate-y-1/2 top-1/2 bg-[#2b6a73] shrink-0"></div>
                    </span>
                    <Card
                      className={`bg-transparent w-full max-w-[700px] border-none shadow-none ${item.position === "right" ? "ml-auto" : "mr-auto"}`}
                    >
                      <CardContent className="p-0">
                        <div
                          className={`flex flex-col ${item.position === "right" ? "items-end text-right" : "items-start text-left"}`}
                        >
                          <h2 className="font-medium text-[#1e1e1e] text-xl mb-2 z-20 dark:text-white">
                            {item.title}
                          </h2>
                          <span className="font-normal text-[#2b6a73] text-lg z-20 dark:text-blue-400">
                            {item.year}
                          </span>
                          <p className="font-normal text-[#00000080] z-20 dark:text-gray-300">
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
      <section className="z-50 py-20 lg:py-32 bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg?auto=compress&cs=tinysrgb&w=1920')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/90 to-purple-900/90 dark:from-blue-950/90 dark:to-purple-950/90"></div>

        {/* Animated background elements */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-linear-to-br from-blue-400 to-cyan-400 rounded-full opacity-10 animate-pulse dark:from-blue-800 dark:to-cyan-800"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-linear-to-br from-indigo-400 to-purple-400 rounded-full opacity-10 animate-pulse delay-1000 dark:from-indigo-800 dark:to-purple-800"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-linear-to-br from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse delay-500 dark:from-purple-800 dark:to-pink-800"></div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="bg-linear-to-r from-blue-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400">
              {t("cta.title")}
            </span>
          </h2>
          <p className="text-md md:text-xl text-blue-100 mb-12 leading-relaxed max-w-2xl mx-auto dark:text-blue-200">
            {t("cta.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="mailto:contactdiagnoai@gmail.com">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4 shadow-xl hover:shadow-2xl dark:bg-blue-950 dark:text-white dark:hover:bg-blue-900">
                {t("cta.contactButton")} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
