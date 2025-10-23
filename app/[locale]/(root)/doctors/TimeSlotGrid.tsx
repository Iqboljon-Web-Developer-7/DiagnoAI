'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface TimeSlotGridProps {
    isLoading: boolean;
    bookedTimes: number[];
    availableSlots: number[];
    onBookAppointment: (time: number) => void;
    isBookingPending: boolean;
}

const TimeSlotGrid = memo(({ 
    isLoading, 
    bookedTimes, 
    availableSlots, 
    onBookAppointment,
    isBookingPending 
}: TimeSlotGridProps) => {
  const translations = useTranslations('doctors');

    const allTimes: number[] = Array.from({ length: 13 }, (_, i) => i + 8);
    const sortedTimes = allTimes.sort((a, b) => a - b);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0, scale: 0.8 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 20
            }
        }
    };

    if (isLoading) {
        return (
            <div className="bg-gray-800/80 backdrop-blur-xs rounded-xl p-6 border border-gray-700/50">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-green-300 border-t-green-700 rounded-full animate-spin"></div>
                        <Clock className="absolute inset-0 m-auto w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-gray-300 mt-4 font-medium">Loading available time slots...</p>
                </div>
            </div>
        );
    }

    if (availableSlots.length === 0) {
        return (
            <div className="bg-gray-800/80 backdrop-blur-xs rounded-xl p-6 border border-gray-700/50">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">No Available Slots</h3>
                    <p className="text-gray-400 text-center max-w-sm">
                        All time slots for this date are fully booked. Please select a different date.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800/80 backdrop-blur-xs rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-gray-200">{translations('noAvailableSlots')}</h3>
            </div>

            <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-88 overflow-y-auto overflow-x-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {sortedTimes.map((time: number) => {
                    const isBooked = bookedTimes.includes(time);
                    const timeString = time.toString().padStart(2, '0');
                    
                    return (
                        <motion.div key={time} variants={itemVariants}>
                            <Button
                                onClick={() => !isBooked && onBookAppointment(time)}
                                disabled={isBooked || isBookingPending}
                                className={`
                                    relative h-14 w-full text-sm font-semibold rounded-xl transition-all duration-300 overflow-hidden
                                    ${isBooked 
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed border-2 border-gray-600' 
                                        : 'bg-linear-to-br from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white shadow-lg hover:shadow-xl border-2 border-transparent hover:border-green-500 transform'
                                    }
                                `}
                                // whileHover={!isBooked ? { y: -2 } : undefined}
                                // whileTap={!isBooked ? { scale: 0.98 } : undefined}
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-lg font-bold">{timeString}:00</span>
                                    <div className="flex items-center gap-1 text-xs">
                                        {isBooked ? (
                                            <>
                                                <CheckCircle2 className="w-3 h-3" />
                                                 {translations('booked')}
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-3 h-3" />
                                                {translations('book')}
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Hover effect */}
                                {!isBooked && (
                                    <div className="absolute inset-0 bg-linear-to-br from-green-700/20 to-green-800/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                )}
                            </Button>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
});

TimeSlotGrid.displayName = 'TimeSlotGrid';
    
export { TimeSlotGrid };