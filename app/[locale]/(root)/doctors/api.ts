'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/Store/store';
import { useTranslations } from 'next-intl';
import { Doctor, Booking } from './types';
import { toast } from 'sonner';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/`;

export async function fetchDoctors({
  latitude,
  longitude,
  selectedSpecialty,
  token,
}: {
  latitude: number;
  longitude: number;
  selectedSpecialty: string;
  token: string | undefined;
}) {
  if (!token) {
    throw new Error('Authentication required');
  }

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString()
  });
  if (selectedSpecialty) params.append('field', selectedSpecialty);

  const res = await fetch(`${API_BASE_URL}api/en/doctors/?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch doctors');
  const rawData = await res.json();

  // Transform API response to match Doctor interface used in UI
  const transformed: Doctor[] = (Array.isArray(rawData) ? rawData : rawData?.results ?? []).map((d: any) => ({
    id: d.id,
    name: d.name,
    field: d.translations?.field ?? d.tags?.[0] ?? '',
    hospital: d.hospital?.name ?? '',
    description: d.translations?.description ?? '',
    rating: d.rating ?? undefined,
    reviews: d.reviews ?? undefined,
    distance: d.distance ?? undefined,
    availability: d.availability ?? undefined,
    price: d.price ?? undefined,
    prize: d.prize ?? undefined,
    image: d.image ? (d.image.startsWith('http') ? d.image : `${API_BASE_URL}${d.image}`) : undefined,
    experience: d.experience ?? undefined,
    longitude: d.hospital?.longitude ?? undefined,
    latitude: d.hospital?.latitude ?? undefined,
  }));

  return transformed;
}

export function useDoctorsQuery(latitude: number, longitude: number, selectedSpecialty?: string) {
  const { user } = useAppStore();

  return useQuery<Doctor[]>({
    queryKey: ['doctors', latitude, longitude, selectedSpecialty],
    queryFn: () => fetchDoctors({
      latitude,
      longitude,
      selectedSpecialty: selectedSpecialty ?? '',
      token: user?.token
    }),
    enabled: !!user?.token,
  });
}

export function useBookAppointmentMutation() {
  const { addAppointment, user } = useAppStore();
  const translations = useTranslations('doctors');

  return useMutation({
    mutationFn: async ({
      userId,
      latitude,
      longitude,
      doctorName,
    }: {
      userId: string;
      latitude: number;
      longitude: number;
      doctorName: string;
    }) => {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());
      formData.append('message', `Book appointment with ${doctorName}`);

      const res = await fetch(`${API_BASE_URL}chats/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to book appointment');
      return res.json();
    },
    onSuccess: (_data, variables) => {
      addAppointment({
        doctor: variables.doctorName,
        specialty: '', // Will be updated in todos.tsx
        date: new Date().toISOString().split('T')[0],
        time: '14:00',
        type: translations('doctorCard.bookButton') || 'Appointment',
        status: 'Tasdiqlangan',
      });
      toast(
        translations('toastMessages.bookAppointment', { doctorName: variables.doctorName }) ||
        `Appointment booked with ${variables.doctorName}`,
      );
    },
    onError: () => {
      toast.error(
        translations('toastMessages.error') || 'Failed to book appointment'
      );
    },
  });
}

export function useDoctorQuery(id: string, token: string | undefined) {
  return useQuery<Doctor | null>({
    queryKey: ['doctor', id],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/en/doctors/${id}/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) return null;
        const data = await res.json();

        // Transform API response to match Doctor interface
        return {
          id: data.id,
          name: data.name,
          field: data.translations?.field ?? data.tags?.[0] ?? '',
          hospital: data.hospital?.name ?? '',
          description: data.translations?.description ?? '',
          rating: data.rating ?? undefined,
          reviews: data.reviews ?? undefined,
          distance: data.distance ?? undefined,
          availability: data.availability ?? undefined,
          price: data.price ?? undefined,
          prize: data.prize ?? undefined,
          image: data.image ? (data.image.startsWith('http') ? data.image : `https://api.diagnoai.uz${data.image}`) : undefined,
          experience: data.experience ?? undefined,
          longitude: data.hospital?.longitude ?? undefined,
          latitude: data.hospital?.latitude ?? undefined,
        };
      } catch {
        return null;
      }
    },
    enabled: !!id && !!token,
  });
}

export function useFreeTimes(doctorId: number, token: string | undefined, date: string) {
  return useQuery<{booked_times: string[]}>({
    queryKey: ['freeTimes', doctorId, date],
    queryFn: async () => {
      if (!token) {
        throw new Error('Authentication required');
      }

      const res = await fetch(
        `${API_BASE_URL}bookings/doctors/${doctorId}/free-times/?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch free times');
      }

      return res.json();
    },
    enabled: !!doctorId && !!token && !!date,
  });
}

// New Hooks for Booking System

export function useCreateBookingMutation() {
  const { user } = useAppStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ doctor, appointment_date }: { doctor: number; appointment_date: string }) => {
      if (!user?.token) throw new Error('Authentication required');
      const res = await fetch(`${API_BASE_URL}bookings/bookings/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ doctor, appointment_date }),
      });
      if (!res.ok) throw new Error('Failed to create booking');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeTimes'] });
    },
  });
}

export function useGetClinicBookings(token: string | undefined, enabled: boolean) {
  return useQuery<Booking[]>({
    queryKey: ['clinicBookings'],
    queryFn: async () => {
      if (!token) throw new Error('Authentication required');
      const res = await fetch(`${API_BASE_URL}bookings/doctor/bookings/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch clinic bookings');
      return res.json(); // Assumes array of bookings
    },
    enabled: enabled && !!token,
  });
}

export function useUpdateBookingMutation(lang_code: string) {
  const { user } = useAppStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ booking_id, status }: { booking_id: number; status: Booking['status'] }) => {
      if (!user?.token) throw new Error('Authentication required');
      const res = await fetch(`${API_BASE_URL}bookings/bookings/${lang_code}/${booking_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update booking');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicBookings'] });
    },
  });
}

export function useDeleteBookingMutation(lang_code: string) {
  const { user } = useAppStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ booking_id }: { booking_id: number }) => {
      if (!user?.token) throw new Error('Authentication required');
      const res = await fetch(`${API_BASE_URL}bookings/bookings/${lang_code}/${booking_id}/update/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete booking');
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicBookings'] });
    },
  });
}

// Optionally add useGetUserBookings if needed for other pages