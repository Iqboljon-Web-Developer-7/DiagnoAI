"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Shield, Clock, Users, Award, Globe, Heart, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useTranslations, useMessages } from "next-intl"

import AlisherKarimovImage from "@/assets/images/doctor/doctor-man-1.jpg"
import DilnozaRahimovaImage from "@/assets/images/doctor/doctor-woman-1.jpg"
import BoburToshmatovImage from "@/assets/images/doctor/doctor-man-2.jpg"
import MalikaUsmonovaImage from "@/assets/images/doctor/doctor-woman-2.jpg"

export default function AboutPage() {
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
  const milestones = Object.keys(messages.about?.history?.milestones || {}).map((key) => ({
    year: messages.about.history.milestones[key].year,
    title: messages.about.history.milestones[key].title,
    description: messages.about.history.milestones[key].description,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">{translations("hero.title")}</h1>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">{translations("hero.description")}</p>
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
                {["item1", "item2", "item3", "item4"].map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                    <p className="text-gray-700">{translations(`mission.checklist.${item}`)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{translations("mission.stats.users.value")}</h3>
                    <p className="text-gray-600">{translations("mission.stats.users.label")}</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Brain className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{translations("mission.stats.analyses.value")}</h3>
                    <p className="text-gray-600">{translations("mission.stats.analyses.label")}</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{translations("mission.stats.accuracy.value")}</h3>
                    <p className="text-gray-600">{translations("mission.stats.accuracy.label")}</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
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
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{translations("values.title")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{translations("values.description")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {["value1", "value2", "value3"].map((value, index) => (
              <Card key={value} className="text-center border-0 shadow-lg">
                <CardContent className="pt-6">
                  {index === 0 && <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />}
                  {index === 1 && <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />}
                  {index === 2 && <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />}
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
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{translations("team.title")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{translations("team.description")}</p>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{translations("history.title")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{translations("history.description")}</p>
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
    </div>
  )
}