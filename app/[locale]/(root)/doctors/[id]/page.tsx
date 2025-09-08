'use client';

import { Booking } from '../types';
import { useDoctorQuery, useFreeTimes, useCreateBookingMutation, useGetClinicBookings, useUpdateBookingMutation, useDeleteBookingMutation } from "../api";
import { useAppStore } from '@/Store/store';
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import {
  MapPin,
  Phone,
  DollarSign,
  Building2,
  Stethoscope,
  User,
  Clock,
  Star,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { format } from 'date-fns';
import { use } from 'react';
import { Circles } from 'react-loader-spinner';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
interface DoctorType {
  params: { id: string; locale: string };
}
type PageProps = {
  params: {
    locale: string;
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function DoctorPage({ params }: PageProps) {
  const { id, locale } = params;
  const { user } = useAppStore();
  const token = user?.token;
  const role = user?.role;

  const translations = useTranslations('doctors');

  const { data: doctor, isLoading: loading, isPending } = useDoctorQuery(id, token);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const { data: freeTimes, isLoading: freeTimesLoading, refetch: refetchFreeTimes } = useFreeTimes(+id, token, formattedDate);

  const createBooking = useCreateBookingMutation();
  const { data: clinicBookings, isLoading: clinicBookingsLoading } = useGetClinicBookings(token, role === 'clinic');
  const updateBooking = useUpdateBookingMutation(locale);
  const deleteBooking = useDeleteBookingMutation(locale);

  const filteredClinicBookings = clinicBookings?.filter((b: Booking) => b.doctor === parseInt(id)) || [];

  const handleUpdateStatus = (bookingId: number, newStatus: Booking['status']) => {
    updateBooking.mutate(
      { booking_id: bookingId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`${translations('bookingUpdatedTo')} ${newStatus}`);
        },
        onError: () => toast.error(translations('failedToUpdateBooking')),
      }
    );
  };

  const handleDelete = (bookingId: number) => {
    deleteBooking.mutate(
      { booking_id: bookingId },
      {
        onSuccess: () => {
          toast.success(translations('bookingDeleted'));
        },
        onError: () => toast.error(translations('failedToDeleteBooking')),
      }
    );
  };

  if (loading || isPending) {
    return (
      <div className="flex items-center justify-center p-10 mt-10">
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

  const bookedTimes = freeTimes?.booked_times?.map(time => {
    return parseInt(time.split(':')[0]);
  }) ?? [];

  const allTimes: number[] = Array.from({ length: 13 }, (_, i) => i + 8);
  const sortedTimes = allTimes.sort((a, b) => a - b);
  // const formatPrice = (price: number) => new Intl.NumberFormat('en-US').format(price);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleBookAppointment = (time: number) => {
    const hour = time.toString().padStart(2, '0');
    const appointmentDate = `${formattedDate}T${hour}:00:00Z`;
    createBooking.mutate(
      { doctor: parseInt(id), appointment_date: appointmentDate },
      {
        onSuccess: () => {
          toast.success(translations('bookingCreatedSuccessfully'));
          refetchFreeTimes();
        },
        onError: () => toast.error(translations('failedToCreateBooking')),
      }
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-11">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Doctor Image */}
              <div className="relative">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white p-1 shadow-2xl">
                  <Image
                    width={400}
                    height={400}
                    src={`${doctor!.image}`}
                    alt={doctor!.name}
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
                  Dr. {doctor!.name}
                </h1>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                  <Stethoscope className="h-5 w-5 text-blue-200" />
                  <span className="text-xl text-blue-200">
                    {doctor!.field}
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                  <Building2 className="h-5 w-5 text-blue-200" />
                  <span className="text-blue-200">{doctor!.hospital}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center lg:justify-start space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-blue-200 ml-2">4.9 (127 {translations('reviews')})</span>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                 {user?.role !== 'clinic' && (

                  <Dialog  >
                    <DialogTrigger className='bg-blue-500 py-1 px-4 flex items-center justify-center gap-2 text-white border-none rounded-lg'> <Calendar className="w-4 h-4 mr-1" />
                      {translations('doctorCard.bookButton')}</DialogTrigger>
                    <DialogContent onClick={(e) => e.stopPropagation()}>
                      <DialogHeader onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white rounded-xl ">
                          <h2 className="text-2xl text-center font-bold text-gray-900 mb-2">
                            <span className='text-lg md:text-3xl text-center'>{translations('availableTimeSlots')}</span>
                          </h2>
                          <div className="mb-4 flex items-center justify-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900  flex items-center space-x-2">
                              {selectedDate.toLocaleDateString()}
                            </h2>

                            <input
                              width={36}
                              type="date"
                              onChange={handleDateChange}
                              className="w-9 border rounded p-2"
                            />
                          </div>
                          {freeTimesLoading ? (
                            <div className="animate-fade-in-down flex flex-col justify-center items-center min-h-8">
                              <Circles color="#00BFFF" height={30} width={30} />
                            </div>
                          ) : sortedTimes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-72 overflow-auto">
                              {sortedTimes.map((time: number) => (
                                <button
                                  key={time}
                                  className={`px-4 py-2 rounded-lg transition-colors ${bookedTimes.includes(time) ? 'bg-gray-300 cursor-not-allowed text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                  onClick={() => !bookedTimes.includes(time) && handleBookAppointment(time)}
                                >
                                  {time.toString().padStart(2, '0')}:00 {bookedTimes.includes(time) ? '- ' + translations('booked') : '- ' + translations('book')}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-600">{translations('noAvailableSlots')}</p>
                          )}
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                 )}
                  {doctor!.phone_number && (
                    <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Phone className="h-5 w-5" />
                      <span>{translations('callNow')}</span>
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
                <span>{translations('aboutDoctor')} {doctor!.name}</span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {doctor!.description}
              </p>
            </div>

            {/* Specialization */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Stethoscope className="h-6 w-6 text-blue-600" />
                <span>{translations('specialization')}</span>
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-900 text-lg">{doctor!.field}</h3>
                <p className="text-blue-800 mt-1">
                  {translations('specializationDescription')}
                </p>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{translations('servicesOffered')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  translations('services.fractureTreatment'),
                  translations('services.arthritisManagement'),
                  translations('services.sportsInjuryRecovery'),
                  translations('services.jointReplacement'),
                  translations('services.physicalTherapy'),
                  translations('services.consultation'),
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

            {role === 'client' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <span>{translations('availableTimeSlotsWithDate')} ({selectedDate.toLocaleDateString()})</span>
                </h2>
                <div className="mb-4 flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <input
                    type="date"
                    value={formattedDate}
                    onChange={handleDateChange}
                    className="border rounded p-2"
                  />
                </div>
                {freeTimesLoading ? (
                  <p>Loading times...</p>
                ) : sortedTimes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sortedTimes.map((time: number) => (
                      <button
                        key={time}
                        className={`px-4 py-2 rounded-lg transition-colors ${bookedTimes.includes(time) ? 'bg-gray-300 cursor-not-allowed text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        onClick={() => !bookedTimes.includes(time) && handleBookAppointment(time)}
                      >
                        {time.toString().padStart(2, '0')}:00 {bookedTimes.includes(time) ? '- ' + translations('booked') : '- ' + translations('book')}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">{translations('noAvailableSlots')}</p>
                )}
              </div>
            )}

            {role === 'clinic' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <span>{translations('bookingsForDoctor')} {doctor!.name}</span>
                </h2>
                {clinicBookingsLoading ? (
                  <p>{translations('loadingBookings')}</p>
                ) : filteredClinicBookings.length > 0 ? (
                  <div className="space-y-4">
                    {filteredClinicBookings.map((booking: Booking) => (
                      <div key={booking.id} className="border p-4 rounded-lg">
                        <p><strong>{translations('id')}</strong> {booking.id}</p>
                        <p><strong>{translations('user')}</strong> {booking.user}</p>
                        <p><strong>{translations('date')}</strong> {new Date(booking.appointment_date).toLocaleString()}</p>
                        <p><strong>{translations('status')}</strong> {booking.status}</p>
                        <div className="flex space-x-2 mt-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                className="bg-green-500 text-white px-3 py-1 rounded"
                                onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              >
                                {translations('confirm')}
                              </button>
                              <button
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                              >
                                {translations('cancel')}
                              </button>
                            </>
                          )}
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => handleDelete(booking.id)}
                          >
                            {translations('delete')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">{translations('noBookings')}</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Consultation Fee */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                <span>{translations('consultationFee')}</span>
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {doctor!.prize!} UZS
                </div>
                <p className="text-gray-600">{translations('perConsultation')}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{translations('contactInformation')}</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{translations('hospital')}</p>
                    <p className="text-gray-600">{doctor!.hospital}</p>
                  </div>
                </div>

                {doctor!.phone_number && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{translations('phone')}</p>
                      <p className="text-gray-600">{doctor!.phone_number}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{translations('location')}</p>
                    <p className="text-gray-600">
                      {doctor!.latitude}, {doctor!.longitude}
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
                <span>{translations('workingHours')}</span>
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{translations('mondayFriday')}</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{translations('saturday')}</span>
                  <span className="font-medium">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{translations('sunday')}</span>
                  <span className="font-medium text-red-600">{translations('closed')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}