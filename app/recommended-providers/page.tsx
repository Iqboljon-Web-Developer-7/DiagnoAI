"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Clock, Phone, Calendar, Filter, Brain } from "lucide-react"
import Link from "next/link"

export default function RecommendedProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedRating, setSelectedRating] = useState("")

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
      image: "/placeholder.svg?height=80&width=80",
      match: 95,
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
      image: "/placeholder.svg?height=80&width=80",
      match: 88,
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
      image: "/placeholder.svg?height=80&width=80",
      match: 92,
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
      image: "/placeholder.svg?height=80&width=80",
      match: 85,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Diagno AI</span>
            </Link>

            <nav className="flex items-center space-x-6">
              <Link href="/ai-diagnosis" className="text-gray-600 hover:text-blue-600">
                AI Tahlil
              </Link>
              <Link href="/emergency-help" className="text-red-600 hover:text-red-700">
                Shoshilinch Yordam
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                Shaxsiy Kabinet
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analysis Result Summary */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-800">Sizning tashxisingiz asosida</CardTitle>
                <CardDescription className="text-green-700">Viral Infeksiya (ARVI) - Ishonchlilik: 87%</CardDescription>
              </div>
              <Badge className="bg-green-600 text-white">Mos mutaxassislar topildi</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-green-800">
              Sizning holatingizdagi simptomlar asosida quyidagi shifokorlar tavsiya etiladi. AI tahlili natijasida eng
              mos mutaxassislar tanlab berilgan.
            </p>
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
                  <Input
                    placeholder="Shifokor nomi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
                      <SelectItem value="therapist">Terapevt</SelectItem>
                      <SelectItem value="cardiologist">Kardiolog</SelectItem>
                      <SelectItem value="neurologist">Nevropatolog</SelectItem>
                      <SelectItem value="pediatrician">Pediatr</SelectItem>
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

                <Button variant="outline" className="w-full">
                  Filtrlarni tozalash
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Doctors List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Tavsiya etilgan shifokorlar ({doctors.length})</h1>
              <Select defaultValue="match">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Mos kelish bo'yicha</SelectItem>
                  <SelectItem value="rating">Reyting bo'yicha</SelectItem>
                  <SelectItem value="distance">Masofa bo'yicha</SelectItem>
                  <SelectItem value="price">Narx bo'yicha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Doctor Image */}
                      <div className="relative">
                        <img
                          src={doctor.image || "/placeholder.svg"}
                          alt={doctor.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <Badge className="absolute -top-2 -right-2 bg-green-600 text-white text-xs">
                          {doctor.match}%
                        </Badge>
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
                                <Button variant="outline" size="sm">
                                  <Phone className="w-4 h-4 mr-1" />
                                  Qo'ng'iroq
                                </Button>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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
    </div>
  )
}
