// app/doctors/components/DoctorList.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Doctor } from '../types';
import { useRouter } from 'next/navigation';
import { formatNumber } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { format } from 'date-fns';
import { useCreateBookingMutation, useFreeTimes } from '../api';
import { useAppStore } from '@/context/store';
import { toast } from 'sonner';

interface DoctorListProps {
    doctors: Doctor[];
    onBookAppointment: (doctor: Doctor) => void;
    isBookingPending: boolean;
    user: {token:string}; // Replace with proper user type from your Zustand store
}

export function DoctorList({ doctors, onBookAppointment, isBookingPending, user }: DoctorListProps) {
    const translations = useTranslations('doctors');
    const router = useRouter()
    const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(new Date(e.target.value));
    };

    const token = user?.token;

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');

    const { data: freeTimes, isLoading: freeTimesLoading, refetch: refetchFreeTimes } = useFreeTimes(selectedDoctor!, token, formattedDate);

    
  const allTimes: number[] = Array.from({ length: 13 }, (_, i) => i + 8);
  const sortedTimes = allTimes.sort((a, b) => a - b);


    const bookedTimes = freeTimes?.booked_times?.map(time => {
    return parseInt(time.split(':')[0]);
  }) ?? [];

  const createBooking = useCreateBookingMutation();


    const handleBookAppointment = (time: number) => {
    const hour = time.toString().padStart(2, '0');
    const appointmentDate = `${formattedDate}T${hour}:00:00Z`;
    createBooking.mutate(
      { doctor: selectedDoctor!, appointment_date: appointmentDate },
      {
        onSuccess: () => {
          toast.success('Booking created successfully!');
          refetchFreeTimes();
        },
        onError: () => toast.error('Failed to create booking'),
      }
    );
  };

    return (
        <div className="space-y-6 cursor-pointer">
            {doctors.map((doctor) => (
                <Card
                    key={doctor.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-2 sm:gap-4 flex-col sm:flex-row">
                            <div className="relative shrink-0">
                                <Image
                                    width={80}
                                    height={80}
                                    src={doctor.image?.startsWith('http') ? doctor.image : `https://api.diagnoai.uz${doctor.image}`}
                                    alt={doctor.name}
                                    onClick={() => router.push(`/doctors/${doctor.id}`)}
                                    className="w-10 h-10 sm:w-20 sm:h-20 rounded-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="w-full">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 underline" onClick={() => router.push(`/doctors/${doctor.id}`)}>{doctor.name}</h3>
                                        <p className="text-blue-600 font-medium mb-2">{doctor.field}</p>
                                        <p className="text-gray-600 text-sm mb-3">Hospital: {doctor.hospital}</p>

                                        <p className="text-gray-700 mb-3 line-clamp-4" onClick={() => router.push(`/doctors/${doctor.id}`)}>{doctor.description}</p>

                                        <div className="flex items-center space-x-4 mb-3">
                                            {/* <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                {doctor.rating && <span className="font-medium">{doctor.rating}</span>}
                                                <span className="text-gray-500 text-sm">
                                                    {translations('doctorCard.reviews', { count: doctor.reviews || 0 }) ||
                                                        `${doctor.reviews || 0} reviews`}
                                                </span>
                                            </div>

                                            <div className="flex items-center space-x-1 text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">{doctor.longitude}, {doctor.latitude}</span>
                                            </div> */}

                                            {/* <div className="flex items-center space-x-1 text-gray-600">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-sm">{doctor.availability || 'N/A'}</span>
                                            </div> */}
                                        </div>

                                        <div className="flex items-center justify-between flex-wrap gap-1">
                                            <div>
                                                <span className="text-lg font-bold text-gray-900">
                                                    {/* <SeparatorInput separator='apostrophe' /> */}
                                                    {/* <NumericFormat inputMode='none' value={doctor.prize} disabled={true} width={'auto'} thousandSeparator="," /> */}
                                                    {formatNumber(doctor.prize!)}{" UZS"}
                                                </span>
                                                <span className="text-gray-500 text-sm ml-1">
                                                    {translations('doctorCard.consultationPriceSuffix') || 'per consultation'}
                                                </span>
                                            </div>

                                            <Dialog onOpenChange={(open) => {
                                                if (open) {
                                                    setSelectedDoctor(doctor.id);
                                                } else {
                                                    setSelectedDoctor(null);
                                                }
                                            }}>
                                                <DialogTrigger className='bg-blue-500 py-1 px-4 flex items-center justify-center gap-2 text-white border-none rounded-lg' onClick={(e) => e.stopPropagation()}> <Calendar className="w-4 h-4 mr-1" />
                                                    {translations('doctorCard.bookButton') || 'Book Appointment'}</DialogTrigger>
                                                <DialogContent onClick={(e) => e.stopPropagation()}>
                                                    <DialogHeader onClick={(e) => e.stopPropagation()}>
                                                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                        <div className="bg-white rounded-xl shadow-lg p-6">
                                                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                                                <Clock className="h-6 w-6 text-blue-600" />
                                                                <span className='text-lg md:text-3xl'>Available Time Slots ({selectedDate.toLocaleDateString()})</span>
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
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-72 overflow-auto">
                                                                    {sortedTimes.map((time: number) => (
                                                                        <button
                                                                            key={time}
                                                                            className={`px-4 py-2 rounded-lg transition-colors ${bookedTimes.includes(time) ? 'bg-gray-300 cursor-not-allowed text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                                                            onClick={() => !bookedTimes.includes(time) && handleBookAppointment(time)}
                                                                        >
                                                                            {time.toString().padStart(2, '0')}:00 {bookedTimes.includes(time) ? '- Booked' : '- Book'}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-600">No available slots on this date.</p>
                                                            )}
                                                        </div>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}