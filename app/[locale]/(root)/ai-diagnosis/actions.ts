"use server"

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