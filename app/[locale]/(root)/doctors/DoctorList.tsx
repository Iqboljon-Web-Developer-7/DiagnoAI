'use client';

import React, { memo, useMemo } from 'react';
import { Doctor } from './types';
import { User } from '../hospitals/types';
import { DoctorCard } from './DoctorCard';
import { motion, AnimatePresence } from 'framer-motion';

interface DoctorListProps {
    doctors: Doctor[];
    onBookAppointment: (doctor: Doctor) => void;
    isBookingPending: boolean;
    user: User;
}

const DoctorList = memo(({ doctors, user }: DoctorListProps) => {
    const memoizedDoctors = useMemo(() => doctors, [doctors]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    if (!memoizedDoctors?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Doctors Found</h3>
                <p className="text-gray-500 text-center max-w-md">We couldn't find any doctors matching your criteria. Try adjusting your filters or search terms.</p>
            </div>
        );
    }

    return (
        <motion.div 
            className="space-y-8 max-w-6xl mx-auto "
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* <div className="text-center mb-12">
                <motion.h2 
                    className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    Expert Medical Professionals
                </motion.h2>
                <motion.p 
                    className="text-gray-600 text-lg max-w-2xl mx-auto"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Connect with qualified doctors and book your appointments seamlessly
                </motion.p>
            </div> */}

            <AnimatePresence mode="wait">
                <motion.div className="grid gap-8">
                    {memoizedDoctors.map((doctor, index) => (
                        <DoctorCard
                            key={doctor.id}
                            doctor={doctor}
                            user={user}
                            index={index}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
});

DoctorList.displayName = 'DoctorList';

export { DoctorList };