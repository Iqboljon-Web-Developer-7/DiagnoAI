"use client";

import { useState, memo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Trash2 } from "lucide-react";

const API_BASE_URL = "https://api.diagnoai.uz";

interface Booking {
  id: number;
  appointment_date: string;
  books: number;
  doctor: number;
  number_of_approved: number;
  number_of_pending: number;
  number_of_rejected: number;
  status: "pending" | "approved" | "rejected";
  todays_appointments: number;
  user: number;
}

const STATUS_COLORS = {
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
} as const;

const formatDate = (date: string) =>
  new Date(date).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const StatusIndicator = memo(({ status }: { status: Booking["status"] }) => {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status]}`}
    >
      {status}
    </span>
  );
});

const BookingCard = memo(
  ({
    booking,
    onDelete,
    isDeleting,
  }: {
    booking: Booking;
    onDelete: (id: number) => void;
    isDeleting: boolean;
  }) => {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-gray-600">Appointment Date:</span>
          <span className="text-gray-800">
            {formatDate(booking.appointment_date)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">Status:</span>
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
        <div className="grid grid-cols-3 gap-3">
          {["Pending", "Approved", "Rejected"].map((status) => (
            <div
              key={status}
              className="rounded-lg border p-2 text-center bg-gray-50"
            >
              <div className="text-xs text-gray-500">{status}</div>
              <div className="font-semibold text-gray-800">
                {
                  booking[
                    `number_of_${status.toLowerCase()}` as keyof Booking
                  ]
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

const BookingSkeleton = () => (
  <div className="p-4 border rounded-lg animate-pulse space-y-3">
    <div className="h-4 bg-gray-200 rounded w-1/2" />
    <div className="h-4 bg-gray-200 rounded w-1/3" />
    <div className="grid grid-cols-3 gap-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
);

export const Bookings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user } = useAppStore();

  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: async () => {
      if (!isLoggedIn || !user?.token) return [];
      const resp = await axios.get<Booking[]>(
        `${API_BASE_URL}/bookings/user/bookings/`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      return resp.data;
    },
    enabled: !!isLoggedIn && !!user?.token,
  });

  const deleteMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      if (!user?.token) throw new Error("Not authenticated");
      return axios.delete(
        `${API_BASE_URL}/bookings/bookings/en/${bookingId}/update/`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
    },
    onMutate: async (bookingId) => {
      await queryClient.cancelQueries({ queryKey: ["bookings", user?.id] });
      const prev = queryClient.getQueryData<Booking[]>(["bookings", user?.id]);
      queryClient.setQueryData(["bookings", user?.id], (old: Booking[]) =>
        old?.filter((b) => b.id !== bookingId)
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(["bookings", user?.id], ctx?.prev);
      toast.error("Failed to delete booking");
    },
    onSuccess: () => toast.success("Booking deleted successfully"),
  });

  const handleDeleteBooking = (bookingId: number) => {
    // 🚨 Replace with a shadcn AlertDialog for better UX
    if (confirm("Are you sure you want to delete this booking?")) {
      deleteMutation.mutate(bookingId);
    }
  };

  // 👇 condition after hooks to keep hook order consistent
  if (user?.role !== "client" || !isLoggedIn) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="hover:bg-sky-50 rounded-full">
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
          <div className="grid gap-4 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <BookingSkeleton key={i} />
            ))}
          </div>
        ) : bookings?.length > 0 ? (
          <div className="grid gap-4 mt-4 max-h-96 overflow-y-auto pr-2">
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
          <div className="text-center p-4 text-gray-500">No bookings found</div>
        )}
      </DialogContent>
    </Dialog>
  );
};
