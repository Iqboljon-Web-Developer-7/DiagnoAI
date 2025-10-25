"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAppStore } from "@/store/store";

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

const StatusIndicator = ({ status }: { status: Booking["status"] }) => {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status]}`}
    >
      {status}
    </span>
  );
};

const BookingCard = ({ booking }: { booking: Booking }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success(
        "Booking deleted successfully"
      );  
    },
    onError: (error) => {
      toast.error(
        "Failed to delete booking"
      );
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(booking.id);
  };

  return (
    <div className="p-4 border rounded-lg bg-neutral-100 dark:bg-zinc-800 border-none shadow-xs hover:shadow-md transition space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-gray-600 dark:text-neutral-200">Appointment Date:</span>
        <span className="text-gray-800 dark:text-neutral-200">
          {formatDate(booking.appointment_date)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-600 dark:text-neutral-200">Status:</span>
        <div className="flex items-center gap-2">
          <StatusIndicator status={booking.status} />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["Pending", "Approved", "Rejected"].map((status) => (
          <div
            key={status}
            className="rounded-lg border p-2 text-center bg-gray-100 dark:bg-neutral-900 border-neutral-400 dark:border-neutral-700"
          >
            <div className="text-xs text-gray-500 dark:text-neutral-200">{status}</div>
            <div className="font-semibold text-gray-800 dark:text-neutral-300">
              {booking[`number_of_${status.toLowerCase()}` as keyof Booking]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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

// Hypothetical fetch function
const fetchBookings = async (token: string): Promise<Booking[]> => {
  const response = await fetch("https://api.diagnoai.uz/bookings/user/bookings/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }
  return response.json();
};

// Hypothetical delete function
const deleteBooking = async (id: number): Promise<void> => {
  const response = await fetch(`/api/bookings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access-token") || ""}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete booking");
  }
};

export default function Bookings() {
  const {user} = useAppStore()

  let role, token;
  role = user?.role
  token = user?.token  


  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => fetchBookings(token!),
    enabled: role === "client" && !!token, // Only fetch if conditions are met
  });

  console.log(role);
  

  if (user?.role !== "client" || !token) {
    return null;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error loading bookings</div>;
  }

  return (
    <Dialog defaultOpen={false}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="hover:bg-sky-50 dark:!text-neutral-200 hover:dark:!text-black rounded-full">
          <Calendar />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-neutral-200 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Your Bookings</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <BookingSkeleton />
        ) : bookings && bookings.length > 0 ? (
          <div className="grid gap-4 mt-4 max-h-96 overflow-y-auto pr-2">
            {bookings.map((booking: Booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500">No bookings found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}