'use client';

import React, { memo, useCallback, useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { useCreateBookingMutation, useFreeTimes } from './api';
import { toast } from 'sonner';
import { Doctor } from './types';
import { User } from '../hospitals/types';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TimeSlotGrid } from './TimeSlotGrid';

interface BookingDialogProps {
    isOpen: boolean;
    onClose: () => void;
    doctor: Doctor;
    user: User;
}

const BookingDialog = memo(({ isOpen, onClose, doctor, user }: BookingDialogProps) => {
    const translations = useTranslations('doctors');
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const token = user?.token;
    const formattedDate = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);
    
    const { data: freeTimes, isLoading: freeTimesLoading, refetch: refetchFreeTimes } = useFreeTimes(
        doctor?.id,
        token,
        formattedDate
    );

    const createBooking = useCreateBookingMutation(user?.token);

    const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(new Date(e.target.value));
    }, []);

    const handleBookAppointment = useCallback((time: number) => {
        if (!token) {
            toast(translations("auth"), {
                action: <Button className='mx-auto' onClick={() => router.push('/auth/register')}>Register</Button>
            });
            return;
        }

        const hour = time.toString().padStart(2, '0');
        const appointmentDate = `${formattedDate}T${hour}:00:00Z`;
        
        createBooking.mutate(
            { doctor: doctor.id, appointment_date: appointmentDate },
            {
                onSuccess: () => {
                    toast.success('Booking created successfully!', {
                        description: `Your appointment is confirmed for ${hour}:00 on ${selectedDate.toLocaleDateString()}`,
                        action: {
                            label: 'View',
                            onClick: () => router.push('/appointments')
                        }
                    });
                    refetchFreeTimes();
                    onClose();
                },
                onError: (error: any) => {
                    toast.error('Failed to create booking', {
                        description: error?.message || 'Please try again later'
                    });
                }
            }
        );
    }, [token, formattedDate, selectedDate, doctor.id, createBooking, refetchFreeTimes, onClose, router, translations]);

    const bookedTimes = useMemo(() => 
        freeTimes?.booked_times?.map(time => parseInt(time.split(':')[0])) ?? []
    , [freeTimes]);

    const availableSlots = useMemo(() => {
        const allTimes: number[] = Array.from({ length: 13 }, (_, i) => i + 8);
        return allTimes.filter(time => !bookedTimes.includes(time));
    }, [bookedTimes]);

    const dialogVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { 
                type: "spring" as const, 
                stiffness: 300, 
                damping: 25 
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.95, 
            y: 20,
            transition: { duration: 0.2 }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
                className="max-w-2xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <motion.div
                    variants={dialogVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <DialogHeader onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <Calendar className="w-8 h-8 text-white" />
                                </div>
                                
                                <motion.h2 
                                    className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    Book Appointment
                                </motion.h2>
                                
                                <motion.p 
                                    className="text-gray-600"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    with <span className="font-semibold text-blue-600">{doctor.name}</span>
                                </motion.p>
                            </div>

                            {/* Date Selection */}
                            <motion.div 
                                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                                        <Calendar className="w-5 h-5 text-blue-500" />
                                        {selectedDate.toLocaleDateString('en-US', { 
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                                
                                <div className="flex justify-center">
                                    <input
                                        type="date"
                                        onChange={handleDateChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        defaultValue={format(selectedDate, 'yyyy-MM-dd')}
                                    />
                                </div>
                            </motion.div>

                            {/* Time Slots */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <TimeSlotGrid
                                    isLoading={freeTimesLoading}
                                    bookedTimes={bookedTimes}
                                    availableSlots={availableSlots}
                                    onBookAppointment={handleBookAppointment}
                                    isBookingPending={createBooking.isPending}
                                />
                            </motion.div>

                            {/* Stats */}
                            <motion.div 
                                className="flex justify-center gap-8 text-sm text-gray-600"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>{availableSlots.length} Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <span>{bookedTimes.length} Booked</span>
                                </div>
                            </motion.div>
                        </div>
                    </DialogHeader>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
});

BookingDialog.displayName = 'BookingDialog';

export { BookingDialog };