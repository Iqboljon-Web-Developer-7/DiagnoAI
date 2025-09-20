// app/actions.ts
"use server";

import axios from "axios";
import { cookies } from "next/headers";

// Helper: server-side fetch with authorization
export const serverFetch = async (url: string) => {
  const cookieStore = cookies();
  const token = cookieStore.get("access-token")?.value ?? null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
};

// Server Action to delete a booking
export const deleteBooking = async (id: string) => {
  const cookieStore = cookies();
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

    // Return a success message or redirect info
    return { success: "Booking deleted successfully" };
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw new Error("Failed to delete booking");
  }
};