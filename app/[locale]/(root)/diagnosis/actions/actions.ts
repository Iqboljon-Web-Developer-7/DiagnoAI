'use server';


import axios from "axios";
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

 export const handleDeleteChat = async (id: string, token: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/chats/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // setChats((c) => c.filter((x) => x.id !== id));
      // if (selectedChat?.id === id) {
        // setSelectedChat(null);
        // setChatMessages([]);
        // setDoctors([]);
      // }
      // toast.success("Chat deleted");
    } catch (e) {
      // toast.error("Failed to delete");
    }
  };


interface Chat {
  id: string;
  message?: string;
  doctors?: number[];
}

export const createChat = async (form: FormData, token: string): Promise<Partial<Chat>> => {
  try {
    const response = await axios.post<Partial<Chat>>(`${API_BASE_URL}/chats/`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};
export const updateChat = async (id: string, form: FormData, token: string): Promise<Partial<Chat>> => {
  try {
    const response = await axios.patch<Partial<Chat>>(`${API_BASE_URL}/chats/${id}/`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating chat:", error);
    throw error;
  }
};
