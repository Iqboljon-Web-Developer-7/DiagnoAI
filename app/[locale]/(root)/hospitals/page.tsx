"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Phone, Calendar, Filter, Search, Hospital } from "lucide-react";
import { useAppStore } from "@/context/store";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Define Hospital interface for type safety
interface Hospital {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  type?: string;
  address?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  beds?: number;
  services?: string;
  distance?: number;
  image?: string;
}

// Define HospitalType interface for specialties/types
interface HospitalType {
  name: string;
  count: number;
  icon: string;
}

const API_BASE_URL = "http://91.99.232.34:8000/api";

// Haversine formula to calculate distance
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function page() {
  const translations = useTranslations("hospitals");
  const { latitude, longitude, setLocation, addAppointment } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation failed:", error);
          toast({
            title: translations("toastMessages.geolocationError") || "Failed to get location",
            variant: "destructive",
          });
        }
      );
    }
  }, [setLocation, toast, translations]);

  // Fetch hospitals from API
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/hospitals/`);
        const apiHospitals: Hospital[] = response.data.map((hospital: any) => ({
          id: hospital.id,
          name: hospital.name,
          latitude: hospital.latitude,
          longitude: hospital.longitude,
          type: hospital.type || "General",
          address: hospital.address || "N/A",
          description: hospital.description || "No description available",
          rating: hospital.rating || 4.0,
          reviews: hospital.reviews || 0,
          beds: hospital.beds || 100,
          services: hospital.services || "General Services",
          image: hospital.image || "/placeholder-hospital.jpg",
          distance: latitude && longitude ? haversine(latitude, longitude, hospital.latitude, hospital.longitude) : 0,
        }));
        setHospitals(apiHospitals);
        setError(null);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setError(translations("toastMessages.error") || "Failed to load hospitals");
        setHospitals([]); // Ensure hospitals is an empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitals();
  }, [latitude, longitude, translations]);

  // Derive hospital types
  const hospitalTypes: HospitalType[] = Array.from(new Set(hospitals.map((hospital) => hospital.type || "General"))).map(
    (type) => ({
      name: type,
      count: hospitals.filter((h) => (h.type || "General") === type).length,
      icon: "🏥",
    })
  );

  // Derive cities (fallback to static if address is unavailable)
  const cities = Array.from(new Set(hospitals.map((hospital) => hospital.address?.split(",")[1]?.trim() || "Unknown"))).filter(
    (city) => city !== "Unknown"
  ).length > 0
    ? Array.from(new Set(hospitals.map((hospital) => hospital.address?.split(",")[1]?.trim() || "Unknown"))).filter(
        (city) => city !== "Unknown"
      )
    : ["Tashkent", "Samarkand", "Bukhara", "Namangan"];

  // Filter and sort hospitals
  const filteredHospitals = (hospitals || [])
    .filter((hospital) => {
      const matchesSearch =
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hospital.type || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || (hospital.type || "General").toLowerCase() === selectedType.toLowerCase();
      const matchesRating = !selectedRating || (hospital.rating || 0) >= Number.parseFloat(selectedRating);
      const matchesCity = !selectedCity || hospital.address?.toLowerCase().includes(selectedCity.toLowerCase());
      return matchesSearch && matchesType && matchesRating && matchesCity;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "distance") return (a.distance || 0) - (b.distance || 0);
      if (sortBy === "beds") return (b.beds || 0) - (a.beds || 0);
      return 0;
    });

  // Handle call button
  const handleCall = (hospitalName: string) => {
    setToastMessage(translations("toastMessages.call", { hospitalName }));
    setShowSuccessToast(true);
  };

  // Handle book appointment
  const handleBookAppointment = (hospital: Hospital) => {
    addAppointment({
      doctor: hospital.name,
      specialty: hospital.type || "General",
      date: new Date().toISOString().split("T")[0],
      time: "14:00",
      type: translations("hospitalCard.bookButton") || "Appointment",
      status: translations("toastMessages.bookAppointment").includes("confirmed") ? "Confirmed" : "Tasdiqlangan",
    });

    setToastMessage(translations("toastMessages.bookAppointment", { hospitalName: hospital.name }));
    setShowSuccessToast(true);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("");
    setSelectedType("");
    setSelectedRating("");
    setToastMessage(translations("toastMessages.clearFilters") || "Filters cleared");
    setShowSuccessToast(true);
  };

  // Show toast
  useEffect(() => {
    if (showSuccessToast) {
      toast({
        title: toastMessage,
        variant: toastMessage.includes("error") ? "destructive" : "default",
      });
      setShowSuccessToast(false);
    }
  }, [showSuccessToast, toastMessage, toast]);

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{translations("pageTitle") || "Find a Hospital"}</h1>
          <p className="text-xl text-gray-600">{translations("pageDescription") || "Explore top hospitals near you"}</p>
        </div>

        {/* Hospital Types Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{translations("typesTitle") || "Hospital Types"}</span>
            </CardTitle>
            <CardDescription>{translations("typesDescription") || "Explore hospitals by type"}</CardDescription>
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
                  <p className="text-sm text-gray-600">{translations("count", { count: type.count }) || `${type.count} hospitals`}</p>
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
                  <span>{translations("filters.title") || "Filters"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{translations("filters.searchLabel") || "Search"}</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={translations("filters.searchPlaceholder") || "Search hospitals or types"}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{translations("filters.cityLabel") || "City"}</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder={translations("filters.cityPlaceholder") || "Select a city"} />
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
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{translations("filters.typeLabel") || "Type"}</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder={translations("filters.typePlaceholder") || "Select a type"} />
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
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{translations("filters.ratingLabel") || "Rating"}</label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger>
                      <SelectValue placeholder={translations("filters.ratingPlaceholder") || "Select a rating"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.5">4.5</SelectItem>
                      <SelectItem value="4.0">4.0</SelectItem>
                      <SelectItem value="3.5">3.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  {translations("filters.clearFiltersButton") || "Clear Filters"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Hospitals List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {translations("hospitalsListTitle", { count: filteredHospitals.length || 0 }) || `${filteredHospitals.length || 0} Hospitals`}
              </h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">{translations("sortOptions.rating") || "Sort by Rating"}</SelectItem>
                  <SelectItem value="distance">{translations("sortOptions.distance") || "Sort by Distance"}</SelectItem>
                  <SelectItem value="beds">{translations("sortOptions.beds") || "Sort by Beds"}</SelectItem>
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
                                <span className="font-medium">{hospital.rating || "N/A"}</span>
                                <span className="text-gray-500 text-sm">
                                  {translations("hospitalCard.reviews", { count: hospital.reviews || 0 }) || `${hospital.reviews || 0} reviews`}
                                </span>
                              </div>

                              <div className="flex items-center space-x-1 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{hospital.distance ? `${hospital.distance.toFixed(2)} km` : "N/A"}</span>
                              </div>

                              <div className="flex items-center space-x-1 text-gray-600">
                                <Hospital className="w-4 h-4" />
                                <span className="text-sm">{hospital.beds || "N/A"} {translations("hospitalCard.beds") || "beds"}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg font-bold text-gray-900">{hospital.services || "N/A"}</span>
                                <span className="text-gray-500 text-sm ml-1">{translations("hospitalCard.servicesSuffix") || "services"}</span>
                              </div>

                              <div className="flex space-x-3">
                                <Button variant="outline" size="sm" onClick={() => handleCall(hospital.name)}>
                                  <Phone className="w-4 h-4 mr-1" />
                                  {translations("hospitalCard.callButton") || "Call"}
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleBookAppointment(hospital)}
                                >
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {translations("hospitalCard.bookButton") || "Book Appointment"}
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
                {translations("loadMoreButton") || "Load More"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}