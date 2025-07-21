"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Phone, Calendar, Filter, Search, Hospital } from "lucide-react"
import { useAppStore } from "@/context/store"
import { useTranslations, useMessages } from "next-intl"
import { useToast } from "@/hooks/use-toast"

export default function HospitalsPage({ params }: { params: { locale: string } }) {
  const translations = useTranslations("hospitals")
  const messages = useMessages()
  const { addAppointment } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedRating, setSelectedRating] = useState("")
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const { toast } = useToast()

  // Extract hospital types and hospitals from messages
  const hospitalTypes = Object.keys(messages.hospitals?.types || {}).map((key) => ({
    name: messages.hospitals.types[key].name,
    count: messages.hospitals.types[key].count,
    icon: messages.hospitals.types[key].icon,
  }))

  const hospitals = Object.keys(messages.hospitals?.hospitals || {}).map((key) => ({
    id: parseInt(key.replace("hospital", "")),
    ...messages.hospitals.hospitals[key],
    image: "/placeholder-hospital.jpg",
  }))

  const handleCall = (hospitalName: string) => {
    setToastMessage(translations("toastMessages.call", { hospitalName }))
    setShowSuccessToast(true)
  }

  const handleBookAppointment = (hospital: any) => {
    addAppointment({
      doctor: hospital.name, // Using hospital name as doctor for consistency
      specialty: hospital.type,
      date: "2024-01-25",
      time: "14:00",
      type: translations("hospitalCard.bookButton"),
      status: translations("toastMessages.bookAppointment").includes("confirmed") ? "Confirmed" : "Tasdiqlangan",
    })

    setToastMessage(translations("toastMessages.bookAppointment", { hospitalName: hospital.name }))
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

  // Filter hospitals based on search criteria
  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !selectedType || hospital.type.toLowerCase() === selectedType.toLowerCase()
    const matchesRating = !selectedRating || hospital.rating >= Number.parseFloat(selectedRating)
    const matchesCity = !selectedCity || hospital.city?.toLowerCase() === selectedCity.toLowerCase()

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

        {/* Hospital Types Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{translations("typesTitle")}</span>
            </CardTitle>
            <CardDescription>{translations("typesDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              {hospitalTypes.map((type, index) => (
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
                      {hospitalTypes.map((type) => (
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

          {/* Hospitals List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{translations("hospitalsListTitle", { count: filteredHospitals.length })}</h2>
              <Select defaultValue="rating">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">{translations("sortOptions.rating")}</SelectItem>
                  <SelectItem value="distance">{translations("sortOptions.distance")}</SelectItem>
                  <SelectItem value="beds">{translations("sortOptions.beds")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {filteredHospitals.map((hospital) => (
                <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img
                          src={hospital.image}
                          alt={hospital.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="w-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{hospital.name}</h3>
                            <p className="text-blue-600 font-medium mb-2">{hospital.type}</p>
                            <p className="text-gray-600 text-sm mb-3">{hospital.address}</p>

                            <p className="text-gray-700 mb-3">{hospital.description}</p>

                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{hospital.rating}</span>
                                <span className="text-gray-500 text-sm">{translations("hospitalCard.reviews", { count: hospital.reviews })}</span>
                              </div>

                              <div className="flex items-center space-x-1 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{hospital.distance}</span>
                              </div>

                              <div className="flex items-center space-x-1 text-gray-600">
                                <Hospital className="w-4 h-4" />
                                <span className="text-sm">{hospital.beds} {translations("hospitalCard.beds")}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg font-bold text-gray-900">{hospital.services}</span>
                                <span className="text-gray-500 text-sm ml-1">{translations("hospitalCard.servicesSuffix")}</span>
                              </div>

                              <div className="flex space-x-3">
                                <Button variant="outline" size="sm" onClick={() => handleCall(hospital.name)}>
                                  <Phone className="w-4 h-4 mr-1" />
                                  {translations("hospitalCard.callButton")}
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleBookAppointment(hospital)}
                                >
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {translations("hospitalCard.bookButton")}
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