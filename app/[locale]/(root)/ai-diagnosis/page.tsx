import { serverFetch } from "./actions";
import { Chat, Doctor } from "./types";
import DiagnosisClient from "./DiagnosisClient";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ chatId?: string; doctorIds?: string, isOpenedInOtherWeb?: string }>;
}) {
  const { locale } = await params;
  const { chatId: id, doctorIds, isOpenedInOtherWeb } = await searchParams;

  let chats: Chat[] = [];
  let doctors: Doctor[] = [];
  let selectedChat: Chat | null = null;

  try {
    const response = await serverFetch(`/chats`, { next: { tags: ["chats"] } });
    chats = response;
  } catch (e) {
    chats = [];
  }

  if (id) {
    try {
      const chat = await serverFetch(`/chats/${id}`, {
        next: { tags: ["chats-" + id], revalidate: 3600 },
      });

      if (chat) {
        selectedChat = {
          id: chat.id,
          created_at: chat.created_at,
          updated_at: chat.updated_at,
          messages: chat.messages || [],
        };
      }
    } catch (e) {
      selectedChat = null;
    }
  }

  if (doctorIds) {
    try {
      const ids = doctorIds.split(",").map((id) => parseInt(id.trim()));
      const doctorPromises = ids.map((docId) =>
        serverFetch(`/api/${locale}/doctors/${docId}`)
      );

      const doctorResults = await Promise.all(doctorPromises);
      doctors = doctorResults.filter(Boolean) as Doctor[];
    } catch (e) {
      doctors = [];
    }
  }

  return (
    <DiagnosisClient
      initialChats={chats}
      initialSelectedChat={selectedChat}
      initialDoctors={doctors}
      initialSelectedId={id ?? undefined}
      isOpenedInOtherWeb={isOpenedInOtherWeb!}
    />
  );
}
