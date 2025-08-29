"use client";

import React, { memo, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MarkdownTypewriter } from "react-markdown-typewriter";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "../types";

interface MessageItemProps {
  message: ChatMessage;
  index: number;
  scrollToEnd: (ref: { current: HTMLSpanElement | null }) => void;
}

// Memoized Message Item Component
const MessageItem = memo(({ message, index, scrollToEnd }: MessageItemProps) => {
  const messageRef = useRef<HTMLSpanElement>(null);

  console.log(index);
  console.log(scrollToEnd);
  
  

  // useEffect(() => {
  //   if (message.ai) {
  //     scrollToEnd(messageRef);
  //   }
  // }, [message.ai, scrollToEnd]);

  return (
    <div className="space-y-4">
      {message.is_from_user && (
        <div className="flex justify-end">
          <div className="max-w-[80%] bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl rounded-br-md shadow-lg">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        </div>
      )}
      {!message.is_from_user && (
        <div className="flex justify-start">
          <div className="flex flex-col sm:flex-row gap-3 max-w-full sm:max-w-[80%]">
            <Avatar className="h-8 w-8 border-2 border-blue-200">
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                AI
              </AvatarFallback>
            </Avatar>
            <div ref={messageRef as React.RefObject<HTMLDivElement>} className="p-4 rounded-2xl rounded-bl-md">
              <MarkdownTypewriter
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                // motionProps={{
                // onCharacterAnimationComplete: scrollToEnd,
                // }}
                motionProps={{
                  onAnimationComplete: () => {
                    console.log("Typewriter finished");
                  },
                  characterVariants: {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { opacity: { duration: 0.2 } } },
                  },
                }}
                delay={0}
              >
                {message.content}
              </MarkdownTypewriter>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

MessageItem.displayName = "MessageItem";

export default MessageItem;