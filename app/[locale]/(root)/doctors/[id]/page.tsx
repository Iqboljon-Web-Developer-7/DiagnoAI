'use client';

import DoctorMain from './components/DoctorMain';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDoctorQuery } from '../api';
import { useAppStore } from '@/context/store';

interface Doctor {
    id: number;
    name: string;
    hospital: string;
    field: string;
    description: string;
    image: string;
    latitude: string;
    longitude: string;
    prize: number;
    phone_number?: string;
}



function Page({ params }: { params: { id: string; locale: string } }) {
    const { id } = params
    const { user } = useAppStore();


    const {data:doctor, isLoading: loading} = useDoctorQuery(id, user?.token)
    // const [doctor, setDoctor] = useState<Doctor | null>(null);
    // const [loading, setLoading] = useState(true);
    // const router = useRouter();


    // useEffect(() => {
    //     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjo0OTEwMzE2MTUyLCJpYXQiOjE3NTY3MTYxNTIsImp0aSI6IjQ0ZDZjZWNmYjIzYzRhYTQ4MzJmN2I4NDA3YzI0YTRhIiwidXNlcl9pZCI6IjE1In0.dfyCxD5dUllDVV341-g1aa1BaCjDe9LBimtfM3aMlos';

    //     const loadDoctor = async () => {
    //         const result = await fetchDoctor(id, token);
    //         setDoctor(result);
    //         setLoading(false);
    //         if (!result) {
    //             router.push('/not-found');
    //         }
    //     };

    //     loadDoctor();
    // }, [params.id, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!doctor) {
        return null;
    }

    return <DoctorMain doctor={doctor!} doctorId={params.id} />;
}

export default Page
