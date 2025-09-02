"use client";

import React from 'react';
import { useGetHospital } from "../api";
import { MapPin, Phone, Building2, Users, Clock, Star, Award, Stethoscope, Heart, Shield, Calendar, Navigation } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useAppStore } from '@/Store/store';
import Image from 'next/image';
import { Circles } from "react-loader-spinner";

interface Hospital {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  image: string;
}

function Page({ params }: { params: { id: string; locale: string } }) {
  const { id } = params;
  const { user, isLoggedIn } = useAppStore()
  const { data: hospital = {} as Hospital, error, isLoading } = useGetHospital(id, user?.token);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Circles
          height="80"
          width="80"
          color="#2563eb"
          ariaLabel="circles-loading"
          visible={true}
        />
      </div>
    );
  }
  if (error) {
    return <div className="text-center py-8 text-red-600">{(error as Error).message}</div>;
  }
  {
    !isLoggedIn &&
    <p className='text-center text-red-400 animate-fade-in-down delay-1000 opacity-0'>
      "You're not logged in"
    </p>
  }


  const departments = [
    { name: 'Emergency Medicine', icon: Heart, color: 'text-red-600' },
    { name: 'Cardiology', icon: Heart, color: 'text-pink-600' },
    { name: 'Orthopedics', icon: Shield, color: 'text-blue-600' },
    { name: 'Neurology', icon: Stethoscope, color: 'text-purple-600' },
    { name: 'Pediatrics', icon: Users, color: 'text-green-600' },
    { name: 'Surgery', icon: Award, color: 'text-orange-600' }
  ];

  const services = [
    'Emergency Care 24/7',
    'Diagnostic Imaging',
    'Laboratory Services',
    'Surgical Procedures',
    'Outpatient Clinics',
    'Inpatient Care',
    'Rehabilitation Services',
    'Pharmacy Services'
  ];

  const stats = [
    { label: 'Beds', value: '500+', icon: Building2 },
    { label: 'Doctors', value: '150+', icon: Users },
    { label: 'Years of Service', value: '25+', icon: Award },
    { label: 'Patients/Year', value: '50K+', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative">
            {/* Hospital Image */}
            <div className="h-96 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
              <Image
                width={1200}
                height={400}
                src={`${hospital?.image}`}
                alt={hospital.name}
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-blue-800/50"></div>
              {/* Hospital Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
                  <div className="w-full lg:w-auto">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
                      {hospital.name}
                    </h1>
                    <div className="flex items-center space-x-2 mb-2 sm:mb-4">
                      <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-blue-200" />
                      <span className="text-blue-200 text-sm sm:text-base">Tashkent, Uzbekistan</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 mb-2 sm:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-blue-200 ml-2 text-sm sm:text-base">4.8 (2,341 reviews)</span>
                    </div>
                  </div>

                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
                    <button className="w-full xs:w-auto bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base">
                      <Calendar className="h-4 sm:h-5 w-4 sm:w-5" />
                      <span>Book Appointment</span>
                    </button>
                    <Link
                      href={`https://yandex.com/maps/?ll=${hospital?.longitude},${hospital?.latitude}&z=15&pt=${hospital?.longitude},${hospital?.latitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full xs:w-auto"
                    >
                      <button className="w-full border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base">
                        <Navigation className="h-4 sm:h-5 w-4 sm:w-5" />
                        <span>Get Directions</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200">
              <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span>About {hospital.name}</span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                {hospital.name} is a leading healthcare institution in Tashkent, providing comprehensive medical services
                with state-of-the-art facilities and experienced medical professionals. Our commitment to excellence in
                patient care has made us a trusted name in healthcare for over two decades.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We offer a wide range of medical specialties and are equipped with the latest medical technology to
                ensure the best possible outcomes for our patients. Our team of dedicated healthcare professionals
                works around the clock to provide compassionate and quality care.
              </p>
            </div>

            {/* Departments */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Stethoscope className="h-6 w-6 text-blue-600" />
                <span>Medical Departments</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {departments.map((dept, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100">
                    <dept.icon className={`h-8 w-8 ${dept.color}`} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-600">Expert care and treatment</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Services & Facilities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">Central District, Tashkent</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Coordinates: {hospital.latitude}, {hospital.longitude}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">+998 71 123 4567</p>
                    <p className="text-sm text-gray-500">Emergency: +998 71 911</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Emergency</p>
                    <p className="text-green-600 font-medium">24/7 Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="h-6 w-6 text-blue-600" />
                <span>Visiting Hours</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">General Wards</span>
                  <span className="font-medium">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ICU</span>
                  <span className="font-medium">2:00 PM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Emergency</span>
                  <span className="font-medium text-green-600">24/7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Outpatient</span>
                  <span className="font-medium">8:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Accreditation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Award className="h-6 w-6 text-blue-600" />
                <span>Accreditation</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">ISO 9001:2015</p>
                    <p className="text-sm text-green-700">Quality Management</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Award className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">JCI Accredited</p>
                    <p className="text-sm text-blue-700">International Standards</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Need Immediate Care?</h3>
              <p className="text-blue-100 mb-4">Our emergency department is available 24/7</p>
              <button className="w-full bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Call Emergency</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page