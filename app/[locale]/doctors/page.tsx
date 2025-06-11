"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Clock, Phone, Calendar, Filter, Search, Users } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAppContext } from "@/context/app-context"
import { SuccessToast } from "@/components/success-toast"

export default function DoctorsPage() {
  const { addAppointment } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedRating, setSelectedRating] = useState("")
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const doctors = [
    {
      id: 1,
      name: "Dr. Aziza Karimova",
      specialty: "Terapevt",
      experience: "15 yil tajriba",
      rating: 4.9,
      reviews: 234,
      distance: "2.3 km",
      hospital: "Respublika Shifoxonasi",
      price: "150,000 so'm",
      availability: "Bugun mavjud",
            image: "/placeholder-doctor.jpg",

      description: "Umumiy amaliyot bo'yicha mutaxassis. Yuqumli kasalliklar va profilaktika bo'yicha tajribali.",
    },
    {
      id: 2,
      name: "Dr. Bobur Toshmatov",
      specialty: "Kardiolog",
      experience: "12 yil tajriba",
      rating: 4.8,
      reviews: 189,
      distance: "3.1 km",
      hospital: "Markaziy Klinika",
      price: "200,000 so'm",
      availability: "Ertaga mavjud",
            image: "/placeholder-doctor.jpg",

      description: "Yurak-qon tomir kasalliklari bo'yicha mutaxassis. Zamonaviy diagnostika usullarini qo'llaydi.",
    },
    {
      id: 3,
      name: "Dr. Malika Rahimova",
      specialty: "Terapevt",
      experience: "8 yil tajriba",
      rating: 4.7,
      reviews: 156,
      distance: "1.8 km",
      hospital: "Oila Klinikasi",
      price: "120,000 so'm",
      availability: "Bugun mavjud",
            image: "/placeholder-doctor.jpg",

      description:
        "Oila shifokori. Bolalar va kattalar bilan ishlash tajribasi. Allergiya va immunitet bo'yicha mutaxassis.",
    },
    {
      id: 4,
      name: "Dr. Anvar Usmonov",
      specialty: "Nevropatolog",
      experience: "20 yil tajriba",
      rating: 4.9,
      reviews: 312,
      distance: "4.2 km",
      hospital: "Ixtisoslashgan Markaz",
      price: "250,000 so'm",
      availability: "3 kun ichida",
            image: "/placeholder-doctor.jpg",

      description:
        "Asab tizimi kasalliklari bo'yicha yetakchi mutaxassis. Migren, epilepsiya va bosh og'riqlari bo'yicha tajribali.",
    },
    {
      id: 5,
      name: "Dr. Nodira Karimova",
      specialty: "Pediatr",
      experience: "10 yil tajriba",
      rating: 4.8,
      reviews: 198,
      distance: "2.8 km",
      hospital: "Bolalar Klinikasi",
      price: "130,000 so'm",
      availability: "Bugun mavjud",
            image: "/placeholder-doctor.jpg",

      description: "Bolalar shifokori. Yangi tug'ilgan chaqaloqlardan 18 yoshgacha bo'lgan bolalar bilan ishlaydi.",
    },
    {
      id: 6,
      name: "Dr. Sardor Rahmonov",
      specialty: "Dermatolog",
      experience: "7 yil tajriba",
      rating: 4.6,
      reviews: 142,
      distance: "3.5 km",
      hospital: "Teri Kasalliklari Markazi",
      price: "180,000 so'm",
      availability: "Ertaga mavjud",
            image: "/placeholder-doctor.jpg",

      description:
        "Teri kasalliklari va kosmetologiya bo'yicha mutaxassis. Zamonaviy lazer texnologiyalarini qo'llaydi.",
    },
  ]

  const specialties = [
    { name: "Terapevt", count: 2, icon: "🩺" },
    { name: "Kardiolog", count: 1, icon: "❤️" },
    { name: "Nevropatolog", count: 1, icon: "🧠" },
    { name: "Pediatr", count: 1, icon: "👶" },
    { name: "Dermatolog", count: 1, icon: "🧴" },
  ]

  const handleCall = (doctorName: string) => {
    setToastMessage(`${doctorName} ga qo'ng'iroq qilinmoqda...`)
    setShowSuccessToast(true)
  }

  const handleBookAppointment = (doctor: any) => {
    addAppointment({
      doctor: doctor.name,
      specialty: doctor.specialty,
      date: "2024-01-25",
      time: "14:00",
      type: "Onlayn konsultatsiya",
      status: "Tasdiqlangan",
    })

    setToastMessage(`${doctor.name} bilan uchrashish belgilandi`)
    setShowSuccessToast(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCity("")
    setSelectedSpecialty("")
    setSelectedRating("")
    setToastMessage("Filtrlar tozalandi")
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Professional Shifokorlar</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tajribali mutaxassislar bilan bog'laning va sifatli tibbiy yordam oling
          </p>
        </div>

        {/* Specialties Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Mutaxassisliklar</span>
            </CardTitle>
            <CardDescription>Mavjud shifokorlar bo'yicha mutaxassisliklar</CardDescription>
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
                  <p className="text-sm text-gray-600">{specialty.count} shifokor</p>
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
                  <span>Filtrlar</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Qidiruv</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Shifokor nomi yoki mutaxassislik..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Shahar</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Shaharni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tashkent">Toshkent</SelectItem>
                      <SelectItem value="samarkand">Samarqand</SelectItem>
                      <SelectItem value="bukhara">Buxoro</SelectItem>
                      <SelectItem value="namangan">Namangan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Mutaxassislik</label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Mutaxassislikni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="terapevt">Terapevt</SelectItem>
                      <SelectItem value="kardiolog">Kardiolog</SelectItem>
                      <SelectItem value="nevropatolog">Nevropatolog</SelectItem>
                      <SelectItem value="pediatr">Pediatr</SelectItem>
                      <SelectItem value="dermatolog">Dermatolog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Reyting</label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Reytingni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.5">4.5+ yulduz</SelectItem>
                      <SelectItem value="4.0">4.0+ yulduz</SelectItem>
                      <SelectItem value="3.5">3.5+ yulduz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  Filtrlarni tozalash
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Doctors List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Shifokorlar ({filteredDoctors.length})</h2>
              <Select defaultValue="rating">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Reyting bo'yicha</SelectItem>
                  <SelectItem value="experience">Tajriba bo'yicha</SelectItem>
                  <SelectItem value="distance">Masofa bo'yicha</SelectItem>
                  <SelectItem value="price">Narx bo'yicha</SelectItem>
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
                          src={doctor.image || "/placeholder-doctor.jpg"}
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
                                <span className="text-gray-500 text-sm">({doctor.reviews} sharh)</span>
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
                                <span className="text-gray-500 text-sm ml-1">/ konsultatsiya</span>
                              </div>

                              <div className="flex space-x-3">
                                <Button variant="outline" size="sm" onClick={() => handleCall(doctor.name)}>
                                  <Phone className="w-4 h-4 mr-1" />
                                  Qo'ng'iroq
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleBookAppointment(doctor)}
                                >
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Qabulga yozilish
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
                Ko'proq shifokorlarni ko'rish
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showSuccessToast && <SuccessToast message={toastMessage} onClose={() => setShowSuccessToast(false)} />}
    </div>
  )
}
