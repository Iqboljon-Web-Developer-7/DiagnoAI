'use server';


import { redirect } from "next/navigation";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Doctor {
  id: number;
  name: string;
  translations?: {
    field?: string;
    description?: string;
  };
  hospital?: {
    name: string;
  };
}

export const handleDoctorClick = async (doctorId: number) => {
    redirect(`/doctors/${doctorId}`);
  };

  export const handleViewAllClick = async () => {
    redirect('/doctors');
  };

  
export async function getDoctors(doctorIds: number[], token: string): Promise<Doctor[]> {
  if (!doctorIds?.length) return [];

  try {
    const responses = await Promise.all(
      doctorIds.map(async (id) => {
        const response = await fetch(`${API_BASE_URL}/api/en/doctors/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store'
        });
        if (!response.ok) throw new Error(`Failed to fetch doctor ${id}`);
        return response.json();
      })
    );
    return responses;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}