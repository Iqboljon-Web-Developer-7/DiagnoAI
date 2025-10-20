'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { memo, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Award, Star } from 'lucide-react';
import { Doctor } from './types';
import { useRouter } from 'next/navigation';
import { User } from '../hospitals/types';
import { BookingDialog } from './BookingDialog';
import { Link } from '@/i18n/navigation';
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { motion } from 'framer-motion';

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
                damping: 20,
                delay: 1
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
        >
            <Card className="group relative overflow-hidden backdrop-blur-xs bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-400">
                <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 dark:from-blue-900/50 via-transparent to-purple-50/30 dark:to-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {doctor.prize && parseInt(doctor.prize.replace(/\D/g, '')) > 500000 && (
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                        <div className="bg-linear-to-r from-amber-400 to-yellow-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <Award className="w-2 h-2 sm:w-3 sm:h-3" />
                            Premium
                        </div>
                    </div>
                )}

                <CardContent className="p-2 py-4 sm:p-6 relative z-10">
                    <div className="flex items-start gap-4 sm:gap-6 flex-col lg:flex-row">
                        <motion.div
                            className="relative shrink-0 mx-auto lg:mx-0 float-left"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <div className="relative">
                                <Zoom>
                                    <div className="absolute inset-0 bg-linear-to-br from-green-100 to-green-500 dark:from-green-900 dark:to-green-700 rounded-xl sm:rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                                    <Image
                                        width={500}
                                        height={500}
                                        src={`https://api.diagnoai.uz${doctor.image}`}
                                        alt={doctor.name}
                                        className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl sm:rounded-2xl object-cover ring-2 sm:ring-4 ring-white dark:ring-gray-900 shadow-lg group-hover:shadow-xl transition-all duration-300"
                                        loading="lazy"
                                    />
                                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 dark:bg-green-700 rounded-full border-2 sm:border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-lg">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white dark:bg-gray-900 rounded-full animate-pulse" />
                                    </div>
                                </Zoom>
                            </div>
                        </motion.div>

                        <div className="flex-1 space-y-2 sm:space-y-3 text-center lg:text-left w-full">
                            <div>
                                <motion.h3
                                    className="mx-auto lg:mx-0 w-fit border-b-blue-200 border-b text-lg sm:text-2xl lg:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-400 dark:hover:to-purple-400 transition-all duration-300 cursor-pointer mb-2"
                                    onClick={handleDoctorClick}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {doctor.name}
                                </motion.h3>

                                <div className="flex items-center justify-center lg:justify-start gap-1 sm:gap-2 mb-2 sm:mb-3 mt-5">
                                    <span className="bg-linear-to-r from-blue-600 to-green-600 dark:from-blue-700 dark:to-green-700 text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                                        {doctor.translations?.field}
                                    </span>
                                    <div className="flex items-center gap-0.5 sm:gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 ml-1">4.9</span>
                                    </div>
                                </div>

                                <Link href={`/hospitals/${doctor?.hospital?.id}`} className="flex items-center justify-center lg:justify-start gap-1 sm:gap-2 text-gray-600 dark:text-gray-300 mb-2 sm:mb-3 hover:underline">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 dark:text-blue-400" />
                                    <span className="text-sm sm:text-base font-medium">{doctor.hospital.name}</span>
                                </Link>

                                <motion.p
                                className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed line-clamp-3 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                                onClick={handleDoctorClick}
                                whileHover={{ scale: 1.01 }}
                            >
                                {doctor.translations?.description}
                            </motion.p>
                            </div>

                            

                            <div className="flex items-center md:justify-between gap-2 sm:gap-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex-wrap">
                                <div className="flex items-center justify-center gap-1 sm:gap-2 mx-auto md:mx-0 flex-wrap md:flex-nowrap">
                                    <span className="text-base sm:text-xl font-bold bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                        {doctor.prize}
                                    </span>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                        {translations('doctorCard.consultationPriceSuffix') || 'per consultation'}
                                    </p>
                                </div>

                                {user?.role !== 'clinic' && (
                                    <motion.button
                                        onClick={handleBookingClick}
                                        className="mx-auto shrink-0 md:mx-0 relative overflow-hidden bg-linear-to-r from-blue-600 to-green-600 dark:from-blue-700 dark:to-green-700 hover:from-blue-700 hover:to-green-700 dark:hover:from-blue-800 dark:hover:to-green-800 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-green-700 to-green-700 dark:from-green-800 dark:to-green-800 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                        <div className="relative flex items-center gap-1 sm:gap-2">
                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm sm:text-base">
                                                {translations('doctorCard.bookButton') || 'Book Appointment'}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 -top-full bg-linear-to-b from-transparent via-white/20 dark:via-gray-900/20 to-transparent group-hover/btn:top-full transition-all duration-700" />
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>

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
