import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { useRouter } from 'next/navigation'
import React from 'react'
import { MessageSquare, Trash } from 'lucide-react'

interface Chat {
  id: string
  created_at: string
}

interface SideBarChatProps {
  initialChats: Chat[]
  handleDeleteChat: (id: string) => void
}

const SideBarChat = ({ initialChats, handleDeleteChat }: SideBarChatProps) => {
  const router = useRouter()

  return (
    <>
      {initialChats?.map((chat, i) => (
        <SidebarMenuItem key={chat.id}>
          <SidebarMenuButton
            size={'lg'}
            onClick={() => router.push(`/ai-diagnosis?chatId=${chat.id}`)}
            className="group relative p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 my-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Session {i + 1}</p>
                <p className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleDateString()}</p>
              </div>
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteChat(chat.id)
                }}
                className="md:opacity-0 group-hover:opacity-100 text-red-500 bg-red-50 p-3 rounded-full duration-200 transition-all hover:text-red-100 hover:bg-red-500"
              >
                <Trash className="h-4 w-4" />
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  )
}

export default SideBarChat