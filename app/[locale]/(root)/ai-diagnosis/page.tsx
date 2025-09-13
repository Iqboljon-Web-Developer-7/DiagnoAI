"use server"

import React from "react";
import { cookies } from "next/headers";
import { Chat, Doctor } from "./types";
import { DiagnosisClient } from "./DiagnosisClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export default async function Page({ 
    searchParams,
}: { 
    searchParams: Promise<{ chatId?: string }>
}) {
    const {chatId: id} = await searchParams

    // read token from cookie (set by /api/set-token endpoint)
    const cookieStore = cookies();
    // @ts-ignore
    const token = cookieStore.get("access-token")?.value ?? null; // change cookie name if different

    // Helper: server-side fetch with Authorization
    const serverFetch = async (url: string) => {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(url, { headers, cache: "no-store" });
        if (!res.ok) {
            // swallow silently and return null; client can handle fallback
            return null;
        }
        return res.json();
    };

    // fetch chats list (server side)
    let chats: Chat[] = [];
    try {
        const data = await serverFetch(`${API_BASE_URL}/chats`);
        if (Array.isArray(data)) chats = data;
    } catch (e) {
        // ignore - we'll render UI and client can refetch if needed
        chats = [];
    }

    // fetch selected chat if id provided
    let selectedChat: Chat | null = null;
    let doctors: Doctor[] = [];
 
    if (id) {
        try {
            const data = await serverFetch(`${API_BASE_URL}/chats/${id}`);

            console.log(data);
            
            
            if (data) {
                selectedChat = {
                    id: data.id,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    messages: data.messages || [],
                };

                if (Array.isArray(data.doctors) && data.doctors.length) {
                    const docs = await Promise.all(
                        data.doctors.map((docId: number) => serverFetch(`${API_BASE_URL}/api/en/doctors/${docId}`)),
                    );
                    doctors = docs.filter(Boolean) as Doctor[];
                }
            }
        } catch (e) {
            selectedChat = null;
        }
    }

    // Render client interactive component, hydrated with SSR data
    return (
        <>
            <DiagnosisClient
                initialChats={chats}
                initialSelectedChat={selectedChat}
                initialDoctors={doctors}
                initialSelectedId={id ?? null}
                token={token}
            />
        </>
    );
}
