"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Phone, Calendar, Filter, Search, HospitalIcon } from "lucide-react"
import { useAppStore } from "@/context/store"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useBookAppointmentMutation, useGetHospitals } from "./api"
import { Hospital, HospitalType  } from "./types"

// Haversine formula to calculate distance
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

interface ClientHospitalsPageProps {
  hospitals: Hospital[]
  error: string | null
}

export default function ClientHospitalsPage() {


  const t = useTranslations("hospitals")
  const { latitude, longitude, setLocation, addAppointment, user } = useAppStore()

  const router = useRouter()

  const { data: initialHospitals = [], error } = useGetHospitals(user?.token)

  // Client-side state
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedRating, setSelectedRating] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Book appointment mutation
  const bookAppointmentMutation = useBookAppointmentMutation(user?.token)

  // Get user location on client-side
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude)
        },
        (err) => {
          console.error("Geolocation failed:", err)
          toast.error(
            t("toastMessages.geolocationError") || "Failed to get location",
          )
        }
      )
    }
  }, [setLocation, toast, t])

  // Update hospital distances when location changes
  useEffect(() => {
    if (latitude && longitude) {
      setHospitals((prevHospitals) =>
        prevHospitals.map((hospital) => ({
          ...hospital,
          distance: haversine(latitude, longitude, hospital.latitude, hospital.longitude),
        }))
      )
    }
  }, [latitude, longitude])

  // Derive hospital types
  const hospitalTypes: HospitalType[] = Array.from(new Set(hospitals.map((hospital) => hospital.type || "General"))).map(
    (type) => ({
      name: type,
      count: hospitals.filter((h) => (h.type || "General") === type).length,
      icon: "🏥",
    })
  )

  // Derive cities
  const citiesArray = Array.from(new Set(hospitals.map((hospital) => hospital.address?.split(",")[1]?.trim() || "Unknown"))).filter(
    (city) => city !== "Unknown"
  )
  const cities = citiesArray.length > 0 ? citiesArray : ["Tashkent", "Samarkand", "Bukhara", "Namangan"]

  // Filter and sort hospitals
  const filteredHospitals = hospitals
    .filter((hospital) => {
      const matchesSearch =
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hospital.type || "").toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = !selectedType || (hospital.type || "General").toLowerCase() === selectedType.toLowerCase()
      const matchesRating = !selectedRating || (hospital.rating || 0) >= Number.parseFloat(selectedRating)
      const matchesCity = !selectedCity || hospital.address?.toLowerCase().includes(selectedCity.toLowerCase())
      return matchesSearch && matchesType && matchesRating && matchesCity
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
      if (sortBy === "distance") return (a.distance || 0) - (b.distance || 0)
      if (sortBy === "beds") return (b.beds || 0) - (a.beds || 0)
      return 0
    })

  // Handle call button
  const handleCall = (hospitalName: string) => {
    setToastMessage(t("toastMessages.call", { hospitalName }))
    setShowSuccessToast(true)
  }

  // Handle book appointment
  const handleBookAppointment = async (hospital: Hospital) => {
    if (!user) {
      toast.error(
        t("toastMessages.authRequired") || "Please sign in to book an appointment",
      )
      router.push("/auth/login")
      return
    }

    try {
      await bookAppointmentMutation.mutateAsync(
        {
          userId: user.id,
          latitude: latitude || 0,
          longitude: longitude || 0,
          hospitalName: hospital.name,
          type: hospital.type || "General",
        },
        {
          onSuccess: () => {
            addAppointment({
              doctor: hospital.name,
              specialty: hospital.type || "General",
              date: new Date().toISOString().split("T")[0],
              time: "14:00",
              type: t("hospitalCard.bookButton") || "Appointment",
              status: "Tasdiqlangan",
            })
            toast(
              t("toastMessages.bookAppointment", { hospitalName: hospital.name }) || `Appointment booked at ${hospital.name}`,
            )
          },
          onError: () => {
            toast.error(
              t("toastMessages.error") || "Failed to book appointment",
            )
          },
        }
      )
    } catch (error) {
      console.error("Error booking appointment:", error)
    }
  }

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCity("")
    setSelectedType("")
    setSelectedRating("")
    setToastMessage(t("toastMessages.clearFilters") || "Filters cleared")
    setShowSuccessToast(true)
  }

  // Show toast
  useEffect(() => {
    if (showSuccessToast) {
      toast(toastMessage)
      setShowSuccessToast(false)
    }
  }, [showSuccessToast, toastMessage, toast])

  if (error) {
    if ((error as any)?.response?.status === 401) {
      router.push('/auth/login')
      toast.error(
        t("toastMessages.authRequired") || "Please sign in to view hospitals",
      )
    }
    return <div className="text-center py-8 text-red-600">
      {error?.message}
      <p>{(error as any)?.response?.data?.detail || error?.message}</p>
    </div>
  }

  return (
    <>
      {/* Hospital Types Grid */}
      <div className="grid md:grid-cols-5 gap-4">
        {hospitalTypes.map((type, index) => (
          <div
            key={index}
            className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedType(type.name.toLowerCase())}
          >
            <div className="text-2xl mb-2">{type.icon}</div>
            <h3 className="font-semibold text-gray-900">{type.name}</h3>
            <p className="text-sm text-gray-600">{t("count", { count: type.count }) || `${type.count} hospitals`}</p>
          </div>
        ))}
      </div>

      {/* Filters and Hospitals List */}
      <div className="grid lg:grid-cols-4 gap-8 mt-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>{t("filters.title") || "Filters"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t("filters.searchLabel") || "Search"}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t("filters.searchPlaceholder") || "Search hospitals or types"}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t("filters.cityLabel") || "City"}</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filters.cityPlaceholder") || "Select a city"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city.toLowerCase()}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t("filters.typeLabel") || "Type"}</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filters.typePlaceholder") || "Select a type"} />
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
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t("filters.ratingLabel") || "Rating"}</label>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filters.ratingPlaceholder") || "Select a rating"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4.5">4.5</SelectItem>
                    <SelectItem value="4.0">4.0</SelectItem>
                    <SelectItem value="3.5">3.5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full" onClick={clearFilters}>
                {t("filters.clearFiltersButton") || "Clear Filters"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Hospitals List */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("hospitalsListTitle", { count: filteredHospitals?.length || 0 }) || `${filteredHospitals?.length || 0} Hospitals`}
            </h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">{t("sortOptions.rating") || "Sort by Rating"}</SelectItem>
                <SelectItem value="distance">{t("sortOptions.distance") || "Sort by Distance"}</SelectItem>
                <SelectItem value="beds">{t("sortOptions.beds") || "Sort by Beds"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            {filteredHospitals.map((hospital) => (
              <Card
                onClick={() => router.push(`/hospitals/${hospital.id}`)}
                key={hospital.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Image
                        width={200}
                        height={200}
                        src={`https://api.diagnoai.uz${hospital.image}`}
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
                              <span className="font-medium">{hospital.rating || "N/A"}</span>
                              <span className="text-gray-500 text-sm">
                                {t("hospitalCard.reviews", { count: hospital.reviews || 0 }) || `${hospital.reviews || 0} reviews`}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{hospital.distance ? `${hospital.distance.toFixed(2)} km` : "N/A"}</span>
                            </div>

                            <div className="flex items-center space-x-1 text-gray-600">
                              <HospitalIcon className="w-4 h-4" />
                              <span className="text-sm">{hospital.beds || "N/A"} {t("hospitalCard.beds") || "beds"}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-gray-900">{hospital.services || "N/A"}</span>
                              <span className="text-gray-500 text-sm ml-1">{t("hospitalCard.servicesSuffix") || "services"}</span>
                            </div>

                            <div className="flex space-x-3">
                              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleCall(hospital.name); }}>
                                <Phone className="w-4 h-4 mr-1" />
                                {t("hospitalCard.callButton") || "Call"}
                              </Button>
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={(e) => { e.stopPropagation(); handleBookAppointment(hospital); }}
                              >
                                <Calendar className="w-4 h-4 mr-1" />
                                {t("hospitalCard.bookButton") || "Book Appointment"}
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
              {t("loadMoreButton") || "Load More"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}