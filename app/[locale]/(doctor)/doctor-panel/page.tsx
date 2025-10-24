"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar, Clock, User, Filter, MoreHorizontal, Check, X, AlertCircle, Trash2, Search } from 'lucide-react';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { debounce } from 'lodash'; // Assume lodash is installed for debounce
import StatCard from "./components/StatCard";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import BookingItem from "./components/BookingItem";
import AddDoctorDialog from './components/AddDoctor';
import { useAppStore } from '@/store/store';

interface Booking {
  id: number;
  appointment_date: string;
  books: number;
  doctor: number;
  number_of_approved: number;
  number_of_pending: number;
  number_of_rejected: number;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  todays_appointments: number;
  user: number;
}

interface Doctor {
  id: number;
  name: string;
  // Other fields omitted for brevity
}

const statusConfig: Record<Booking['status'], { color: string; icon: React.ComponentType<{ className?: string }>; labelKey: string }> = {
  pending: { color: 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800/30', icon: Clock, labelKey: 'pending' },
  confirmed: { color: 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-300 dark:border-blue-800/30', icon: Check, labelKey: 'confirmed' },
  canceled: { color: 'bg-red-100/80 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-300 dark:border-red-800/30', icon: X, labelKey: 'canceled' },
  completed: { color: 'bg-green-100/80 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-300 dark:border-green-800/30', icon: Check, labelKey: 'completed' }
};

const API_BASE_URL = "https://api.diagnoai.uz";
const LANG_CODE = 'en'; // Could be dynamic via useLocale from next-intl

function DoctorDashboard() {
  const { isLoggedIn, user } = useAppStore();
  const t = useTranslations("doctorPanel");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [doctors, setDoctors] = useState<Record<number, Doctor>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    status: string;
    today: boolean;
    search: string;
  }>({
    status: '',
    today: false,
    search: ''
  });
  const [showActions, setShowActions] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!isLoggedIn || !user?.token) return;

    try {
      setLoading(true);
      const params: Record<string, string | boolean> = {};
      if (filter.status) params.status = filter.status;
      if (filter.today) params.today = true;
      if (filter.search) params.search = filter.search;

      const resp = await axios.get<Booking[]>(`${API_BASE_URL}/bookings/doctor/bookings/`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        params
      });

      setBookings(resp.data);
    } catch (err) {
      toast.error(t("failedToLoadBookings"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, user?.token, filter.status, filter.today, filter.search, t]);

  const fetchDoctors = useCallback(async (doctorIds: number[]) => {
    if (!user?.token) return;

    try {
      const uniqueIds = [...new Set(doctorIds)];
      const promises = uniqueIds.map(id =>
        axios.get<Doctor>(`${API_BASE_URL}/api/${LANG_CODE}/doctors/${id}/`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }).then(resp => ({ id, data: resp.data }))
      );

      const results = await Promise.all(promises);
      const newDoctors = results.reduce((acc, { id, data }) => {
        acc[id] = data;
        return acc;
      }, {} as Record<number, Doctor>);

      setDoctors(prev => ({ ...prev, ...newDoctors }));
    } catch (err) {
      toast.error(t("failedToLoadDoctors"));
      console.error(err);
    }
  }, [user?.token, t]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (bookings.length > 0) {
      const doctorIds = bookings.map(b => b.doctor).filter(Boolean);
      if (doctorIds.length > 0) {
        fetchDoctors(doctorIds);
      }
    }
  }, [bookings, fetchDoctors]);

  const updateBookingStatus = useCallback(async (bookingId: number, newStatus: Booking['status']) => {
    if (!user?.token) return;

    try {
      setUpdating(bookingId);
      await axios.put(
        `${API_BASE_URL}/bookings/bookings/${LANG_CODE}/${bookingId}/update/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      toast.success(t("bookingStatusUpdated"));
      setShowActions(null);
    } catch (err) {
      toast.error(t("failedToUpdateBooking"));
      console.error(err);
    } finally {
      setUpdating(null);
    }
  }, [user?.token, t]);

  const deleteBooking = useCallback(async (bookingId: number) => {
    if (!user?.token || !confirm(t("confirmDeleteBooking"))) return;

    try {
      setUpdating(bookingId);
      await axios.delete(`${API_BASE_URL}/bookings/bookings/${LANG_CODE}/${bookingId}/update/`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      toast.success(t("bookingDeleted"));
    } catch (err) {
      toast.error(t("failedToDeleteBooking"));
      console.error(err);
    } finally {
      setUpdating(null);
    }
  }, [user?.token, t]);

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    canceled: bookings.filter(b => b.status === 'canceled').length,
  }), [bookings]);

  const handleSearchChange = useMemo(() => debounce((value: string) => {
    setFilter(prev => ({ ...prev, search: value }));
  }, 300), []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('authenticationRequired')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('pleaseLogIn')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-12">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('doctorDashboard')}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{t('manageAppointments')}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100/80 dark:bg-blue-900/30 rounded-lg">
                <AddDoctorDialog />
                {/* <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">{t('welcomeBack')}, Dr. {user?.name || t('doctor')}</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title={t('totalBookings')} value={stats.total} icon={Calendar} color="text-blue-600 dark:text-blue-400" />
          <StatCard title={t('pending')} value={stats.pending} icon={Clock} color="text-yellow-600 dark:text-yellow-400" />
          <StatCard title={t('confirmed')} value={stats.confirmed} icon={Check} color="text-blue-600 dark:text-blue-400" />
          <StatCard title={t('completed')} value={stats.completed} icon={Check} color="text-green-600 dark:text-green-400" />
          <StatCard title={t('canceled')} value={stats.canceled} icon={X} color="text-red-600 dark:text-red-400" />
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                aria-label={'status filter'}
              >
                <option value="">{t('allStatus')}</option>
                {Object.keys(statusConfig).map(status => (
                  <option key={status} value={status}>{t(statusConfig[status as Booking['status']].labelKey)}</option>
                ))}
              </select>
            </div>

            {/* Today Filter */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filter.today}
                onChange={(e) => setFilter(prev => ({ ...prev, today: e.target.checked }))}
                className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('todaysBookings')}</span>
            </label>

            {/* Search Input */}
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder={t('searchBookings')}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                aria-label={t('searchBookings')}
              />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('appointments')} ({bookings.length})
            </h2>
          </div>

          {loading ? (
            <LoadingState />
          ) : bookings.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  booking={booking}
                  doctorName={doctors[booking.doctor]?.name || t('loading')}
                  statusConfig={statusConfig}
                  showActions={showActions}
                  setShowActions={setShowActions}
                  updating={updating}
                  updateBookingStatus={(id, status) => updateBookingStatus(id, status as Booking['status'])}
                  deleteBooking={deleteBooking}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// interface StatCardProps {
//   title: string;
//   value: number;
//   icon: React.ComponentType<{ className?: string }>;
//   color: string;
// }

// const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
//   <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
//         <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{value}</p>
//       </div>
//       <Icon className={`h-8 w-8 ${color}`} />
//     </div>
//   </div>
// );

// const LoadingState: React.FC = () => (
//   <div className="p-8 text-center">
//     <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-6 font-medium rounded-md text-gray-600 dark:text-gray-400">
//       <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//       </svg>
//       Loading appointments...
//     </div>
//   </div>
// );

// const EmptyState: React.FC = () => {
//   const t = useTranslations("doctorPanel");
//   return (
//     <div className="p-8 text-center">
//       <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
//       <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{t('noAppointmentsFound')}</h3>
//       <p className="text-gray-600 dark:text-gray-400">{t('noBookingsMatchFilters')}</p>
//     </div>
//   );
// };

// interface BookingItemProps {
//   booking: Booking;
//   doctorName: string;
//   statusConfig: typeof statusConfig;
//   showActions: number | null;
//   setShowActions: (id: number | null) => void;
//   updating: number | null;
//   updateBookingStatus: (id: number, status: Booking['status']) => void;
//   deleteBooking: (id: number) => void;
//   t: ReturnType<typeof useTranslations>;
// }

// const BookingItem: React.FC<BookingItemProps> = ({
//   booking,
//   doctorName,
//   statusConfig,
//   showActions,
//   setShowActions,
//   updating,
//   updateBookingStatus,
//   deleteBooking,
//   t
// }) => {
//   const date = new Date(booking.appointment_date);
//   const formattedDate = date.toLocaleDateString();
//   const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   return (
//     <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
//       <div className="flex items-start justify-between">
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center space-x-3 mb-3">
//             <div className="shrink-0">
//               <div className="w-10 h-10 bg-blue-100/80 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
//                 <User className="h-5 w-5 text-blue-800 dark:text-blue-300" />
//               </div>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('doctor')}: {doctorName}</p>
//               <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
//                 <Calendar className="h-4 w-4 mr-1" />
//                 <span>{formattedDate} at {formattedTime}</span>
//               </div>
//             </div>
//           </div>

//           {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <div className="text-sm">
//               <span className="text-gray-600 dark:text-gray-400">{t('totalBooks')}:</span>
//               <span className="ml-2 text-gray-900 dark:text-gray-100">{booking.books}</span>
//             </div>
//             <div className="text-sm">
//               <span className="text-gray-600 dark:text-gray-400">{t('todaysAppointments')}:</span>
//               <span className="ml-2 text-gray-900 dark:text-gray-100">{booking.todays_appointments}</span>
//             </div>
//             <div className="text-sm">
//               <span className="text-gray-600 dark:text-gray-400">{t('approved')}:</span>
//               <span className="ml-2 text-gray-900 dark:text-gray-100">{booking.number_of_approved}</span>
//             </div>
//             <div className="text-sm">
//               <span className="text-gray-600 dark:text-gray-400">{t('pending')}:</span>
//               <span className="ml-2 text-gray-900 dark:text-gray-100">{booking.number_of_pending}</span>
//             </div>
//             <div className="text-sm">
//               <span className="text-gray-600 dark:text-gray-400">{t('rejected')}:</span>
//               <span className="ml-2 text-gray-900 dark:text-gray-100">{booking.number_of_rejected}</span>
//             </div>
//           </div> */}
//         </div>

//         <div className="flex items-center space-x-3 ml-4">
//           {/* Status Badge */}
//           <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[booking.status].color}`}>
//             <div className="flex items-center space-x-1">
//               {React.createElement(statusConfig[booking.status].icon, { className: "h-3 w-3" })}
//               <span>{t(statusConfig[booking.status].labelKey)}</span>
//             </div>
//           </div>

//           {/* Actions Menu */}
//           <div className="relative">
//             <button
//               onClick={() => setShowActions(showActions === booking.id ? null : booking.id)}
//               className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//               disabled={updating === booking.id}
//               aria-label={t('actionsForBooking')}
//             >
//               {updating === booking.id ? (
//                 <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               ) : (
//                 <MoreHorizontal className="h-4 w-4" />
//               )}
//             </button>

//             {showActions === booking.id && (
//               <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-30">
//                 <div className="py-1">
//                   <div className="px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
//                     {t('updateStatus')}
//                   </div>
//                   {Object.entries(statusConfig).map(([status, config]) => {
//                     if (status == 'pending' || status == "completed") return;
//                     return booking.status !== status && (
//                       <button
//                         key={status}
//                         onClick={() => updateBookingStatus(booking.id, status as Booking['status'])}
//                         className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
//                       >
//                         {React.createElement(config.icon, { className: "h-4 w-4" })}
//                         <span>{t('markAs')} {t(config.labelKey)}</span>
//                       </button>
//                     )
//                   })}

//                   <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
//                     <button
//                       onClick={() => deleteBooking(booking.id)}
//                       className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                       <span>{t('deleteBooking')}</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
export default DoctorDashboard;