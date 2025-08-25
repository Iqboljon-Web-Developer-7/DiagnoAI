"use client";

import React, { memo } from "react";
import { MessageSquare, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Chat } from "./types";

interface ChatItemProps {
  chat: Chat;
  index: number;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

// Memoized Chat Item Component
const ChatItem = memo(({ chat, index, onSelect, onDelete }: ChatItemProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton
      onClick={() => onSelect(chat.id)}
      className="group relative p-0 rounded-lg hover:bg-blue-50 transition-all duration-200"
    >
      <div className="flex items-center gap-3 w-full">
        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
          <MessageSquare className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">Session {index + 1}</p>
          <p className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleDateString()}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(chat.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </SidebarMenuButton>
  </SidebarMenuItem>
));

ChatItem.displayName = "ChatItem";

export default ChatItem;