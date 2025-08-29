"use client";

import React from "react";
import Link from "next/link";
import { Brain, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ChatItem from "./ChatItem";
import { Chat } from "../types";

interface ChatSidebarProps {
  chats: Chat[];
  handleNewChat: () => void;
  handleDeleteChat: (id: string) => void;
  fetchChatById: (id: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  chats, 
  handleNewChat, 
  handleDeleteChat, 
  fetchChatById
}) => {
  return (
    <Sidebar hidden={true} className="border-r-0 shadow-lg bg-white/80 backdrop-blur-sm z-50">
      <SidebarHeader className="relative border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">DiagnoAI</h2>
            <p className="text-blue-100 text-sm">Medical Assistant</p>
          </div>
        </Link>
        <SidebarTrigger className="absolute bottom-0 -translate-y-full -translate-x-full bg-neutral-200 z-10 -right-10 text-black" />
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <Button
              onClick={handleNewChat}
              className="w-full mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Consultation
            </Button>

            <SidebarMenu className="gap-3">
              {chats.map((chat, i) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  index={i}
                  onSelect={fetchChatById}
                  onDelete={handleDeleteChat}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatSidebar;