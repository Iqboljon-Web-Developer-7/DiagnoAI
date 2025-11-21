// app/actions.ts
"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

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
      console.log(res);
      

    if (!res.ok) {
        return null;
    }

    if(res.status == 204) {
      return "success"
    }
    return res?.json();
};

// Server Action to delete a booking
export async function deleteBooking(formData: FormData) {
  const cookieStore = await cookies();
  const id = formData.get('id') as string;

  if (!id) {
    throw new Error("Booking ID is required");
  }

  const token = cookieStore.get("access-token")?.value ?? null;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const url = `https://api.diagnoai.uz/bookings/bookings/en/${id}/update/`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers,
      next:{tags: ['bookings']}
    });

    if (!response.ok) {
      throw new Error("Failed to delete booking");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw new Error("Failed to delete booking");
  }
}
