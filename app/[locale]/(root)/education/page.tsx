"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Users, Phone, Calendar, Filter, Search } from "lucide-react"
import { useAppStore } from "@/context/store"
import { useTranslations, useMessages } from "next-intl"
import { useToast } from "@/hooks/use-toast"

export default function EducationPage() {
  const translations = useTranslations("education")
  const messages = useMessages()
  const { addAppointment } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedRating, setSelectedRating] = useState("")
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const { toast } = useToast()

  // Extract institution types and institutions from messages
  const institutionTypes = Object.keys(messages.education?.types || {}).map((key) => ({
    name: messages.education.types[key].name,
    count: messages.education.types[key].count,
    icon: messages.education.types[key].icon,
  }))

  const institutions = Object.keys(messages.education?.institutions || {}).map((key) => ({
    id: parseInt(key.replace("institution", "")),
    ...messages.education.institutions[key],
    image: "/placeholder-institution.jpg",
  }))

  const handleCall = (institutionName: string) => {
    setToastMessage(translations("toastMessages.call", { institutionName }))
    setShowSuccessToast(true)
  }

  const handleInquiry = (institution: any) => {
    addAppointment({
      doctor: institution.name, // Using institution name as doctor for consistency
      specialty: institution.type,
      date: "2024-01-25",
      time: "10:00",
      type: translations("institutionCard.inquiryButton"),
      status: translations("toastMessages.inquiry").includes("submitted") ? "Submitted" : "Yuborildi",
    })

    setToastMessage(translations("toastMessages.inquiry", { institutionName: institution.name }))
    setShowSuccessToast(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCity("")
    setSelectedType("")
    setSelectedRating("")
    setToastMessage(translations("toastMessages.clearFilters"))
    setShowSuccessToast(true)
  }

  // Filter institutions based on search criteria
  const filteredInstitutions = institutions.filter((institution) => {
    const matchesSearch =
      institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !selectedType || institution.type.toLowerCase() === selectedType.toLowerCase()
    const matchesRating = !selectedRating || institution.rating >= Number.parseFloat(selectedRating)
    const matchesCity = !selectedCity || institution.city?.toLowerCase() === selectedCity.toLowerCase()

    return matchesSearch && matchesType && matchesRating && matchesCity
  })

  useEffect(() => {
    if (showSuccessToast) {
      toast({ title: toastMessage })
      setShowSuccessToast(false)
    }
  }, [showSuccessToast, toastMessage, toast])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{translations("pageTitle")}</h1>
          <p className="text-xl text-gray-600">{translations("pageDescription")}</p>
        </div>

        {/* Institution Types Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{translations("typesTitle")}</span>
            </CardTitle>
            <CardDescription>{translations("typesDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              {institutionTypes.map((type, index) => (
                <div
                  key={index}
                  className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedType(type.name.toLowerCase())}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <h3 className="font-semibold text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-600">{translations("count", { count: type.count })}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>{translations("filters.title")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{translations("filters.searchLabel")}</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={translations("filters.searchPlaceholder")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{translations("filters.cityLabel")}</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder={translations("filters.cityPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tashkent">{translations("filters.cities.tashkent")}</SelectItem>
                      <SelectItem value="samarkand">{translations("filters.cities.samarkand")}</SelectItem>
                      <SelectItem value="bukhara">{translations("filters.cities.bukhara")}</SelectItem>
                      <SelectItem value="namangan">{translations("filters.cities.namangan")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{translations("filters.typeLabel")}</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder={translations("filters.typePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {institutionTypes.map((type) => (
                        <SelectItem key={type.name} value={type.name.toLowerCase()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{translations("filters.ratingLabel")}</label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger>
                      <SelectValue placeholder={translations("filters.ratingPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.5">4.5</SelectItem>
                      <SelectItem value="4.0">4.0</SelectItem>
                      <SelectItem value="3.5">3.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  {translations("filters.clearFiltersButton")}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Institutions List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{translations("institutionsListTitle", { count: filteredInstitutions.length })}</h2>
              <Select defaultValue="rating">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">{translations("sortOptions.rating")}</SelectItem>
                  <SelectItem value="distance">{translations("sortOptions.distance")}</SelectItem>
                  <SelectItem value="students">{translations("sortOptions.students")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {filteredInstitutions.map((institution) => (
                <Card key={institution.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img
                          src={institution.image}
                          alt={institution.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="w-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{institution.name}</h3>
                            <p className="text-blue-600 font-medium mb-2">{institution.type}</p>
                            <p className="text-gray-600 text-sm mb-3">{institution.address}</p>

                            <p className="text-gray-700 mb-3">{institution.description}</p>

                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{institution.rating}</span>
                                <span className="text-gray-500 text-sm">{translations("institutionCard.reviews", { count: institution.reviews })}</span>
                              </div>

                              <div className="flex items-center space-x-1 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{institution.distance}</span>
                              </div>

                              <div className="flex items-center space-x-1 text-gray-600">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">{institution.students} {translations("institutionCard.students")}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg font-bold text-gray-900">{institution.programs}</span>
                                <span className="text-gray-500 text-sm ml-1">{translations("institutionCard.programsSuffix")}</span>
                              </div>

                              <div className="flex space-x-3">
                                <Button variant="outline" size="sm" onClick={() => handleCall(institution.name)}>
                                  <Phone className="w-4 h-4 mr-1" />
                                  {translations("institutionCard.callButton")}
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleInquiry(institution)}
                                >
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {translations("institutionCard.inquiryButton")}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                {translations("loadMoreButton")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}