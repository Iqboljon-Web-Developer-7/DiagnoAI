"use client"

import { useState, useCallback, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppStore } from '@/store/store';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Trash2 } from 'lucide-react';

const API_BASE_URL = "https://api.diagnoai.uz";

interface Booking {
    id: number;
    appointment_date: string;
    books: number;
    doctor: number;
    number_of_approved: number;
    number_of_pending: number;
    number_of_rejected: number;
    status: 'pending' | 'approved' | 'rejected';
    todays_appointments: number;
    user: number;
}

const StatusIndicator = memo(({ status }: { status: Booking['status'] }) => {
    const statusColors = {
        approved: 'text-green-600',
        rejected: 'text-red-600',
        pending: 'text-yellow-600'
    };

    return (
        <span className={`capitalize ${statusColors[status]}`}>
            {status}
        </span>
    );
});

const BookingCard = memo(({ booking, onDelete, isDeleting }: { 
    booking: Booking; 
    onDelete: (id: number) => void;
    isDeleting: boolean;
}) => {
    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleString();
    }, []);

    return (
        <div className="p-4 border rounded-lg space-y-2">
            <div className="flex justify-between items-center">
                <span className="font-medium">Appointment Date:</span>
                <span>{formatDate(booking.appointment_date)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">Status:</span>
                <div className="flex items-center gap-2">
                    <StatusIndicator status={booking.status} />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(booking.id)}
                        disabled={isDeleting}
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
                {['Pending', 'Approved', 'Rejected'].map((status) => (
                    <div key={status} className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">{status}</div>
                        <div>{booking[`number_of_${status.toLowerCase()}` as keyof Booking]}</div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export const Bookings = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, user } = useAppStore();
    
    if (user?.role !== 'client' || !isLoggedIn) return null;

    const queryClient = useQueryClient();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['bookings', user?.token],
        queryFn: async () => {
            if (!isLoggedIn || !user?.token) return [];
            const resp = await axios.get<Booking[]>(`${API_BASE_URL}/bookings/user/bookings/`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            return resp.data;
        },
        enabled: !!isLoggedIn && !!user?.token
    });

    const deleteMutation = useMutation({
        mutationFn: async (bookingId: number) => {
            if (!user?.token) throw new Error("Not authenticated");
            return axios.delete(`${API_BASE_URL}/bookings/bookings/en/${bookingId}/update/`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
        },
        onSuccess: (_, bookingId) => {
            queryClient.setQueryData(['bookings', user?.token], 
                (oldData: Booking[] | undefined) => oldData?.filter(booking => booking.id !== bookingId)
            );
            toast("Booking deleted successfully");
        },
        onError: () => {
            toast("Failed to delete booking");
        }
    });

    const handleDeleteBooking = useCallback((bookingId: number) => {
        if (confirm("Are you sure you want to delete this booking?")) {
            deleteMutation.mutate(bookingId);
        }
    }, [deleteMutation]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="link" size="sm" className='hover:bg-sky-50'>
                    <Calendar />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>Your Bookings</span>
                    </DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex justify-center p-4">Loading...</div>
                ) : bookings.length > 0 ? (
                    <div className="grid gap-4 mt-4 max-h-96 overflow-y-auto">
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onDelete={handleDeleteBooking}
                                isDeleting={deleteMutation.isPending}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-4 text-gray-500">
                        No bookings found
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

