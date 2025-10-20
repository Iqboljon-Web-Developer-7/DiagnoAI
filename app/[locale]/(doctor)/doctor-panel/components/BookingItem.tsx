"use client";
import React from "react";
import { Calendar, MoreHorizontal, Trash2, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type Booking = {
  id: number;
  appointment_date: string;
  status: string;
  // ...other fields that may exist, extend as needed
};

export type StatusConfig = Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    labelKey: string;
  }
>;

interface BookingItemProps {
  booking: Booking;
  doctorName: string;
  statusConfig: StatusConfig;
  showActions: number | null;
  setShowActions: (id: number | null) => void;
  updating: number | null;
  updateBookingStatus: (id: number, status: Booking["status"]) => void;
  deleteBooking: (id: number) => void;
  t: (key: string) => string;
}

const BookingItem: React.FC<BookingItemProps> = ({
  booking,
  doctorName,
  statusConfig,
  showActions,
  setShowActions,
  updating,
  updateBookingStatus,
  deleteBooking,
  t,
}) => {
  const date = new Date(booking.appointment_date);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {t("doctor")}: {doctorName}
              </p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {formattedDate} {t("at")} {formattedTime}
                </span>
              </div>
            </div>
          </div>
          {/* Extend with extra fields if needed */}
        </div>

        <div className="flex items-center space-x-3 ml-4">
          {/* Status Badge */}
          <div className={cn("px-3 py-1 rounded-full text-xs font-medium border", statusConfig[booking.status].color)}>
            <div className="flex items-center space-x-1">
              {React.createElement(statusConfig[booking.status].icon, { className: "h-3 w-3" })}
              <span>{t(statusConfig[booking.status].labelKey)}</span>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowActions(showActions === booking.id ? null : booking.id)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              disabled={updating === booking.id}
              aria-label={t("actionsForBooking")}
            >
              {updating === booking.id ? (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </button>

            {showActions === booking.id && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-30">
                <div className="py-1">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                    {t("updateStatus")}
                  </div>
                  {Object.entries(statusConfig).map(([status, config]) => {
                    if (status === "pending" || status === "completed") return null;
                    return (
                      booking.status !== status && (
                        <button
                          key={status}
                          onClick={() => updateBookingStatus(booking.id, status as Booking["status"])}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          {React.createElement(config.icon, { className: "h-4 w-4" })}
                          <span>
                            {t("markAs")} {t(config.labelKey)}
                          </span>
                        </button>
                      )
                    );
                  })}

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{t("deleteBooking")}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingItem;