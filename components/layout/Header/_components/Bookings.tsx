"use client"

import { useState } from 'react';
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

interface Filter {
    status?: string;
    today?: boolean;
}

export const Bookings = () => {
    const { isLoggedIn, user } = useAppStore();
    if(user?.role != 'client') return;
    
    const [filter, setFilter] = useState<Filter>({});
    const [isOpen, setIsOpen] = useState(false);

    const queryClient = useQueryClient();
    const API_BASE_URL = "https://api.diagnoai.uz";

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['bookings', filter, user?.token],
        queryFn: async () => {
            if (!isLoggedIn || !user?.token) return [];

            const params: any = {};
            if (filter.status) params.status = filter.status;
            if (filter.today) params.today = true;

            const resp = await axios.get<Booking[]>(`${API_BASE_URL}/bookings/user/bookings/`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
                params
            });
            return resp.data;
        },
        enabled: !!isLoggedIn && !!user?.token
    });

    const deleteMutation = useMutation({
        mutationFn: async (bookingId: number) => {
            if (!user?.token) throw new Error("Not authenticated");
            return axios.delete(`${API_BASE_URL}/bookings/bookings/en/${bookingId}/update/`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
        },
        onSuccess: (_, bookingId) => {
            queryClient.setQueryData(['bookings', filter, user?.token], 
                (oldData: Booking[] | undefined) => oldData?.filter(booking => booking.id !== bookingId)
            );
            toast("Booking deleted successfully");
        },
        onError: () => {
            toast("Failed to delete booking");
        }
    });

    const handleDeleteBooking = (bookingId: number) => {
        if (confirm("Are you sure you want to delete this booking?")) {
            deleteMutation.mutate(bookingId);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="link" size={"sm"} className='hover:bg-sky-50'><Calendar /></Button>
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
                ) : (
                    <div className="grid gap-4 mt-4 max-h-96 overflow-y-auto">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="p-4 border rounded-lg space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Appointment Date:</span>
                                    <span>{formatDate(booking.appointment_date)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Status:</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`capitalize ${booking.status === 'approved' ? 'text-green-600' :
                                                booking.status === 'rejected' ? 'text-red-600' :
                                                    'text-yellow-600'
                                            }`}>
                                            {booking.status}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteBooking(booking.id)}
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="text-center p-2 bg-gray-50 rounded">
                                        <div className="font-medium">Pending</div>
                                        <div>{booking.number_of_pending}</div>
                                    </div>
                                    <div className="text-center p-2 bg-gray-50 rounded">
                                        <div className="font-medium">Approved</div>
                                        <div>{booking.number_of_approved}</div>
                                    </div>
                                    <div className="text-center p-2 bg-gray-50 rounded">
                                        <div className="font-medium">Rejected</div>
                                        <div>{booking.number_of_rejected}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {bookings.length === 0 && !isLoading && (
                    <div className="text-center p-4 text-gray-500">
                        No bookings found
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
