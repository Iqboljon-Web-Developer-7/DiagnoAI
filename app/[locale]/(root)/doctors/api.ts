'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/context/store';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { Doctor } from './types';

const API_BASE_URL = 'https://api.diagnoai.uz/api';

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

    const res = await fetch(`${API_BASE_URL}/en/doctors/?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Failed to fetch doctors');
    const rawData = await res.json();
    // Transform API response to match Doctor interface used in UI
    const doctors: Doctor[] = (Array.isArray(rawData) ? rawData : rawData?.results || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        field: d.translations?.field || d.field || '',
        hospital: d.hospital?.name || '',
        description: d.translations?.description || d.description || '',
        rating: d.rating ?? undefined,
        reviews: d.reviews ?? undefined,
        distance: d.distance ?? undefined,
        availability: d.availability ?? undefined,
        price: d.price ?? undefined,
        prize: d.prize ?? undefined,
        image: d.image ?? undefined,
        experience: d.experience ?? undefined,
        langitude: d.longitude ?? undefined,
        latitude: d.latitude ?? undefined,
    }));
    return doctors;
}

export function useDoctorsQuery(latitude: number, longitude: number, selectedSpecialty: string) {
    const { user } = useAppStore();
    
    return useQuery<Doctor[]>({
        queryKey: ['doctors', latitude, longitude, selectedSpecialty],
        queryFn: () => fetchDoctors({ 
            latitude, 
            longitude, 
            selectedSpecialty,
            token: user?.token 
        }),
        enabled: !!latitude && !!longitude && !!user?.token,
    });
}

export function useBookAppointmentMutation() {
    const { addAppointment, user } = useAppStore();
    const translations = useTranslations('doctors');
    const { toast } = useToast();

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

            const res = await fetch(`${API_BASE_URL}/chats/`, {
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
            toast({
                title:
                    translations('toastMessages.bookAppointment', { doctorName: variables.doctorName }) ||
                    `Appointment booked with ${variables.doctorName}`,
            });
        },
        onError: () => {
            toast({
                title: translations('toastMessages.error') || 'Failed to book appointment',
                variant: 'destructive',
            });
        },
    });
}