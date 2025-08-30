// app/doctors/components/DoctorList.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Doctor } from '../types';
import { useRouter } from 'next/navigation';

interface DoctorListProps {
    doctors: Doctor[];
    onBookAppointment: (doctor: Doctor) => void;
    isBookingPending: boolean;
    user: string; // Replace with proper user type from your Zustand store
}

export function DoctorList({ doctors, onBookAppointment, isBookingPending, user }: DoctorListProps) {
    const translations = useTranslations('doctors');
    const router = useRouter()

    return (
        <div className="space-y-6 cursor-pointer">
            {doctors.map((doctor) => (
                <Card
                onClick={() => router.push(`/doctors/${doctor.id}`)}
                key={doctor.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-2 sm:gap-4 flex-col sm:flex-row">
                            <div className="relative shrink-0">
                                <Image
                                    width={80}
                                    height={80}
                                    src={doctor.image?.startsWith('http') ? doctor.image : `https://api.diagnoai.uz${doctor.image}` }
                                    alt={doctor.name}
                                   
                                    className="w-10 h-10 sm:w-20 sm:h-20 rounded-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="w-full">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                                        <p className="text-blue-600 font-medium mb-2">{doctor.field}</p>
                                        <p className="text-gray-600 text-sm mb-3">Hospital: {doctor.hospital}</p>

                                        <p className="text-gray-700 mb-3">{doctor.description}</p>

                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                {doctor.rating && <span className="font-medium">{doctor.rating}</span>}
                                                <span className="text-gray-500 text-sm">
                                                    {translations('doctorCard.reviews', { count: doctor.reviews || 0 }) ||
                                                        `${doctor.reviews || 0} reviews`}
                                                </span>
                                            </div>

                                            <div className="flex items-center space-x-1 text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">{doctor.langitude}, {doctor.latitude}</span>
                                            </div>

                                            <div className="flex items-center space-x-1 text-gray-600">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-sm">{doctor.availability || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between flex-wrap gap-1">
                                            <div>
                                                <span className="text-lg font-bold text-gray-900">{doctor.prize || 'N/A'}</span>
                                                <span className="text-gray-500 text-sm ml-1">
                                                    {translations('doctorCard.consultationPriceSuffix') || 'per consultation'}
                                                </span>
                                            </div>

                                            <Button
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700"
                                                onClick={() => onBookAppointment(doctor)}
                                                disabled={!user || isBookingPending}
                                            >
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {translations('doctorCard.bookButton') || 'Book Appointment'}
                                            </Button>
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