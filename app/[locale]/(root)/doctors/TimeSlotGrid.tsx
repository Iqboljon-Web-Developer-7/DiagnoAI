'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-green-300 border-t-green-700 rounded-full animate-spin"></div>
                        <Clock className="absolute inset-0 m-auto w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-gray-600 mt-4 font-medium">Loading available time slots...</p>
                </div>
            </div>
        );
    }

    if (availableSlots.length === 0) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Available Slots</h3>
                    <p className="text-gray-600 text-center max-w-sm">
                        All time slots for this date are fully booked. Please select a different date.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Available Time Slots</h3>
            </div>

            <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-auto"
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
                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-2 border-gray-200' 
                                        : 'bg-gradient-to-br from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white shadow-lg hover:shadow-xl border-2 border-transparent hover:border-green-500 transform'
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
                                                Booked
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-3 h-3" />
                                                Available
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Hover effect */}
                                {!isBooked && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-700/20 to-green-800/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
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