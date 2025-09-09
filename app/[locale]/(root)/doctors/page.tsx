'use client';
import { useEffect,  useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppStore } from '@/store/store';
import { useDoctorsQuery, useBookAppointmentMutation } from './api';
import { Filters } from './components/Filters';
import { DoctorList } from './components/DoctorList';
import { Doctor } from './types';
 

export default function Page() {
  const translations = useTranslations('doctors');
  const { user, latitude, longitude, setLocation } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const { data: doctors = [], isLoading, error } = useDoctorsQuery(latitude, longitude, '');

  const bookMutation = useBookAppointmentMutation();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setLocation(0, 0);
        }
      );
    } else {
      setLocation(0, 0);
    }
  }, [setLocation]);

  const filteredDoctors = doctors.filter((doctor: Doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.translations.field.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
 
  const LoadingPlaceholder = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-11">
      <div className="max-w-7xl mx-auto px-2 py-4 sm:py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="sm:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            {translations('pageTitle') || 'Find a Doctor'}
          </h1>
          <p className="sm:text-xl text-gray-600">
            {translations('pageDescription') || 'Book appointments with top doctors'}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 relative">
            <Filters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              onClearFilters={() => {
                setSearchTerm('');
                setSelectedRating('');
              }}
            />
          </div>

          <div className="lg:col-span-3">
            {error && (
              <div className="text-center py-8 text-red-600">
                {translations('toastMessages.error') || 'Failed to load doctors'}
              </div>
            )}

            {isLoading ? (
              <LoadingPlaceholder />
            ) : (
              <DoctorList
                doctors={filteredDoctors}
                onBookAppointment={(doctor) =>
                  bookMutation.mutate({
                    userId: user?.id || '',
                    latitude,
                    longitude,
                    doctorName: doctor.name,
                  })
                }
                isBookingPending={bookMutation.isPending}
                user={user!}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}