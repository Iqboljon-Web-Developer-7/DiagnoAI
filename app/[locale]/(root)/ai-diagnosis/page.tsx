"use client";

import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useChat } from "./hooks";
import ChatSidebar from "./components/ChatSidebar";
import ChatContainer from "./components/ChatContainer";
import InputForm from "./components/InputForm";
import DoctorRecommendations from "./components/DoctorRecommendations";

export default function AIDiagnosisPage() {
  const {
    chats,
    chatMessages,
    deferredChatMessages,
    files,
    symptoms,
    analyzing,
    progress,
    doctors,
    chatContainerRef,
    messagesEndRef,
    setSymptoms,
    fetchChatById,
    handleNewChat,
    handleDeleteChat,
    handleFileUpload,
    removeFile,
    handleSendMessage,
    scrollToEnd
  } = useChat();

  // Hide/show header based on scroll
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    header.classList.add("hidden");

    return () => {
      header.classList.remove("hidden");
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <SidebarProvider>
        <div className="z-50 fixed inset-0 flex min-h-screen bg-gradient-to-b from-blue-50 to-white w-full">
          <SidebarTrigger className="absolute left-4 top-6  bg-neutral-200  text-black z-50" />
          <ChatSidebar
            chats={chats}
            handleNewChat={handleNewChat}
            handleDeleteChat={handleDeleteChat}
            fetchChatById={fetchChatById}
          />

          <div className="flex-1 p-6 md:p-10 overflow-auto ai-main">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Chat messages */}
                  <ChatContainer
                    chatMessages={chatMessages}
                    deferredChatMessages={deferredChatMessages}
                    analyzing={analyzing}
                    chatContainerRef={chatContainerRef as React.RefObject<HTMLDivElement>}
                    messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
                    scrollToEnd={scrollToEnd}
                  />


                  <InputForm
                    symptoms={symptoms}
                    setSymptoms={setSymptoms}
                    files={files}
                    handleFileUpload={handleFileUpload}
                    removeFile={removeFile}
                    handleSendMessage={handleSendMessage}
                    analyzing={analyzing}
                    progress={progress}
                  />
                </div>

                <div className="lg:col-span-1">
                  <DoctorRecommendations doctors={doctors} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}