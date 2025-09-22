import React from "react";
import { Chat, Doctor } from "./types";
import { serverFetch } from "./actions";
import DiagnosisClient from "./DiagnosisClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ chatId?: string; doctorIds?: string }>
}) {
  const { locale } = await params;
  const { chatId: id, doctorIds } = await searchParams;

  console.log("language", locale);

  let chats: Chat[] = [];
  let doctors: Doctor[] = [];

  try {
    const data = await serverFetch(`${API_BASE_URL}/chats`);
    chats = data;
  } catch (e) {
    chats = [];
  }

  let selectedChat: Chat | null = null;

  console.log("Chats", chats);

  console.log(id);
  

  if (id) {
    try {
      const data = await serverFetch(`${API_BASE_URL}/chats/${id}`);
      console.log(`Chat: ${id}`, data);

      if (data) {
        selectedChat = {
          id: data.id,
          created_at: data.created_at,
          updated_at: data.updated_at,
          messages: data.messages || [],
        };
      }
    } catch (e) {
      selectedChat = null;
    }
  }

  if (doctorIds) {
    try {
      const ids = doctorIds.split(',').map(id => parseInt(id.trim()));
      const doctorPromises = ids.map(docId =>
        serverFetch(`${API_BASE_URL}/api/en/doctors/${docId}`)
      );

      const doctorResults = await Promise.all(doctorPromises);
      doctors = doctorResults.filter(Boolean) as Doctor[];
    } catch (e) {
      doctors = [];
    }
  }

  return (
    <>
      <DiagnosisClient
        initialChats={chats}
        initialSelectedChat={selectedChat}
        initialDoctors={doctors}
        initialSelectedId={id ?? null}
      />
    </>
  );
}