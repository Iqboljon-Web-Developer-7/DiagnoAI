"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Calendar, Filter, Search, HospitalIcon } from "lucide-react"
import { useAppStore } from "@/Store/store"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useBookAppointmentMutation, useGetHospitals } from "./api"
import { Hospital } from "./types"
import Link from "next/link"
import { haversine } from "@/lib/utils"



export default function ClientHospitalsPage() {
  const t = useTranslations("hospitals")
  const { latitude, longitude, setLocation, addAppointment, user } = useAppStore()
  const router = useRouter()

  const { data: hospitals = [], error, isLoading, isPending } = useGetHospitals()
  const bookAppointmentMutation = useBookAppointmentMutation(user?.token)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedRating, setSelectedRating] = useState("")
  const [sortBy, setSortBy] = useState("rating")

  // Fetch location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => setLocation(coords.latitude, coords.longitude),
        () => toast.error(t("toastMessages.geolocationError") || "Failed to get location")
      )
    }
  }, [setLocation, t])

  // Enrich hospitals with distance
  const enrichedHospitals = useMemo(() => {
    if (!latitude || !longitude) return hospitals

    return hospitals.map((h: Hospital) => ({
      ...h,
      distance: haversine(latitude, longitude, h.latitude, h.longitude),
      rating: h.rating || 0,
      beds: h.beds || 0,
    }))
  }, [hospitals, latitude, longitude])

  // Unique types
  const hospitalTypes = useMemo(() => {
    const types = Array.from(new Set(enrichedHospitals.map((h: Hospital) => h.type || "General")))
    return types.map(type => ({
      name: type as string,
      count: enrichedHospitals.filter((h: Hospital) => (h.type || "General") === type).length,
      icon: "🏥",
    }))
  }, [enrichedHospitals])

  // Unique cities
  const cities = useMemo(() => {
    const extracted = Array.from(
      new Set(enrichedHospitals.map((h: Hospital) => h.address?.split(",")[1]?.trim() || "Unknown"))
    ).filter(c => c !== "Unknown")
    return extracted.length ? extracted : ["Tashkent", "Samarkand", "Bukhara", "Namangan"]
  }, [enrichedHospitals])

  // Final filtered + sorted hospitals
  const filteredHospitals = useMemo(() => {
    return enrichedHospitals
      .filter((h: Hospital) => {
        // Existing filters
        const matchesSearch =
          h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (h.type || "").toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = !selectedType || (h.type || "General").toLowerCase() === selectedType.toLowerCase()
        const matchesRating = !selectedRating || (h.rating || 0) >= parseFloat(selectedRating)
        const matchesCity = !selectedCity || (h.address?.toLowerCase().includes(selectedCity.toLowerCase()) || !h.address)

        // Adjusted "real content" filters (more lenient)
        const hasDoctors = true// Allow null or non-negative doctors
        const hasDepartments = true // Temporarily allow empty departments for testing
        const hasValidDescription = h.description && h.description.trim() !== "" // Ensure non-empty description
        const hasValidImage = h.image && h.image.startsWith("http") // Ensure valid image URL
        const hasValidCoordinates = h.latitude != null && h.longitude != null && // Ensure valid coordinates
          h.latitude >= -90 && h.latitude <= 90 && h.longitude >= -180 && h.longitude <= 180

        // Combine all filters
        return (
          matchesSearch &&
          matchesType &&
          matchesRating &&
          matchesCity &&
          hasDoctors &&
          hasDepartments &&
          hasValidDescription &&
          hasValidImage &&
          hasValidCoordinates
        )
      })
      .sort((a: Hospital, b: Hospital) => {
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
        if (sortBy === "distance") return (a.distance || Infinity) - (b.distance || Infinity)
        if (sortBy === "beds") return (b.beds || 0) - (a.beds || 0)
        return 0
      })
  }, [enrichedHospitals, searchTerm, selectedCity, selectedType, selectedRating, sortBy])

  // Actions
  const handleCall = (hospitalName: string) => toast.success(t("toastMessages.call", { hospitalName }))

  const handleBookAppointment = async (hospital: Hospital) => {
    if (!user) {
      toast.error(t("toastMessages.authRequired") || "Please sign in to book an appointment")
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
            toast.success(t("toastMessages.bookAppointment", { hospitalName: hospital.name }))
          },
          onError: () => toast.error(t("toastMessages.error") || "Failed to book appointment"),
        }
      )
    } catch (err) {
      console.error("Error booking appointment:", err)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCity("")
    setSelectedType("")
    setSelectedRating("")
    toast.info(t("toastMessages.clearFilters") || "Filters cleared")
  }

  // Handle errors
  if (error) {
    if ((error as any)?.response?.status === 401) {
      router.push("/auth/login")
      toast.error(t("toastMessages.authRequired") || "Please sign in to view hospitals")
    }
    return <div className="text-center py-8 text-red-600">{error?.message}</div>
  }

  return (
    <>
      {/* Hospital Types Grid */}
      {/* <div className="grid md:grid-cols-5 gap-4">
        {hospitalTypes.map((type, index) => (
          <div
            key={index}
            className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedType(type.name.toLowerCase())}
          >
            <div className="text-2xl mb-2">{type.icon}</div>
            <h3 className="font-semibold text-gray-900">{type.name}</h3>
            <p className="text-sm text-gray-600">
              {t("count", { count: type.count }) || `${type.count} hospitals`}
            </p>
          </div>
        ))}
      </div> */}

      {/* Filters and Hospitals List */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1 relative">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>{t("filters.title") || "Filters"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {t("filters.searchLabel") || "Search"}
                </label>
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
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {t("filters.cityLabel") || "City"}
                </label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filters.cityPlaceholder") || "Select a city"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city, index) => (
                      <SelectItem key={index} value={(city as string).toLowerCase()}>
                        {city as React.ReactNode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {t("filters.typeLabel") || "Type"}
                </label>
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
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {t("filters.ratingLabel") || "Rating"}
                </label>
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
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("hospitalsListTitle", { count: filteredHospitals?.length || 0 }) ||
                `${filteredHospitals?.length || 0} Hospitals`}
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
            {filteredHospitals.length === 0 && !isLoading && !isPending && (
              <p className="text-center text-gray-600">
                No hospitals match your criteria
              </p>
            )}
            {filteredHospitals.map((hospital: Hospital) => (
              <Card
                onClick={() => router.push(`/hospitals/${hospital.id}`)}
                key={hospital.id}
                className="hover:shadow-lg transition-shadow overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex items-start flex-col sm:flex-row gap-3">
                    <div
                      className="relative min-w-64 hidden sm:block h-[-webkit-fill-available] bg-contain bg-no-repeat"
                      style={{
                        backgroundImage: `url(${hospital.image})`,
                        backgroundPosition: "center",
                      }}
                    />

                    <div className="flex-1 p-5 py-5 sm:p-4 md:p-6">
                      <div className="flex items-start justify-between">
                        <div className="w-full">
                          <div className="flex items-center gap-3">
                            <img
                              width={66}
                              height={66}
                              src={hospital.image}
                              alt={hospital.name}
                              className="w-16 h-16 rounded-full sm:hidden object-contain"
                            />
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{hospital.name}</h3>
                          </div>
                          <p className="text-blue-600 font-medium mb-2">{hospital.type || "General"}</p>
                          <p className="text-gray-600 text-sm mb-3">{hospital.address || "N/A"}</p>

                          <p className="text-gray-700 mb-3 line-clamp-4">{hospital.description}</p>

                          <div className="flex items-center gap-4 mb-3 flex-wrap">
                            <div className="flex items-center space-x-1 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">
                                {hospital.distance ? `${hospital.distance.toFixed(2)} km` : "N/A"}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1 text-gray-600">
                              <HospitalIcon className="w-4 h-4" />
                              <span className="text-sm">
                                {hospital.beds || "N/A"} {t("hospitalCard.beds") || "beds"}
                              </span>
                            </div>
                            <div className="flex space-x-3">
                              <Link
                                onClick={(e) => e.stopPropagation()}
                                className="shrink-0 text-sm min-w-11 grow flex items-center justify-center bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-white"
                                href={"tel:" + hospital.phone_number}
                              >
                                <Phone className="w-4 h-4 mr-1" />
                              </Link> 
                            </div>
                          </div>

                          <div className="flex items-center justify-between flex-wrap">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}