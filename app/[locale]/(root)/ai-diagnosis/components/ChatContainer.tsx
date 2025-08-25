"use client";

import React from "react";
import { Loader2, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MessageItem from "./MessageItem";
import { ChatMessage } from "./types";

interface ChatContainerProps {
  chatMessages?: ChatMessage[] | null;
  deferredChatMessages: ChatMessage[];
  analyzing: boolean;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  scrollToEnd: (ref: { current: HTMLSpanElement | null }) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  chatMessages,
  deferredChatMessages,
  analyzing,
  chatContainerRef,
  messagesEndRef,
  scrollToEnd,
}) => {
  console.log(chatMessages);
  console.log(deferredChatMessages);
  
  
  return (
    <Card className="shadow-xl border-0 bg-[#edf8f4] backdrop-blur-sm">
      <CardContent className="p-0">
        <div
          className={`h-[500px] overflow-y-auto p-6 space-y-4 ${deferredChatMessages?.length === 0 ? "flex items-center justify-center" : ""}`}
          ref={chatContainerRef}
        >
          {deferredChatMessages?.length > 0 ? (
            deferredChatMessages.map((msg, idx) => (
              <MessageItem key={idx} message={msg} index={idx} scrollToEnd={scrollToEnd} />
            ))
          ) : !analyzing ? (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
                <Stethoscope className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to DiagnoAI</h3>
              <p className="text-gray-600 max-w-md">
                Describe your symptoms or upload medical documents to get started with your AI-powered
                medical consultation.
              </p>
            </div>
          ) : null}

          {analyzing && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 border-2 border-blue-200">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-50 p-4 rounded-2xl rounded-bl-md shadow-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Analyzing your symptoms...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatContainer;