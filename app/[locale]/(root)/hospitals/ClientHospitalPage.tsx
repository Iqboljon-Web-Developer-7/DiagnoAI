"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Filter, Search, HospitalIcon } from "lucide-react"
import { useAppStore } from "@/store/store"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useBookAppointmentMutation, useGetHospitals } from "./api"
import { Hospital } from "./types"
import Link from "next/link"
import { haversine } from "@/lib/utils"
import useIsMobile from "@/components/useIsMobile"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

export default function ClientHospitalsPage() {
  const t = useTranslations("hospitals")
  const { latitude, longitude, setLocation, addAppointment, user } = useAppStore()
  const router = useRouter()
  const isMobile = useIsMobile()

  // API Hooks
  const { data: hospitals = [], error, isLoading, isPending } = useGetHospitals()
  const bookAppointmentMutation = useBookAppointmentMutation(user?.token)

  // Filter & Sort States
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    type: "",
    rating: "",
    sortBy: "rating"
  })

  // Get user location on mount
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocation(coords.latitude, coords.longitude),
      () => toast.error(t("toastMessages.geolocationError") || "Failed to get location")
    )
  }, [setLocation, t])

  // Memoized data transformations
  const enrichedHospitals = useMemo(() => {
    if (!latitude || !longitude) return hospitals
    return hospitals.map((h: Hospital) => ({
      ...h,
      distance: haversine(latitude, longitude, h.latitude, h.longitude),
      rating: h.rating || 0,
      beds: h.beds || 0,
    }))
  }, [hospitals, latitude, longitude])

  const hospitalTypes = useMemo(() => {
    const types = new Set(enrichedHospitals.map(h => h.type || "General"))
    return Array.from(types).map(type => ({
      name: type,
      count: enrichedHospitals.filter(h => (h.type || "General") === type).length,
      icon: "🏥"
    }))
  }, [enrichedHospitals])

  // const cities = useMemo(() => {
  //   const extracted = new Set(
  //     enrichedHospitals
  //       .map(h => h.address?.split(",")[1]?.trim())
  //       .filter(Boolean)
  //   )
  //   return Array.from(extracted).length ? Array.from(extracted) : ["Tashkent", "Samarkand", "Bukhara", "Namangan"]
  // }, [enrichedHospitals])

  // Filtered & Sorted Hospitals
  const filteredHospitals = useMemo(() => {
    const { search, city, type, rating, sortBy } = filters
    
    return enrichedHospitals
      .filter(h => {
        const matchSearch = !search || 
          h.name.toLowerCase().includes(search.toLowerCase()) ||
          (h.type || "").toLowerCase().includes(search.toLowerCase())
        const matchType = !type || (h.type || "General").toLowerCase() === type.toLowerCase()
        const matchRating = !rating || (h.rating || 0) >= parseFloat(rating)
        const matchCity = !city || h.address?.toLowerCase().includes(city.toLowerCase())
        
        return matchSearch && matchType && matchRating && matchCity
      })
      .sort((a, b) => {
        switch(sortBy) {
          case "rating": return (b.rating || 0) - (a.rating || 0)
          case "distance": return (a.distance || Infinity) - (b.distance || Infinity)
          case "beds": return (b.beds || 0) - (a.beds || 0)
          default: return 0
        }
      })
  }, [enrichedHospitals, filters])

  // Action Handlers
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      city: "",
      type: "",
      rating: "",
      sortBy: "rating"
    })
    toast.info(t("toastMessages.clearFilters") || "Filters cleared")
  }

  const handleBookAppointment = async (hospital: Hospital) => {
    if (!user) {
      toast.error(t("toastMessages.authRequired"))
      router.push("/auth/login")
      return
    }

    try {
      await bookAppointmentMutation.mutateAsync({
        userId: user.id,
        latitude: latitude || 0,
        longitude: longitude || 0,
        hospitalName: hospital.name,
        type: hospital.type || "General"
      })
      
      addAppointment({
        doctor: hospital.name,
        specialty: hospital.type || "General",
        date: new Date().toISOString().split("T")[0],
        time: "14:00",
        type: t("hospitalCard.bookButton") || "Appointment",
        status: "Tasdiqlangan"
      })
      
      toast.success(t("toastMessages.bookAppointment", { hospitalName: hospital.name }))
    } catch (err) {
      toast.error(t("toastMessages.error"))
      console.error("Booking error:", err)
    }
  }

  // Error handling
  if (error) {
    if ((error as any)?.response?.status === 401) {
      router.push("/auth/login")
      toast.error(t("toastMessages.authRequired"))
    }
    return <div className="text-center py-8 text-red-600">{error?.message}</div>
  }

  // Loading state
  if (isLoading || isPending) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-200 rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Mobile Filters Dialog */}
      {isMobile && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="fixed bottom-4 right-4 z-50">
              <Filter className="w-4 h-4 mr-2" />
              {t('filters.title')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('filters.title')}</DialogTitle>
            </DialogHeader>
            <FilterControls 
              filters={filters}
              onChange={handleFilterChange}
              onClear={clearFilters}
              // cities={cities!}
              hospitalTypes={hospitalTypes}
              t={t}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Desktop Filters */}
      <div className="lg:col-span-1 relative hidden md:block">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>{t("filters.title")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FilterControls 
              filters={filters}
              onChange={handleFilterChange}
              onClear={clearFilters}
              // cities={cities!}
              hospitalTypes={hospitalTypes}
              t={t}
            />
          </CardContent>
        </Card>
      </div>

      {/* Hospitals List */}
      <div className="lg:col-span-3">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-gray-900">
            {t("hospitalsListTitle", { count: filteredHospitals.length })}
          </h2>
          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">{t("sortOptions.rating")}</SelectItem>
              <SelectItem value="distance">{t("sortOptions.distance")}</SelectItem>
              <SelectItem value="beds">{t("sortOptions.beds")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {filteredHospitals.length === 0 ? (
            <p className="text-center text-gray-600">{t("noResults")}</p>
          ) : (
            filteredHospitals.map((hospital) => (
              <HospitalCard 
                key={hospital.id}
                hospital={hospital}
                onBook={handleBookAppointment}
                t={t}
                onClick={() => router.push(`/hospitals/${hospital.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Helper Components
const FilterControls = ({ 
  filters,
  onChange,
  onClear,
  // cities,
  hospitalTypes,
  t 
}: {
  filters: {
    search: string;
    city: string;
    type: string;
    rating: string;
    sortBy: string;
  };
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  // cities: string[];
  hospitalTypes: Array<{
    name: string;
    count: number;
    icon: string;
  }>;
  t: (key: string) => string;
}) => (
  <div className="space-y-4">
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {t("filters.searchLabel")}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={t("filters.searchPlaceholder")}
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          className="pl-10"
        />
      </div>
    </div>

    {/* City Filter */}
    {/* <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {t("filters.cityLabel")}
      </label>
      <Select value={filters.city} onValueChange={(value) => onChange("city", value)}>
        <SelectTrigger>
          <SelectValue placeholder={t("filters.cityPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city, index) => (
            <SelectItem key={index} value={city.toLowerCase()}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div> */}

    {/* Type Filter */}
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {t("filters.typeLabel")}
      </label>
      <Select value={filters.type} onValueChange={(value) => onChange("type", value)}>
        <SelectTrigger>
          <SelectValue placeholder={t("filters.typePlaceholder")} />
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

    {/* Rating Filter */}
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {t("filters.ratingLabel")}
      </label>
      <Select value={filters.rating} onValueChange={(value) => onChange("rating", value)}>
        <SelectTrigger>
          <SelectValue placeholder={t("filters.ratingPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="4.5">4.5+</SelectItem>
          <SelectItem value="4.0">4.0+</SelectItem>
          <SelectItem value="3.5">3.5+</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <Button variant="outline" className="w-full" onClick={onClear}>
      {t("filters.clearFiltersButton")}
    </Button>
  </div>
)

const HospitalCard = ({ 
  hospital,
  onBook,
  t,
  onClick 
}: {
  hospital: Hospital;
  onBook: (hospital: Hospital) => void;
  t: (key: string) => string;
  onClick: () => void;
}) => (
  <Card
    onClick={onClick}
    className="hover:shadow-lg transition-shadow overflow-hidden border hover:border-blue-500 hover:cursor-pointer"
  >
    <CardContent className="p-0">
      <div className="flex items-start flex-col sm:flex-row gap-3">
        <div
          className="relative min-w-64 hidden sm:block h-[-webkit-fill-available] bg-contain bg-no-repeat"
          style={{
            backgroundImage: `url(https://api.diagnoai.uz${hospital?.image})`,
            backgroundPosition: "center",
          }}
        />

        <div className="flex-1 p-5 py-5 sm:p-4 md:p-6">
          <div className="flex items-start justify-between">
            <div className="w-full">
              <div className="flex items-center gap-3">
                <Image
                  width={66}
                  height={66}
                  src={`https://api.diagnoai.uz${hospital?.image}`}
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
                    {hospital.beds || "N/A"} {t("hospitalCard.beds")}
                  </span>
                </div>

                <div className="flex space-x-3">
                  <Link
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 text-sm min-w-11 grow flex items-center justify-center bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-white"
                    href={`tel:${hospital.phone_number}`}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)
