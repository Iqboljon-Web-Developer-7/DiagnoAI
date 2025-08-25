"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Clock, Phone, Calendar, Filter } from "lucide-react"
import { useAppStore } from "@/context/store"
import { useTranslations } from 'next-intl'
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function RecommendedProvidersPage() {
  const { addAppointment } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedRating, setSelectedRating] = useState("")
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const t = useTranslations('RecommendedProviders')

  const doctors = [
    {
      id: 1,
      name: "Dr. Aziza Karimova",
      specialty: t('specialtyTerapevt'),
      experience: t('doctorExperience', { years: 15 }),
      rating: 4.9,
      reviews: 234,
      distance: "2.3 km",
      hospital: "Respublika Shifoxonasi",
      price: "150,000 so'm",
      availability: t("availibility"),
      image: "/placeholder-doctor.jpg",
      match: 95,
    },
    {
      id: 2,
      name: "Dr. Bobur Toshmatov",
      specialty: t('specialtyKardiolog'),
      experience: t('doctorExperience', { years: 12 }),
      rating: 4.8,
      reviews: 189,
      distance: "3.1 km",
      hospital: "Markaziy Klinika",
      price: "200,000 so'm",
      availability: t("availibility"),
      image: "/placeholder-doctor.jpg",
      match: 88,
    },
    {
      id: 3,
      name: "Dr. Malika Rahimova",
      specialty: t('specialtyTerapevt'),
      experience: t('doctorExperience', { years: 8 }),
      rating: 4.7,
      reviews: 156,
      distance: "1.8 km",
      hospital: "Oila Klinikasi",
      price: "120,000 so'm",
      availability: t("availibility"),
      image: "/placeholder-doctor.jpg",
      match: 92,
    },
    {
      id: 4,
      name: "Dr. Anvar Usmonov",
      specialty: t('specialtyNevropatolog'),
      experience: t('doctorExperience', { years: 20 }),
      rating: 4.9,
      reviews: 312,
      distance: "4.2 km",
      hospital: "Ixtisoslashgan Markaz",
      price: "250,000 so'm",
      availability: t("availibility"),
      image: "/placeholder-doctor.jpg",
      match: 85,
    },
  ]

  const handleCall = (doctorName: string) => {
    setToastMessage(t('toastCalling', { doctorName }))
    setShowSuccessToast(true)
  }

  const handleBookAppointment = (doctor: {
    name: string;
    specialty: string;
  }) => {
    addAppointment({
      doctor: doctor.name,
      specialty: doctor.specialty,
      date: "2024-01-25",
      time: "14:00",
      type: "Onlayn konsultatsiya",
      status: "Tasdiqlangan",
    })
    setToastMessage(t('toastBooked', { doctorName: doctor.name }))
    setShowSuccessToast(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCity("")
    setSelectedSpecialty("")
    setSelectedRating("")
    setToastMessage(t('toastFiltersCleared'))
    setShowSuccessToast(true)
  }

  // Filter doctors based on search criteria
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty =
      !selectedSpecialty || doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
    const matchesRating = !selectedRating || doctor.rating >= Number.parseFloat(selectedRating)

    return matchesSearch && matchesSpecialty && matchesRating
  })

  const { toast } = useToast()

  useEffect(() => {
    if (showSuccessToast) {
      toast({
        title: toastMessage,
      });
    }
  }, [showSuccessToast, toast, toastMessage])


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 py-4 sm:py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Analysis Result Summary */}
        {/* <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-800">{t('analysisSummaryTitle')}</CardTitle>
                <CardDescription className="text-green-700">{t('analysisSummaryDescription')}</CardDescription>
              </div>
              <Badge className="bg-green-600 text-white">{t('analysisSummaryBadge')}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-green-800">{t('analysisSummaryText')}</p>
          </CardContent>
        </Card> */}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>{t('filters')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t('searchLabel')}</label>
                  <Input
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t('cityLabel')}</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('cityPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tashkent">{t('cityTashkent')}</SelectItem>
                      <SelectItem value="samarkand">{t('citySamarkand')}</SelectItem>
                      <SelectItem value="bukhara">{t('cityBukhara')}</SelectItem>
                      <SelectItem value="namangan">{t('cityNamangan')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t('specialtyLabel')}</label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('specialtyPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="terapevt">{t('specialtyTerapevt')}</SelectItem>
                      <SelectItem value="kardiolog">{t('specialtyKardiolog')}</SelectItem>
                      <SelectItem value="nevropatolog">{t('specialtyNevropatolog')}</SelectItem>
                      <SelectItem value="pediatr">{t('specialtyPediatr')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t('ratingLabel')}</label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('ratingPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.5">{t('rating45')}</SelectItem>
                      <SelectItem value="4.0">{t('rating40')}</SelectItem>
                      <SelectItem value="3.5">{t('rating35')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  {t('clearFilters')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Doctors List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {t('recommendedDoctorsTitle', { count: filteredDoctors?.length })}
              </h1>
              <Select defaultValue="match">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">{t('sortMatch')}</SelectItem>
                  <SelectItem value="rating">{t('sortRating')}</SelectItem>
                  <SelectItem value="distance">{t('sortDistance')}</SelectItem>
                  <SelectItem value="price">{t('sortPrice')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 flex-col sm:flex-row">
                      <div className="relative">
                        <Image
                          width={80}
                          height={80}
                          src={doctor.image || "/placeholder-doctor.jpg"}
                          alt={doctor.name}
                          className="w-12 h-12 sm:w-20 sm:h-20 rounded-full object-cover"
                        />
                        <Badge className="absolute -top-2 -right-2 bg-green-600 text-white text-xs">
                          {doctor.match}%
                        </Badge>
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1 w-full">
                        <div className="flex items-start justify-between w-full">
                          <div className="w-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                            <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                            <p className="text-gray-600 text-sm mb-3">
                              {doctor.experience} • {doctor.hospital}
                            </p>

                            <div className="flex items-center space-x-4 mb-3 flex-wrap gap-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{doctor.rating}</span>
                                <span className="text-gray-500 text-sm">{t('doctorReviews', { count: doctor.reviews })}</span>
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

                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <span className="text-lg font-bold text-gray-900">{doctor.price}</span>
                                <span className="text-gray-500 text-sm ml-1">{t('doctorConsultation')}</span>
                              </div>

                              <div className="flex gap-3">
                                <Button className="w-full sm:w-auto" variant="outline" size="sm" onClick={() => handleCall(doctor.name)}>
                                  <Phone className="w-4 h-4 mr-1" />
                                  {t('call')}
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                                  onClick={() => handleBookAppointment(doctor)}
                                >
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {t('bookAppointment')}
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
                {t('seeMoreDoctors')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
