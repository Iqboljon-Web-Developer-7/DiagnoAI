import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Stethoscope } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Chat } from "../../types";
import { memo } from "react";

interface ChatMessagesProps {
  initialSelectedChat: Chat | null
  t: (key: string) => string;
}

const ChatMessages = ({ initialSelectedChat, t }: ChatMessagesProps) => {
  if (!initialSelectedChat?.messages?.length) {
    return (
      <div className="flex flex-row gap-[5%] items-center justify-center flex-wrap text-center animate-fade-in-down duration-200 opacity-0 delay-300">
        <div className="p-6 bg-gradient-to-r from-blue-200 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full mb-4">
          <Stethoscope className="h-12 w-12 text-blue-600 dark:text-blue-300" />
        </div>
        <h1 className="text-3xl font-semibold text-[#028090] dark:text-blue-300 mb-2">{t("title")}</h1>
      </div>
    );
  }

  return (
    <>
      {initialSelectedChat.messages.map((m) => (
        m.is_from_user ? (
          <div key={m?.id} className="flex justify-end">
            <div className="max-w-[80%] bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white p-4 rounded-2xl rounded-br-md shadow-lg">
              <p className="text-sm leading-relaxed">{m.content}</p>
            </div>
          </div>
        ) : (
          <div key={m?.id} className="flex justify-start">
            <div className="flex flex-col sm:flex-row gap-3 max-w-full sm:max-w-[80%]">
              <Avatar className="h-8 w-8 border-2 border-blue-200 dark:border-blue-900">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl rounded-bl-md shadow-md">
                <ReactMarkdown >{m.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        )
      ))}
    </>
  );
};


export default memo(ChatMessages)