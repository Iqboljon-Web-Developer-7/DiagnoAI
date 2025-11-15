import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { useRouter } from 'next/navigation'
import React, { memo } from 'react'
import { MessageSquare, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Chat {
  id: string
  created_at: string
}

interface SideBarChatProps {
  initialChats: Chat[]
  handleDeleteChat: (id: string) => void
  initialSelectedId: string | undefined
  isPending?: boolean
}

const SideBarChat = ({ initialChats, handleDeleteChat, initialSelectedId, isPending }: SideBarChatProps) => {
  const router = useRouter()

  return (
    <>
      {initialChats?.map((chat, i) => (
        <SidebarMenuItem key={chat.id}>
          <SidebarMenuButton
            size={'lg'}
            className={`cursor-pointer active:translate-y-0.5 group relative bg-blue-100 dark:bg-blue-950 rounded-xl p-2 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 ${initialSelectedId == chat.id ? 'bg-blue-300 dark:bg-blue-800' : ''}`}
          >
            <Link className='w-full' href={`/ai-diagnosis?chatId=${chat.id}`}>
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 my-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 dark:bg-blue-950 dark:group-hover:bg-blue-900 transition-colors">
                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Session {i + 1}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(chat.created_at).toLocaleDateString()}</p>
              </div>
              <Button
                disabled={isPending}
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteChat(chat.id)
                }}
                className={`md:opacity-0 bg-transparent group-hover:opacity-100 text-red-500 dark:text-red-400 p-3 rounded-full  transition-all hover:text-red-100 hover:bg-red-500 dark:hover:text-red-900 dark:hover:bg-red-700 ${isPending ? 'animate-pulse duration-300!' : ''}`}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  )
}

export default memo(SideBarChat)