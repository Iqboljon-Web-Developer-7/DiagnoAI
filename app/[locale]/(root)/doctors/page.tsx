"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Clock, Calendar, Filter, Search } from "lucide-react";
import { useAppStore } from "@/context/store";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Define Doctor interface to ensure plain objects
interface Doctor {
  id: number;
  name: string;
  field: string;
  hospital: string;
  description: string;
  rating?: number;
  reviews?: number;
  distance?: string;
  availability?: string;
  price?: string;
  image?: string;
  experience?:string
}

interface Specialty {
  name: string;
  count: number;
  icon: string;
}

const API_BASE_URL = "https://api.diagnoai.uz/api";

export default function page() {
  const translations = useTranslations("doctors");
  const { user, latitude, longitude, setLocation, addAppointment } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { toast } = useToast();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const params: Record<string, any> = { latitude, longitude };
        if (selectedSpecialty) params.field = selectedSpecialty;
        
        const response = await axios.get(`${API_BASE_URL}/doctors/`, { params });
        const mappedDoctors = response.data.map((doctor: any) => ({
          id: doctor.id,
          name: doctor.name,
          field: doctor.field,
          hospital: doctor.hospital,
          description: doctor.description,
          rating: doctor.rating,
          reviews: doctor.reviews,
          distance: doctor.distance,
          availability: doctor.availability,
          price: doctor.price,
          image: doctor.image,
        }));
        
        setDoctors(mappedDoctors);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch doctors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [latitude, longitude, selectedSpecialty]);

  // Book appointment
  const bookAppointment = async (doctor: Doctor) => {
    try {
      if (!user) throw new Error("User not logged in");
      
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      formData.append("message", `Book appointment with ${doctor.name}`);
      
      await axios.post(`${API_BASE_URL}/chats/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      addAppointment({
        doctor: doctor.name,
        specialty: doctor.field,
        date: new Date().toISOString().split("T")[0],
        time: "14:00",
        type: translations("doctorCard.bookButton") || "Appointment",
        status: "Tasdiqlangan",
      });

      setToastMessage(
        translations("toastMessages.bookAppointment", { doctorName: doctor.name }) ||
          `Appointment booked with ${doctor.name}`
      );
      setShowSuccessToast(true);
    } catch (err) {
      setToastMessage(translations("toastMessages.error") || "Failed to book appointment");
      setShowSuccessToast(true);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("");
    setSelectedRating("");
    setToastMessage(translations("toastMessages.clearFilters") || "Filters cleared");
    setShowSuccessToast(true);
  };

  // Filter doctors (client-side)
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.field.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = !selectedRating || (doctor.rating && doctor.rating >= Number.parseFloat(selectedRating));
    return matchesSearch && matchesRating;
  });

  // Derive specialties from doctors
  const specialties: Specialty[] = Array.from(new Set(doctors.map((doctor) => doctor.field))).map(
    (name) => ({
      name,
      count: doctors.filter((d) => d.field === name).length,
      icon: "🩺",
    })
  );

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

  // if (isLoading) {
  //   return <div className="text-center py-8">{translations("loading") || "Loading..."}</div>;
  // }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {translations("toastMessages.error") || "Failed to load doctors"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {translations("pageTitle") || "Find a Doctor"}
          </h1>
          <p className="text-xl text-gray-600">{translations("pageDescription") || "Book appointments with top doctors"}</p>
        </div>

        {/* Specialties Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{translations("specialtiesTitle") || "Medical Specialties"}</span>
            </CardTitle>
            <CardDescription>
              {translations("specialtiesDescription") || "Explore doctors by specialty"}
            </CardDescription>
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
                  <p className="text-sm text-gray-600">
                    {translations("count", { count: specialty.count }) || `${specialty.count} doctors`}
                  </p>
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
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {translations("filters.searchLabel") || "Search"}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={translations("filters.searchPlaceholder") || "Search doctors or specialties"}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {translations("filters.specialtyLabel") || "Specialty"}
                  </label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder={translations("filters.specialtyPlaceholder") || "Select a specialty"} />
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
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {translations("filters.ratingLabel") || "Rating"}
                  </label>
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

          {/* Doctors List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {translations("doctorsListTitle", { count: filteredDoctors.length }) ||
                  `${filteredDoctors.length} Doctors`}
              </h2>
            </div>

            <div className="space-y-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img
                          src={doctor.image || "/placeholder-doctor.jpg"}
                          alt={doctor.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="w-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                            <p className="text-blue-600 font-medium mb-2">{doctor.field}</p>
                            <p className="text-gray-600 text-sm mb-3">
                              {doctor.experience || "N/A"} • {doctor.hospital}
                            </p>

                            <p className="text-gray-700 mb-3">{doctor.description}</p>

                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{doctor.rating || "N/A"}</span>
                                <span className="text-gray-500 text-sm">
                                  {translations("doctorCard.reviews", { count: doctor.reviews || 0 }) ||
                                    `${doctor.reviews || 0} reviews`}
                                </span>
                              </div>

                              <div className="flex items-center space-x-1 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{doctor.distance || "N/A"}</span>
                              </div>

                              <div className="flex items-center space-x-1 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{doctor.availability || "N/A"}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg font-bold text-gray-900">{doctor.price || "N/A"}</span>
                                <span className="text-gray-500 text-sm ml-1">
                                  {translations("doctorCard.consultationPriceSuffix") || "per consultation"}
                                </span>
                              </div>

                              <div className="flex space-x-3">
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => bookAppointment(doctor)}
                                  disabled={!user}
                                >
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {translations("doctorCard.bookButton") || "Book Appointment"}
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
          </div>
        </div>
      </div>
    </div>
  );
}