// app/bookings/page.tsx
// Remove "use client" directive to enable SSR
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// API base URL (ideally from environment variables)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.diagnoai.uz";

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

// StatusIndicator component (pure, no hooks, SSR-friendly)
const StatusIndicator = ({ status }: { status: Booking["status"] }) => {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status]}`}
    >
      {status}
    </span>
  );
};

// BookingCard component (pure, no hooks, SSR-friendly)
const BookingCard = ({ booking }: { booking: Booking }) => {
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
          <form action="/api/bookings/delete" method="POST">
            <input type="hidden" name="bookingId" value={booking.id} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete the booking.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction type="submit">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
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
              {booking[`number_of_${status.toLowerCase()}` as keyof Booking]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// BookingSkeleton component (pure, SSR-friendly)
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

// Server-side data fetching with getServerSideProps
export async function getServerSideProps(context: any) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;

  // Redirect if not authenticated or not a client
  if (!token || role !== "client") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/user/bookings/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }

    const bookings: Booking[] = await response.json();

    return {
      props: {
        bookings,
        user: { token, role },
      },
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return {
      props: {
        bookings: [],
        user: { token, role },
      },
    };
  }
}

// Main Bookings component
export default function Bookings({ bookings, user }: { bookings: Booking[]; user: { token: string; role: string } }) {
  // Hide component if user is not a client or not authenticated
  if (user.role !== "client") {
    return null;
  }

  return (
    <Dialog defaultOpen={false}>
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

        {bookings.length > 0 ? (
          <div className="grid gap-4 mt-4 max-h-96 overflow-y-auto pr-2">
            {bookings.map((booking) => (
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