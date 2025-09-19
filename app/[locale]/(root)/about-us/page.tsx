"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Shield, Clock, Users, Award, Globe, Heart, ArrowRight, CheckCircle, Zap, Target, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"


import Javohir from "@/assets/images/about/Javohir.jpg"
import Sunnatillo from "@/assets/images/about/Sunnatillo.webp"
import Iqboljon from "@/assets/images/about/Iqboljon.jpg"
import Shahobiddin from "@/assets/images/about/Shahobiddin.jpg"
import Firdavs from "@/assets/images/about/Firdavs.jpg"
// Mock translation function - replace with your actual i18n implementation
// const useTranslations = () => {
//   return (key: string) => {
//     const translations: Record<string, string> = {
//       "hero.title": "About Us",
//       "hero.description": "Diagno AI is an innovative platform providing medical diagnostics and doctor recommendations powered by artificial intelligence",
      
//       "mission.title": "Our Mission",
//       "mission.description1": "The primary goal of the Diagno AI platform is to expand access to quality medical care and make healthcare services universally accessible using artificial intelligence technologies.",
//       "mission.description2": "We aim to improve communication between doctors and patients, accelerate the diagnostic process, and enhance the healthcare system by providing remote medical services.",
//       "mission.checklist.item1": "Making medical services universally accessible",
//       "mission.checklist.item2": "Accelerating the diagnostic process",
//       "mission.checklist.item3": "Improving communication between doctors and patients",
//       "mission.checklist.item4": "Providing remote medical care",
      
//       "mission.stats.users.value": "100,000+",
//       "mission.stats.users.label": "Users",
//       "mission.stats.analyses.value": "500,000+",
//       "mission.stats.analyses.label": "AI Analyses",
//       "mission.stats.accuracy.value": "95%",
//       "mission.stats.accuracy.label": "Accuracy Rate",
//       "mission.stats.countries.value": "10+",
//       "mission.stats.countries.label": "Countries",
      
//       "values.title": "Our Values",
//       "values.description": "The Diagno AI platform is built on the following core values",
//       "values.value1.title": "Reliability and Security",
//       "values.value1.description": "User data security and privacy are our top priorities. All data is encrypted and stored in compliance with medical standards.",
//       "values.value2.title": "Quality and Accuracy",
//       "values.value2.description": "Our AI algorithms are continuously improved and updated with the latest medical data. We strive for the highest level of accuracy.",
//       "values.value3.title": "Speed and Convenience",
//       "values.value3.description": "We provide users with fast and convenient access to medical care anytime, anywhere. 24/7 service is our core principle.",
      
//       "team.title": "Our Team",
//       "team.description": "Meet the passionate individuals driving Diagno AI's mission to transform healthcare.",
//       "team.members.member1.name": "Sunnat Panjiyev Sherzod o'g'li",
//       "team.members.member1.role": "Co-Founder & Lawyer",
//       "team.members.member1.description": "Graduated from Tashkent State Law University, Bachelor's degree. Experience: 2022-2025.",
//       "team.members.member2.name": "Javohir Jahonov Jasur o'g'li",
//       "team.members.member2.role": "Founder & Backend Developer",
//       "team.members.member2.description": "Graduated from PDP University, Bachelor's degree. Experience: 2023-2027.",
//       "team.members.member3.name": "Iqboljon Ummataliyev Kamoliddin o'g'li",
//       "team.members.member3.role": "Frontend Developer",
//       "team.members.member3.description": "Graduated from Najot Ta'lim, IT Park & SAMMI. Experience: 2022-2025.",
//       "team.members.member4.name": "Firdavs Safarmakhmadov",
//       "team.members.member4.role": "Web Designer & Graphic Designer",
//       "team.members.member4.description": "Graduated from ProWeb & Central Asian University, Bachelor's degree. Experience: 2023-2027.",
//       "team.members.member5.name": "Shahobiddin",
//       "team.members.member5.role": "AI Specialist",
//       "team.members.member5.description": "Graduated from PDP University, Bachelor's degree. Experience: 2023-2027.",
      
//       "timeline.title": "Our History",
//       "timeline.description": "The journey of the Diagno AI platform",
//       "timeline.items.item1.year": "February 2025",
//       "timeline.items.item1.title": "The Beginning",
//       "timeline.items.item1.description": "We assembled a team of top experts passionate about AI and healthcare. Our goal was to identify and solve the most pressing medical challenges.",
//       "timeline.items.item2.year": "March 2025",
//       "timeline.items.item2.title": "Problem Identification",
//       "timeline.items.item2.description": "Through extensive analysis and meetings with doctors, we identified delayed early diagnostics as the biggest challenge.",
//       "timeline.items.item3.year": "April 2025",
//       "timeline.items.item3.title": "First Prototype",
//       "timeline.items.item3.description": "We created a minimal working AI model and began testing it in small clinics.",
//       "timeline.items.item4.year": "May 2025",
//       "timeline.items.item4.title": "Initial Results",
//       "timeline.items.item4.description": "Tests were positive — the model successfully detected certain diseases much faster.",
//       "timeline.items.item5.year": "August 2025",
//       "timeline.items.item5.title": "Expansion Plans",
//       "timeline.items.item5.description": "Negotiations began to attract investment and collaborate with more clinics.",
      
//       "cta.title": "Join Our Team",
//       "cta.description": "Collaborate with the Diagno AI platform and contribute to advancing healthcare services",
//       "cta.contactButton": "Contact Us",
//       "cta.careersButton": "Careers"
//     }
//     return translations[key] || key
//   }
// }

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
}

export default function AboutPage() {
  const t = useTranslations("about")
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    setIsVisible(true)
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
            setActiveSection(entry.target.id)
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
    }
  ]

  const timelineItems: TimelineItem[] = [
    {
      year: t("timeline.items.item1.year"),
      title: t("timeline.items.item1.title"),
      description: t("timeline.items.item1.description")
    },
    {
      year: t("timeline.items.item2.year"),
      title: t("timeline.items.item2.title"),
      description: t("timeline.items.item2.description")
    },
    {
      year: t("timeline.items.item3.year"),
      title: t("timeline.items.item3.title"),
      description: t("timeline.items.item3.description")
    },
    {
      year: t("timeline.items.item4.year"),
      title: t("timeline.items.item4.title"),
      description: t("timeline.items.item4.description")
    },
    {
      year: t("timeline.items.item5.year"),
      title: t("timeline.items.item5.title"),
      description: t("timeline.items.item5.description")
    }
  ]

  const statsData = [
    { icon: Users, value: t("mission.stats.users.value"), label: t("mission.stats.users.label"), color: "text-blue-600", bgColor: "from-blue-50 to-blue-100" },
    { icon: Brain, value: t("mission.stats.analyses.value"), label: t("mission.stats.analyses.label"), color: "text-emerald-600", bgColor: "from-emerald-50 to-emerald-100" },
    { icon: Target, value: t("mission.stats.accuracy.value"), label: t("mission.stats.accuracy.label"), color: "text-rose-600", bgColor: "from-rose-50 to-rose-100" },
    { icon: Globe, value: t("mission.stats.countries.value"), label: t("mission.stats.countries.label"), color: "text-purple-600", bgColor: "from-purple-50 to-purple-100" }
  ]

  const valuesData = [
    { 
      icon: Shield, 
      title: t("values.value1.title"), 
      description: t("values.value1.description"), 
      color: "text-blue-600",
      bgGradient: "from-blue-500 to-cyan-500",
      iconBg: "from-blue-50 to-blue-100"
    },
    { 
      icon: Award, 
      title: t("values.value2.title"), 
      description: t("values.value2.description"), 
      color: "text-emerald-600",
      bgGradient: "from-emerald-500 to-teal-500",
      iconBg: "from-emerald-50 to-emerald-100"
    },
    { 
      icon: Zap, 
      title: t("values.value3.title"), 
      description: t("values.value3.description"), 
      color: "text-purple-600",
      bgGradient: "from-purple-500 to-indigo-500",
      iconBg: "from-purple-50 to-purple-100"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&w=1920')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-15 animate-pulse delay-500"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                  {t("hero.title")}
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                {t("hero.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4">
                 {t("learnMore")} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-blue-900 transition-all duration-300 text-lg px-8 py-4">
                  <Eye className="mr-2 w-5 h-5" />
                  {t("watchDemo")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll">
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t("mission.title")}
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t("mission.description1")}
              </p>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                {t("mission.description2")}
              </p>
              
              <div className="space-y-6">
                {["item1", "item2", "item3", "item4"].map((item, index) => (
                  <div key={item} className="flex items-start space-x-4 group hover:bg-blue-50 p-4 rounded-xl transition-all duration-300">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mt-1 transition-transform group-hover:scale-110" />
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                      {t(`mission.checklist.${item}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animate-on-scroll">
              <div className="grid grid-cols-2 gap-6">
                {statsData.map((stat, index) => (
                  <Card key={index} className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden group">
                    <CardContent className="pt-8 pb-6 relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      <div className="relative z-10">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">{stat.value}</h3>
                        <p className="text-gray-600 text-lg group-hover:text-gray-700 transition-colors">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("values.title")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("values.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {valuesData.map((value, index) => (
              <Card key={index} className="animate-on-scroll bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 overflow-hidden group">
                <CardContent className="pt-12 pb-8 text-center relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${value.iconBg} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className={`w-10 h-10 ${value.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-gray-800 transition-colors">{value.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-indigo-200 to-cyan-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("team.title")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("team.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="animate-on-scroll overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 bg-white group">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      width={400}
                      height={400}
                      src={member.image}
                      alt={member.name}
                      className="w-full h-80 object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <p className="text-sm font-medium">{member.role}</p>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-4 text-lg">{member.role}</p>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">{member.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("timeline.title")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("timeline.description")}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-indigo-600 rounded-full"></div>
            
            {timelineItems.map((item, index) => (
              <div key={index} className={`relative flex items-center mb-16 animate-on-scroll ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group overflow-hidden">
                    <CardContent className="p-8 relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${index % 2 === 0 ? 'from-blue-50 to-purple-50' : 'from-purple-50 to-indigo-50'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      <div className="relative z-10">
                        <div className={`flex items-center mb-4 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${index % 2 === 0 ? 'from-blue-600 to-purple-600' : 'from-purple-600 to-indigo-600'} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {index + 1}
                          </div>
                        </div>
                        <span className="text-blue-600 font-bold text-xl mb-2 block group-hover:text-purple-600 transition-colors">{item.year}</span>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">{item.title}</h3>
                        <p className="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br ${index % 2 === 0 ? 'from-blue-600 to-purple-600' : 'from-purple-600 to-indigo-600'} rounded-full border-4 border-white shadow-lg z-10 animate-pulse`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg?auto=compress&cs=tinysrgb&w=1920')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse delay-500"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 animate-on-scroll">
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent">
              {t("cta.title")}
            </span>
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed max-w-2xl mx-auto">
            {t("cta.description")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4 shadow-xl hover:shadow-2xl">
                {t("cta.contactButton")} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/careers">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4 shadow-xl hover:shadow-2xl"
              >
                {t("cta.careersButton")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}