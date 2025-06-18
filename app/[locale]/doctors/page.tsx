"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Clock, Phone, Calendar, Filter, Search, Users } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { SuccessToast } from "@/components/success-toast"
import { useTranslations, useMessages } from "next-intl"

export default function DoctorsPage() {
  const translations = useTranslations("doctors")
  const messages = useMessages()
  const { addAppointment } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedRating, setSelectedRating] = useState("")
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Extract specialties and doctors from messages
  const specialties = Object.keys(messages.doctors?.specialties || {}).map((key) => ({
    name: messages.doctors.specialties[key].name,
    count: messages.doctors.specialties[key].count,
    icon: messages.doctors.specialties[key].icon,
  }))

  const doctors = Object.keys(messages.doctors?.doctors || {}).map((key) => ({
    id: parseInt(key.replace("doctor", "")),
    ...messages.doctors.doctors[key],
    image: "/placeholder-doctor.jpg",
  }))

  const handleCall = (doctorName: string) => {
    setToastMessage(translations("toastMessages.call", { doctorName }))
    setShowSuccessToast(true)
  }

  const handleBookAppointment = (doctor: any) => {
    addAppointment({
      doctor: doctor.name,
      specialty: doctor.specialty,
      date: "2024-01-25",
      time: "14:00",
      type: translations("doctorCard.bookButton"), // Translated appointment type
      status: translations("toastMessages.bookAppointment").includes("confirmed") ? "Confirmed" : "Tasdiqlangan",
    })

    setToastMessage(translations("toastMessages.bookAppointment", { doctorName: doctor.name }))
    setShowSuccessToast(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCity("")
    setSelectedSpecialty("")
    setSelectedRating("")
    setToastMessage(translations("toastMessages.clearFilters"))
    setShowSuccessToast(true)
  }

  // Filter doctors based on search criteria
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty =
      !selectedSpecialty || doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
    const matchesRating = !selectedRating || doctor.rating >= Number.parseFloat(selectedRating)

    return matchesSearch && matchesSpecialty && matchesRating
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{translations("pageTitle")}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{translations("pageDescription")}</p>
        </div>

        {/* Specialties Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{translations("specialtiesTitle")}</span>
            </CardTitle>
            <CardDescription>{translations("specialtiesDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              {specialties.map((specialty, index) => (
                <div
                  key={index}
                  className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedSpecialty(specialty.name.toLowerCase())}
                >
                  <div className="text-2xl mb-2">{specialty.icon}</div>
                  <h3 className="font-semibold text-gray-900">{specialty.name}</h3>
                  <p className="text-sm text-gray-600">{translations("count", { count: specialty.count })}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
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
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{translations("filters.specialtyLabel")}</label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder={translations("filters.specialtyPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty.name} value={specialty.name.toLowerCase()}>
                          {specialty.name}
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

          {/* Doctors List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{translations("doctorsListTitle", { count: filteredDoctors.length })}</h2>
              <Select defaultValue="rating">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">{translations("sortOptions.rating")}</SelectItem>
                  <SelectItem value="experience">{translations("sortOptions.experience")}</SelectItem>
                  <SelectItem value="distance">{translations("sortOptions.distance")}</SelectItem>
                  <SelectItem value="price">{translations("sortOptions.price")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Doctor Image */}
                      <div className="relative">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                            <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                            <p className="text-gray-600 text-sm mb-3">
                              {doctor.experience} • {doctor.hospital}
                            </p>

                            <p className="text-gray-700 mb-3">{doctor.description}</p>

                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{doctor.rating}</span>
                                <span className="text-gray-500 text-sm">{translations("doctorCard.reviews", { count: doctor.reviews })}</span>
                              </div>

                              <div className="flex items-center space-x-1 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{doctor.distance}</span>
                              </div>

                              <div className="flex items-center space-x-1 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{doctor.availability}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg font-bold text-gray-900">{doctor.price}</span>
                                <span className="text-gray-500 text-sm ml-1">{translations("doctorCard.consultationPriceSuffix")}</span>
                              </div>

                              <div className="flex space-x-3">
                                <Button variant="outline" size="sm" onClick={() => handleCall(doctor.name)}>
                                  <Phone className="w-4 h-4 mr-1" />
                                  {translations("doctorCard.callButton")}
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleBookAppointment(doctor)}
                                >
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {translations("doctorCard.bookButton")}
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

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                {translations("loadMoreButton")}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showSuccessToast && <SuccessToast message={toastMessage} onClose={() => setShowSuccessToast(false)} />}
    </div>
  )
}