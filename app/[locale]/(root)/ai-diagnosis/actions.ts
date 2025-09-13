"use server"

import axios from "axios";
import { cookies } from "next/headers";


// Helper: server-side fetch with Authorization
export const serverFetch = async (url: string) => {
    const cookieStore = cookies();
    // @ts-ignore
    const token = cookieStore.get("access-token")?.value ?? null;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) {

        return null;
    }
    return res.json();
};

export const deleteChat = async (id: string) => {
    const cookieStore = cookies();
    // @ts-ignore
    const token = cookieStore.get("access-token")?.value ?? null;

    if (!token) {
        throw new Error("No authorization token found");
    }

    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/chats/${id}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 204) {
            throw new Error(`Failed to delete chat: ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error('Error deleting chat:', error);
        throw error;
    }
};


export const updateChat = async (chatId: string, form: FormData) => {
    const cookieStore = cookies();
    // @ts-ignore
    const token = cookieStore.get("access-token")?.value ?? null;

    if (!token) {
        throw new Error("No authorization token found");
    }

    try {
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}/`, form, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        if (!response.data) {
            throw new Error('Failed to update chat');
        }

        return response.data;
    } catch (error) {
        console.error('Error updating chat:', error);
        throw error;
    }
};
  

export const createChat = async (form: FormData) => {
    const cookieStore = cookies();
    // @ts-ignore
    const token = cookieStore.get("access-token")?.value ?? null;

    if (!token) {
        throw new Error("No authorization token found");
    }

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chats/`, form, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        if (!response.data) {
            throw new Error('Failed to create chat');
        }

        return response.data;
    } catch (error) {
        console.error('Error creating chat:', error);
        throw error;
    }
};


export const getDoctors = async (ids: number[]) => {
    const cookieStore = cookies();
    // @ts-ignore
    const token = cookieStore.get("access-token")?.value ?? null;

    if (!token) {
        throw new Error("No authorization token found");
    }

    try {
        const doctors = await Promise.all(
            ids.map(id => 
                axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/en/doctors/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            )
        );

        return doctors.map(response => response.data);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error;
    }
};


export const getChats = async (userId: string) => {
    const cookieStore = cookies();
    // @ts-ignore
    const token = cookieStore.get("access-token")?.value ?? null;

    if (!token) {
        throw new Error("No authorization token found");
    }

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: { user_id: userId }
        });

        if (!response.data) {
            throw new Error('Failed to fetch chats');
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching chats:', error);
        throw error;
    }
};
