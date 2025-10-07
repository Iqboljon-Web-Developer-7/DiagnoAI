"use server"

import axios from "axios";
import { cookies } from "next/headers";
import { revalidateTag } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL


// Helper: server-side fetch with Authorization
export const serverFetch = async (
    url: string,
    options: {
        headers?: Record<string, string>,
        method?: string,
        body?: any,
        cache?: RequestCache,
        credentials?: RequestCredentials,
        mode?: RequestMode,
        redirect?: RequestRedirect,
        next?: {
            tags?: string[],
            revalidate?: number,
            revalidatePath?: string
        },
    } = {}
) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("access-token")?.value ?? null;

    const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
        ...options.headers
    };

    const fetchOptions: RequestInit = {
        method: options.method || 'GET',
        headers: defaultHeaders,
        cache: options.cache || "no-store",
        ...(options.body && { body: JSON.stringify(options.body) }),
        ...(options.credentials && { credentials: options.credentials }),
        ...(options.mode && { mode: options.mode }),
        ...(options.redirect && { redirect: options.redirect }),
        ...(options.next && { next: options.next }),
    };

    const res = await fetch(`${API_BASE_URL}${url}`, fetchOptions);
    if (!res.ok) {
        return null;
    }
    return res.json();
};
export const deleteChat = async (id: string) => {
    const cookieStore = await cookies();
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

        revalidateTag('chats');

        return true;
    } catch (error) {
        console.error('Error deleting chat:', error);
        throw error;
    }
};


export const updateChat = async (chatId: string, form: FormData) => {
    const cookieStore = await cookies();
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
    const cookieStore = await cookies();
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
    const cookieStore = await cookies();
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
    const cookieStore = await cookies();
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
