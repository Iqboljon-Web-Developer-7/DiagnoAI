'use client';

import React, { memo, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Award, Star } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Doctor } from './types';
import { useRouter } from 'next/navigation';
import { User } from '../hospitals/types';
import { BookingDialog } from './BookingDialog';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";


interface DoctorCardProps {
    doctor: Doctor;
    user: User;
    index: number;
}

const DoctorCard = memo(({ doctor, user, index }: DoctorCardProps) => {
    const translations = useTranslations('doctors');
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDoctorClick = useCallback(() => {
        router.push(`/doctors/${doctor.id}`);
    }, [router, doctor.id]);

    const handleBookingClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDialogOpen(true);
    }, []);

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 12,
                delay: index * 0.1
            }
        }
    };

    return (
        <motion.div
            variants={
                cardVariants}
            initial="hidden"
            animate="visible"
        >
            <Card className="group relative overflow-hidden backdrop-blur-sm bg-white/90 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer border border-gray-200/50 hover:border-blue-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {doctor.prize && parseInt(doctor.prize.replace(/\D/g, '')) > 500000 && (
                    <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <Award className="w-3 h-3" />
                            Premium
                        </div>
                    </div>
                )}

                <CardContent className="p-2 py-6 sm:p-8 relative z-10">
                    <div className="flex items-start gap-6 flex-col lg:flex-row">
                        {/* Doctor Image */}
                        <motion.div
                            className="relative shrink-0 mx-auto lg:mx-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <div className="relative">
                                <Zoom>
                                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

                                    <Image
                                        width={500}
                                        height={500}
                                        src={`https://api.diagnoai.uz${doctor.image}`}
                                        alt={doctor.name}
                                        // onClick={handleDoctorClick}
                                        className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-2xl object-cover ring-4 ring-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                                        loading="lazy"
                                    />
                                {/* Online status indicator */}
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                </div>
                                </Zoom>
                            </div>
                        </motion.div>

                        {/* Doctor Info */}
                        <div className="flex-1 space-y-4 text-center lg:text-left w-full">
                            <div>
                                <motion.h3
                                    className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent hover:from-blue-600 hover:to-purple-600 transition-all duration-300 cursor-pointer mb-2"
                                    onClick={handleDoctorClick}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {doctor.name}
                                </motion.h3>

                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                                    <span className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        {doctor.translations?.field}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                        <span className="text-sm text-gray-600 ml-1">4.9</span>
                                    </div>
                                </div>

                                <Link href={`/hospitals/${doctor?.hospital?.id}`} className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 mb-4 hover:underline">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium">{doctor.hospital.name}</span>
                                </Link>
                            </div>

                            <motion.p
                                className="text-gray-700 leading-relaxed line-clamp-3 cursor-pointer hover:text-gray-900 transition-colors duration-200"
                                onClick={handleDoctorClick}
                                whileHover={{ scale: 1.01 }}
                            >
                                {doctor.translations?.description}
                            </motion.p>

                            {/* Action Bar */}
                            <div className="flex items-center justify-between  gap-4 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 mx-auto md:mx-0">
                                    <div className="text-center lg:text-left">
                                        <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            {doctor.prize}
                                        </span>
                                        <p className="text-gray-500 text-sm">
                                            {translations('doctorCard.consultationPriceSuffix') || 'per consultation'}
                                        </p>
                                    </div>
                                </div>

                                {user?.role !== 'clinic' && (
                                    <motion.button
                                        onClick={handleBookingClick}
                                        className="mx-auto shrink-0 md:mx-0 relative overflow-hidden bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                        <div className="relative flex items-center gap-2">
                                            <Calendar className="w-5 h-5" />
                                            {translations('doctorCard.bookButton') || 'Book Appointment'}
                                        </div>

                                        {/* Shine effect */}
                                        <div className="absolute inset-0 -top-full bg-gradient-to-b from-transparent via-white/20 to-transparent group-hover/btn:top-full transition-all duration-700" />
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>

                {/* Booking Dialog */}
                <BookingDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    doctor={doctor}
                    user={user}
                />
            </Card>
        </motion.div>
    );
});

DoctorCard.displayName = 'DoctorCard';

export { DoctorCard };