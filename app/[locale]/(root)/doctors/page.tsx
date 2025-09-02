'use client';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppStore } from '@/Store/store';
import { useDoctorsQuery, useBookAppointmentMutation } from './api';
// import { Specialties } from './components/Specialties';
import { Filters } from './components/Filters';
import { DoctorList } from './components/DoctorList';
import { Doctor, Specialty } from './types';
import { haversine } from '@/lib/utils';

export default function Page() {
  const translations = useTranslations('doctors');
  const { user, latitude, longitude, setLocation, isLoggedIn } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const { data: doctors = [], isLoading, error } = useDoctorsQuery(latitude, longitude, '');

  // Book appointment mutation
  const bookMutation = useBookAppointmentMutation();

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude);
        },
        () => {
          bookMutation.mutate(
            { userId: '', latitude, longitude, doctorName: '' },
            {
              onError: () => {
                // Error toast handled in useBookAppointmentMutation
              },
            }
          );
        }
      );
    }
  }, [setLocation, bookMutation, latitude, longitude]);

  // const enrichedDoctors = useMemo(() => {
  //   if (!latitude || !longitude) return doctors

  //   return doctors.map((h: Doctor) => ({
  //     ...h,
  //     distance: haversine(latitude, longitude, h.latitude, h.longitude),
  //     rating: h.rating || 0,
  //   }))
  // }, [ latitude, longitude])


  // Filter doctors (client-side)
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.field.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = !selectedRating || (doctor.rating && doctor.rating >= Number.parseFloat(selectedRating));
    
    // const matchesSpecialty = !selectedSpecialty || doctor.field === selectedSpecialty;
    return matchesSearch && matchesRating
  });

  const specialties: Specialty[] = Array.from(new Set(doctors.map((doctor) => doctor.field))).map((name) => ({
    name,
    count: doctors.filter((d) => d.field === name).length,
    icon: '🩺',
  }));


  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {translations('toastMessages.error') || 'Failed to load doctors'}
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 py-4 sm:py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            {translations('pageTitle') || 'Find a Doctor'}
          </h1>
          <p className="sm:text-xl text-gray-600">
            {translations('pageDescription') || 'Book appointments with top doctors'}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Filters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              // selectedSpecialty={selectedSpecialty}
              // setSelectedSpecialty={setSelectedSpecialty}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              specialties={specialties}
              onClearFilters={() => {
                setSearchTerm('');
                // setSelectedSpecialty('');
                setSelectedRating('');
                bookMutation.mutate(
                  { userId: '', latitude, longitude, doctorName: '' },
                  {
                    onSuccess: () => {
                      // Success toast handled in useBookAppointmentMutation
                    },
                  }
                );
              }}
            />
          </div>

          <div className="lg:col-span-3">
            {/* <div className="flex justify-between items-center mb-6"> */}
              {/* <h2 className="text-2xl font-bold text-gray-900">
                {translations('doctorsListTitle', { count: filteredDoctors.length }) ||
                  `${filteredDoctors.length} Doctors`}
              </h2> */}
            {/* </div> */}

            {!isLoggedIn && 
              <p className='text-center text-red-400 animate-fade-in-down delay-1000 opacity-0'>
                "You're not logged in"  
              </p>
            }

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
                user={user}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}