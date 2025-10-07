// app/actions.ts
"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const serverFetch = async (url: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("access-token")?.value ?? null;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${url}`, { headers, cache: "no-store" });
    if (!res.ok) {
        return null;
    }
    return res.json();
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
    });

    if (!response.ok) {
      throw new Error("Failed to delete booking");
    }

    // return { success: true };
  } catch (error) {
    console.error("Error deleting booking:", error);
    // throw new Error("Failed to delete booking");
  }
}
