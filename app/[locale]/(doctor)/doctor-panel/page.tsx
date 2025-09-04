"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Filter , MoreHorizontal, Check, X, AlertCircle, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAppStore } from '@/Store/store';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface Booking {
  id: number;
  appointment_date: string;
  books: number;
  doctor: number;
  number_of_approved: number;
  number_of_pending: number;
  number_of_rejected: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  todays_appointments: number;
  user: number;
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Check, label: 'Confirmed' },
  cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: X, label: 'Cancelled' },
  completed: { color: 'bg-green-100 text-green-800 border-green-200', icon: Check, label: 'Completed' }
};

function DoctorDashboard() {
  const { isLoggedIn, user } = useAppStore();
  const t = useTranslations("doctorPanel");
  const [bookings, setBookings] = useState<Booking[]>([]);
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

  const API_BASE_URL = "https://api.diagnoai.uz";

  const fetchBookings = async () => {
    if (!isLoggedIn || !user?.token) return;
    
    try {
      setLoading(true);
      const params: any = {};
      
      if (filter.status) params.status = filter.status;
      if (filter.today) params.today = true;

      const resp = await axios.get<Booking[]>(`${API_BASE_URL}/bookings/doctor/bookings/`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        params
      });
      
      setBookings(resp.data);
    } catch (err) {
      toast("failedToLoadBookings");
      console.error(err);       
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isLoggedIn, user?.token, filter.status, filter.today]);

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    if (!user?.token) return;

    try {
      setUpdating(bookingId);
      await axios.put(
        `${API_BASE_URL}/bookings/bookings/en/${bookingId}/update/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus as any }
            : booking
        )
      );

      toast("bookingStatusUpdated");
      setShowActions(null);
    } catch (err) {
      toast("failedToUpdateBooking");
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const deleteBooking = async (bookingId: number) => {
    if (!user?.token || !confirm(t("confirmDeleteBooking"))) return;

    try {
      setUpdating(bookingId);
      await axios.delete(`${API_BASE_URL}/bookings/bookings/en/${bookingId}/update/`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      // Remove from local state
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      toast("bookingDeleted");
    } catch (err) {
      toast("failedToDeleteBooking");
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access the doctor dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      {/* Header */}
      <div className="  border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your appointments and bookings</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Welcome back, Dr. {user?.name || 'Doctor'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{stats.confirmed}</p>
              </div>
              <Check className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{stats.completed}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{stats.cancelled}</p>
              </div>
              <X className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Today Filter */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filter.today}
                onChange={(e) => setFilter(prev => ({ ...prev, today: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Today's Bookings</span>
            </label>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Appointments ({bookings.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-6 font-medium rounded-md text-gray-500">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading appointments...
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">No bookings match your current filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(booking.appointment_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="text-sm">
                          <span className="text-gray-500">Total Books:</span>
                          <span className="ml-2 text-gray-900">{booking.books}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Today's Appointments:</span>
                          <span className="ml-2 text-gray-900">{booking.todays_appointments}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Approved:</span>
                          <span className="ml-2 text-gray-900">{booking.number_of_approved}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Pending:</span>
                          <span className="ml-2 text-gray-900">{booking.number_of_pending}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Rejected:</span>
                          <span className="ml-2 text-gray-900">{booking.number_of_rejected}</span>
                        </div>
                      </div> */}
                    </div>

                    <div className="flex items-center space-x-3 ml-4">
                      {/* Status Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[booking.status].color}`}>
                        <div className="flex items-center space-x-1">
                          {React.createElement(statusConfig[booking.status].icon, { className: "h-3 w-3" })}
                          <span>{statusConfig[booking.status].label}</span>
                        </div>
                      </div>

                      {/* Actions Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === booking.id ? null : booking.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                          disabled={updating === booking.id}
                        >
                          {updating === booking.id ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </button>

                        {showActions === booking.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                                Update Status
                              </div>
                              {Object.entries(statusConfig).map(([status, config]) => {
                                if(status == 'pending' || status == "completed") return;

                                return booking.status !== status && (
                                  <button
                                    key={status}
                                    onClick={() => updateBookingStatus(booking.id, status)}
                                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                  >
                                    {React.createElement(config.icon, { className: "h-4 w-4" })}
                                    <span>Mark as {config.label}</span>
                                  </button>
                                )
                              }
                              )}
                              
                              <div className="border-t border-gray-100 mt-1 pt-1">
                                <button
                                  onClick={() => deleteBooking(booking.id)}
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete Booking</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;