"use client";

import React from "react";
import {
  MapPin,
  Phone,
  DollarSign,
  Building2,
  Stethoscope,
  User,
  Clock,
  Star,
} from "lucide-react";
import Image from "next/image";
import { Doctor } from "../../types";
import { useTranslations } from "next-intl";

 

interface Props {
  doctor: Doctor;
  doctorId: string;
  freeTimes: number[];
}

export default function DoctorMain({ doctor, doctorId, freeTimes }: Props) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US").format(price);
  const translations = useTranslations("doctors");

  const handleBookAppointment = (time: number) => {
    alert(`Booking ${time} for 2025-08-28`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-xs border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">MedConnect</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative bg-linear-to-r from-blue-600 to-blue-800 px-8 py-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Doctor Image */}
              <div className="relative">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white p-1 shadow-2xl">
                  <Image
                    width={400}
                    height={400}
                    src={`${doctor.image}`}
                    alt={doctor.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Dr. {doctor.name}
                </h1>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                  <Stethoscope className="h-5 w-5 text-blue-200" />
                  <span className="text-xl text-blue-200">
                     <span className="text-xl text-blue-200">
                    -                    {doctor.field} Specialist
                    +                    {doctor.field} {translations("doctorDetails.specialization")}
                     </span>
                  </span>
                  <span className="text-xl text-blue-200">
                    {doctor.field} {translations("doctorDetails.specialization")}
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                  <Building2 className="h-5 w-5 text-blue-200" />
                  <span className="text-blue-200">{doctor.hospital}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center lg:justify-start space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-blue-200 ml-2">4.9 (127 {translations("doctorCard.reviews")})</span>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>{translations("doctorCard.callButton")}</span>
                  </button>
                  {doctor.phone_number && (
                    <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Phone className="h-5 w-5" />
                      <span>{translations("doctorDetails.bookButton")}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="h-6 w-6 text-blue-600" />
                <span>About Dr. {doctor.name}</span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {doctor.description}
              </p>
            </div>

            {/* Specialization */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Stethoscope className="h-6 w-6 text-blue-600" />
                <span>Specialization</span>
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-900 text-lg">{doctor.field}</h3>
                <p className="text-blue-800 mt-1">
                  Expert in treating bone, joint, and muscle conditions with advanced
                  medical techniques.
                </p>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{translations("doctorDetails.servicesOffered")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Fracture Treatment",
                  "Arthritis Management",
                  "Sports Injury Recovery",
                  "Joint Replacement",
                  "Physical Therapy",
                  "Consultation",
                ].map((service) => (
                  <div
                    key={service}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Time Slots */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="h-6 w-6 text-blue-600" />
                <span>{translations("doctorDetails.availableSlotsWithDate", { date: "Aug 28, 2025" })}</span>
              </h2>
              {freeTimes && freeTimes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {freeTimes.map((time) => (
                    <button
                      key={time}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => handleBookAppointment(time)}
                    >
                      {time} - Book
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">{translations("doctorDetails.noSlots")}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Consultation Fee */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                <span>Consultation Fee</span>
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatPrice(doctor.prize!)} UZS
                </div>
                <p className="text-gray-600">{translations("doctorDetails.perConsultation")}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{translations("doctorDetails.contactInformation")}</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{translations("doctorDetails.hospital")}</p>
                    <p className="text-gray-600">{doctor.hospital}</p>
                  </div>
                </div>

                {doctor.phone_number && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-500 mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{translations("doctorDetails.phone")}</p>
                      <p className="text-gray-600">{doctor.phone_number}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{translations("doctorDetails.location")}</p>
                    <p className="text-gray-600">
                      {doctor.latitude}, {doctor.longitude}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Tashkent, Uzbekistan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="h-6 w-6 text-blue-600" />
                <span>{translations("doctorDetails.workingHours")}</span>
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{translations("doctorDetails.mondayFriday")}</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{translations("doctorDetails.saturday")}</span>
                  <span className="font-medium">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{translations("doctorDetails.sunday")}</span>
                  <span className="font-medium text-red-600">{translations("doctorDetails.closed")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}