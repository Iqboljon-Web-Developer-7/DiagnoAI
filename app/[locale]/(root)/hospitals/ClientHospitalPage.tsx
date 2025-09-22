"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Filter, Search, HospitalIcon, Star, Clock, Users, Building2, Navigation, Heart, Award, ArrowRight, Stethoscope } from "lucide-react"
import { useAppStore } from "@/store/store"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
// import { useBookAppointmentMutation } from "./api"
import { Hospital } from "./types"
import Link from "next/link"
import { haversine } from "@/lib/utils"
import useIsMobile from "@/components/useIsMobile"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { Circles } from "react-loader-spinner"

export default function ClientHospitalsPage({hospitals = []}:{hospitals:Hospital[]}) {
  const t = useTranslations("hospitals")
  const { latitude, longitude, setLocation, addAppointment, user } = useAppStore()
  const router = useRouter()
  const isMobile = useIsMobile()

  let isLoading, isPending = hospitals?.length == 0

  // API Hooks
  // const { data: hospitals = [], error, isLoading, isPending } = useGetHospitals()
  // const bookAppointmentMutation = useBookAppointmentMutation(user?.token)

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
      rating: h.rating || 4.2 + Math.random() * 0.8, // Generate realistic ratings
      beds: h.beds || Math.floor(Math.random() * 200) + 50,
    }))
  }, [hospitals, latitude, longitude])

  // const hospitalTypes = useMemo(() => {
  //   const types = new Set(enrichedHospitals.map(h => h.type || "General"))
  //   return Array.from(types).map(type => ({
  //     name: type,
  //     count: enrichedHospitals.filter(h => (h.type || "General") === type).length,
  //     icon: "🏥"
  //   }))
  // }, [enrichedHospitals])

  // Filtered & Sorted Hospitals
  const filteredHospitals = useMemo(() => {
    const { search, city, type, rating, sortBy } = filters

    return enrichedHospitals
      .filter(h => {
        const matchSearch = !search ||
          h.name.toLowerCase().includes(search.toLowerCase()) ||
          (h.type || "").toLowerCase().includes(search.toLowerCase())
        // const matchType = !type || (h.type || "General").toLowerCase() === type.toLowerCase()
        const matchRating = !rating || (h.rating || 0) >= parseFloat(rating)
        const matchCity = !city || h.address?.toLowerCase().includes(city.toLowerCase())

        return matchSearch && matchRating && matchCity
      })
      .sort((a, b) => {
        switch (sortBy) {
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

  // const handleBookAppointment = async (hospital: Hospital) => {
  //   if (!user) {
  //     toast.error(t("toastMessages.authRequired"))
  //     router.push("/auth/login")
  //     return
  //   }

  //   try {
  //     await bookAppointmentMutation.mutateAsync({
  //       userId: user.id,
  //       latitude: latitude || 0,
  //       longitude: longitude || 0,
  //       hospitalName: hospital.name,
  //       type: hospital.type || "General"
  //     })

  //     addAppointment({
  //       doctor: hospital.name,
  //       specialty: hospital.type || "General",
  //       date: new Date().toISOString().split("T")[0],
  //       time: "14:00",
  //       type: t("hospitalCard.bookButton") || "Appointment",
  //       status: "Tasdiqlangan"
  //     })

  //     toast.success(t("toastMessages.bookAppointment", { hospitalName: hospital.name }))
  //   } catch (err) {
  //     toast.error(t("toastMessages.error"))
  //     console.error("Booking error:", err)
  //   }
  // }
 

  // Loading state
  if (isLoading || isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
        <div className="flex flex-col items-center justify-center p-10">
          <div className="relative">
            <Circles
              height="80"
              width="80"
              color="#3b82f6"
              ariaLabel="circles-loading"
              visible={true}
            />
            <div className="absolute inset-0 animate-ping">
              <Circles
                height="80"
                width="80"
                color="#93c5fd"
                ariaLabel="circles-loading"
                visible={true}
              />
            </div>
          </div>
          <p className="text-slate-600 mt-6 text-lg font-medium animate-pulse">Loading hospitals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <HospitalIcon className="w-4 h-4" />
            <span>{t("badgeTitle")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t("pageTitle")}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("pageDescription")}

          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Mobile Filters Dialog */}
          {isMobile && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="fixed bottom-4 right-4 z-50 shadow-lg bg-white hover:bg-blue-50 border-blue-200">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('filters.title')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <span>{t('filters.title')}</span>
                  </DialogTitle>
                </DialogHeader>
                <FilterControls
                  filters={filters}
                  onChange={handleFilterChange}
                  onClear={clearFilters}
                  // hospitalTypes={hospitalTypes}
                  t={t}
                />
              </DialogContent>
            </Dialog>
          )}

          {/* Desktop Filters */}
          <div className="lg:col-span-1 relative hidden lg:block">
            <Card className="sticky top-20 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                    <Filter className="w-4 h-4 text-white" />
                  </div>
                  <span>{t("filters.title") || "Filters"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterControls
                  filters={filters}
                  onChange={handleFilterChange}
                  onClear={clearFilters}
                  // hospitalTypes={hospitalTypes}
                  t={t}
                />
              </CardContent>
            </Card>
          </div>

          {/* Hospitals List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {t("hospitalsListTitle", { count: filteredHospitals.length }) || `${filteredHospitals.length} Hospitals Found`}
                </h2>
                {/* <p className="text-gray-600">Showing the best medical facilities in your area</p> */}
              </div>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                <SelectTrigger className="w-48 bg-white shadow-sm border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">{t("sortOptions.rating") || "By Rating"}</SelectItem>
                  <SelectItem value="distance">{t("sortOptions.distance") || "By Distance"}</SelectItem>
                  <SelectItem value="beds">{t("sortOptions.beds") || "By Capacity"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {filteredHospitals.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No hospitals found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear all filters
                  </Button>
                </div>
              ) : (
                filteredHospitals.map((hospital, index) => (
                  <HospitalCard
                    key={hospital.id}
                    hospital={hospital}
                    // onBook={handleBookAppointment}
                    t={t}
                    onClick={() => router.push(`/hospitals/${hospital.id}`)}
                    index={index}
                  />
                ))
              )}
            </div>
          </div>
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
  // hospitalTypes,
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
  // hospitalTypes: Array<{
  //   name: string;
  //   count: number;
  //   icon: string;
  // }>;
  t: (key: string) => string;
}) => (
  <div className="space-y-6">
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-3 block">
        {t("filters.searchLabel") || "Search Hospitals"}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={t("filters.searchPlaceholder") || "Search by name or specialty..."}
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>

    {/* Type Filter */}
    {/* <div>
      <label className="text-sm font-semibold text-gray-700 mb-3 block">
        {t("filters.typeLabel") || "Hospital Type"}
      </label>
      <Select value={filters.type} onValueChange={(value) => onChange("type", value)}>
        <SelectTrigger className="border-gray-200 focus:border-blue-500">
          <SelectValue placeholder={t("filters.typePlaceholder") || "All types"} />
        </SelectTrigger>
        <SelectContent>
          {hospitalTypes.map((type) => (
            <SelectItem key={type.name} value={type.name.toLowerCase()}>
              <div className="flex items-center justify-between w-full">
                <span>{type.name}</span>
                <span className="text-xs text-gray-500 ml-2">({type.count})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div> */}

    {/* Rating Filter */}
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-3 block">
        {t("filters.ratingLabel") || "Minimum Rating"}
      </label>
      <Select value={filters.rating} onValueChange={(value) => onChange("rating", value)}>
        <SelectTrigger className="border-gray-200 focus:border-blue-500">
          <SelectValue placeholder={t("filters.ratingPlaceholder") || "Any rating"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="4.5">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span>4.5+</span>
            </div>
          </SelectItem>
          <SelectItem value="4.0">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4].map(i => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
                <Star className="w-3 h-3 text-gray-300" />
              </div>
              <span>4.0+</span>
            </div>
          </SelectItem>
          <SelectItem value="3.5">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3].map(i => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
                {[4, 5].map(i => (
                  <Star key={i} className="w-3 h-3 text-gray-300" />
                ))}
              </div>
              <span>3.5+</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <Button
      variant="outline"
      className="w-full border-gray-200 hover:bg-gray-50 hover:border-gray-300"
      onClick={onClear}
    >
      <Filter className="w-4 h-4 mr-2" />
      {t("filters.clearFiltersButton") || "Clear Filters"}
    </Button>
  </div>
)

const HospitalCard = ({
  hospital,
  // onBook,
  t,
  onClick,
  index
}: {
  hospital: Hospital;
  // onBook: (hospital: Hospital) => void;
  t: (key: string) => string;
  onClick: () => void;
  index: number;
}) => (
  <Card
    onClick={onClick}
    className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 bg-white cursor-pointer transform hover:-translate-y-1"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <CardContent className="p-0">
      <div className="flex flex-col lg:flex-row">
        {/* Hospital Image */}
        <div className="relative lg:w-80 h-64 lg:h-auto overflow-hidden">
          <Image
            width={320}
            height={240}
            src={`https://api.diagnoai.uz${hospital?.image}`}
            alt={hospital.name}
            className="w-full h-full object-contain transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/20"></div>

          {/* Rating Badge */}
          <div className="absolute top-4 left-4">
            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900">
                {hospital.rating?.toFixed(1) || "4.5"}
              </span>
            </div>
          </div>

          {/* Distance Badge */}
          {hospital.distance && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-1 bg-blue-600/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                <MapPin className="w-3 h-3 text-white" />
                <span className="text-sm font-medium text-white">
                  {hospital.distance.toFixed(1)} km
                </span>
              </div>
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
              href={`tel:${hospital.phone_number}`}
            >
              <Phone className="w-4 h-4 text-blue-600" />
            </Link>
            <Link
              onClick={(e) => e.stopPropagation()}
              href={`https://yandex.com/maps/?ll=${hospital?.longitude},${hospital?.latitude}&z=15&pt=${hospital?.longitude},${hospital?.latitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
            >
              <Navigation className="w-4 h-4 text-blue-600" />
            </Link>
          </div>
        </div>

        {/* Hospital Info */}
        <div className="flex-1 p-6 lg:p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {hospital.type || "General"}
                </span> */}
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">{t('hospital.availability')}</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {hospital.name}
              </h3>

              <div className="flex items-center space-x-2 text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{hospital.address || t('hospital.no-location')}</span>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">
                {hospital.description || "Providing quality healthcare services with experienced medical professionals and modern facilities."}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">{hospital.beds || "150"}</div>
                  <div className="text-xs text-gray-600">{t('hospital.beds')}</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">{Math.floor((hospital.beds || 150) / 10)}+</div>
                  <div className="text-xs text-gray-600">{t('hospital.doctors')}</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <Award className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">10+</div>
                  <div className="text-xs text-gray-600">{t('hospital.years')}</div>
                </div>
              </div>

              {/* Departments Preview */}
              {hospital.departments && hospital.departments.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <Stethoscope className="w-4 h-4 mr-1 text-blue-600" />
                    Specialties
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {hospital.departments.slice(0, 3).map((dept: string, idx: number) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {dept}
                      </span>
                    ))}
                    {hospital.departments.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        +{hospital.departments.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClick()
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>

                {/* <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onBook(hospital)
                  }}
                  variant="outline"
                  className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  <span>Book Appointment</span>
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)