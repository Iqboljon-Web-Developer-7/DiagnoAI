// @typescript-eslint/ban-ts-comment

"use client"

import { Close } from "@radix-ui/react-toast";
import axios from "axios";
import { ChartNoAxesGantt, Menu, Trash, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";
import ReactMarkdown from 'react-markdown'

interface User {
  id: string;
}

interface Chat {
  id: string;
  created_at: string;
  history?: string;
}

interface ChatMessage {
  user?: string;
  ai?: string;
}

export default function App() {
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log(chatMessages);


  const mockUser: User = { id: "user123" }; // Simulated user_id
  const API_BASE_URL = "https://api.diagnoai.uz/api";

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get<Chat[]>(API_BASE_URL + "/chats", {
          params: { user_id: mockUser.id },
        });
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [mockUser?.id]);

  // Fetch specific chat by ID
  const fetchChatById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get<Chat>(API_BASE_URL + `/chats/${id}`);
      setSelectedChat(response.data);
      setChatMessages(JSON.parse(response.data.history || "[]"));
    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a new message or file
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!message && !file) return;

    setIsLoading(true);

    console.log(selectedChat);


    const formData = new FormData();
    formData.append("user_id", mockUser.id);
    formData.append("latitude", "0"); // Replace with actual geolocation
    formData.append("longitude", "0"); // Replace with actual geolocation
    if (message) formData.append("message", message);
    if (file) formData.append("file", file);

    try {
      let response;

      if (!selectedChat) {
        response = await axios.post(API_BASE_URL + "/chats/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.patch(API_BASE_URL + `/chats/${selectedChat.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setChatMessages([...chatMessages, { user: message, ai: response?.data?.message }]);
      setMessage("");
      setFile(null);
      // Refresh chat history
      const chatsResponse = await axios.get<Chat[]>(API_BASE_URL + "/chats", {
        params: { user_id: mockUser.id },
      });
      setChats(chatsResponse.data);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a chat
  const handleDeleteChat = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/chats/${id}/`);
      setChats(chats.filter((chat) => chat.id !== id));
      if (selectedChat?.id === id) {
        setSelectedChat(null);
        setChatMessages([]);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  // Responsive sidebar toggle for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <div className="lg:hidden flex justify-between items-center bg-white px-4 py-3 border-b">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-blue-600 font-semibold focus:outline-none"
            aria-label="Open chat history"
          >
            {sidebarOpen ? <Close /> : <ChartNoAxesGantt />}
          </button>
        </div>
        <aside
          className={`
                        bg-white border-r p-4
                        w-full max-w-xs
                        fixed z-30 top-0 left-0 h-full
                        transform transition-transform duration-300 ease-in-out
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        lg:static lg:translate-x-0 lg:w-1/5 lg:max-w-none lg:block lg:h-auto
                        lg:z-auto
                        lg:top-auto lg:left-auto
                        shadow-lg lg:shadow-none
                    `}
          style={{ minWidth: 0 }}
        >
          <div className="flex justify-between items-center mb-4 lg:mb-4">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X />
            </button>
          </div>
          <ul className="space-y-2">
            {chats.map((chat, index) => (
              <li
                key={chat.id}
                className="p-2 hover:bg-blue-100 cursor-pointer flex justify-between items-center rounded transition"
                onClick={() => {
                  fetchChatById(chat.id);
                  setSidebarOpen(false);
                  setChatMessages([])
                }}
              >
                <span className="truncate text-sm">
                  Chat {index + 1} - {new Date(chat.created_at).toLocaleString("uz-UZ", {
                    year: "numeric",
                    month: "numeric",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                  className="text-red-500 hover:text-red-700 ml-2"
                  aria-label="Delete chat"
                >
                  <Trash size={18} />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}

        {/* Chat Interface */}
        <main className="flex-1 p-2 sm:p-4 flex flex-col relative md:ml-0 overflow-y-auto">
          <div className="flex-1 bg-white rounded-lg shadow p-2 sm:p-4 overflow-y-auto max-h-[60vh] sm:max-h-none h-fit">
            {selectedChat ? (
              <div className="animate-fade-in-down overflow-auto max-h-[75vh]">
                <p className="text-sm sm:text-base font-semibold mb-2 sm:mb-4 break-all">
                  Chat-id: {selectedChat.id}
                </p>
                <ReactMarkdown>{selectedChat.history}</ReactMarkdown>
                {chatMessages.map((msg, index) => (
                  <div key={index} className="mb-2 sm:mb-4">
                    {msg.user && (
                      <div className="flex justify-end">
                        <div className="bg-blue-100 p-2 rounded-lg max-w-[80vw] sm:max-w-md break-words">
                          <p className="text-sm sm:text-base">{msg.user}</p>
                        </div>
                      </div>
                    )}
                    {msg.ai && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 p-2 rounded-lg max-w-[80vw] sm:max-w-md break-words">
                          <p className="text-sm sm:text-base">{msg.ai}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              !isLoading && (
                <p className="text-center text-gray-500">Select a chat or start a new one</p>
              )
            )}
            {isLoading && <div className="animate-fade-in-down flex flex-col justify-center items-center w-full min-h-8">
              <Circles color="#00BFFF" height={50} width={200} />
            </div>}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="mt-2 sm:mt-4 flex flex-col sm:flex-row gap-2 w-full"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg text-sm sm:text-base"
              aria-label="Message input"
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="p-2 border rounded-lg text-sm sm:text-base"
              aria-label="File upload"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto"
              disabled={isLoading}
            >
              Send
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}