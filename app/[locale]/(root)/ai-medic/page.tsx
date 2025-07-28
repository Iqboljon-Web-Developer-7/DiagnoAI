"use client";

import axios from "axios";
import { Trash, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './styles.css'

interface User {
  id: string;
}

interface Chat {
  id: string;
  created_at: string;
  updated_at?: string;
  messages?: { id: number; content: string; is_from_user: boolean; created_at: string }[];
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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const mockUser: User = { id: "user123" }; // Simulated user_id
  const API_BASE_URL = "https://api.diagnoai.uz/api";

  // Fetch all chats for the user
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get<Chat[]>(`${API_BASE_URL}/chats`, {
          params: { user_id: mockUser.id },
        });
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
        toast.error("Failed to load chats. Please try again.");
      }
    };
    fetchChats();
  }, [mockUser.id]);

  // Scroll to the latest message when chatMessages update
  useEffect(() => {
    const chatContainer = document.querySelector(".animate-fade-in-down");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatMessages]);

  // Fetch specific chat by ID
  const fetchChatById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get<Chat>(`${API_BASE_URL}/chats/${id}`);
      setSelectedChat(response.data);
      setChatMessages(
        response.data.messages?.map((msg) => ({
          user: msg.is_from_user ? msg.content : undefined,
          ai: !msg.is_from_user ? msg.content : undefined,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching chat:", error);
      toast.error("Failed to load chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(selectedChat);


  // Get geolocation with fallback to mock coordinates
  const getGeolocation = () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      console.log(reject);

      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
        (error) => {
          console.error("Geolocation error:", error);
          resolve({ latitude: 0, longitude: 0 }); // Fallback to mock coordinates
        }
      );
    });
  };

  // Handle sending a new message or file
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!message && !file) {
      toast.error("Please enter a message or select a file.");
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }
    if (file && !["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      toast.error("Only JPEG, PNG, or PDF files are allowed.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("user_id", mockUser.id);
    try {
      const { latitude, longitude } = await getGeolocation();
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
    } catch (error) {
      console.log(error);
      
      formData.append("latitude", "0");
      formData.append("longitude", "0");
    }
    if (message) formData.append("message", message);
    if (file) formData.append("file", file);

    try {
      let response;
      if (!selectedChat) {
        response = await axios.post(`${API_BASE_URL}/chats/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        let chatId = selectedChat.id
        if (!chatId) {
          chatId = chats[chats.length - 1].id
        }
        console.log(chatId);

        response = await axios.patch(`${API_BASE_URL}/chats/${chatId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      console.log(response);

      if (!selectedChat) {
        setSelectedChat({
          id: "",
          created_at: "",
          messages: [
            {
              id: 1,
              content: message,
              is_from_user: true,
              created_at: new Date().toISOString(),
            },
            {
              id: 2,
              content: response.data.message,
              is_from_user: false,
              created_at: new Date().toISOString(),
            },
          ],
        });
      }

      setChatMessages(
        response.data.messages?.map((msg: { id: number; content: string; is_from_user: boolean; created_at: string }) => ({
          user: msg.is_from_user ? msg.content : undefined,
          ai: !msg.is_from_user ? msg.content : undefined,
        })) || [...chatMessages, { user: message, ai: response?.data?.message }]
      );
      setMessage("");
      setFile(null);
      // Refresh chat history
      const chatsResponse = await axios.get<Chat[]>(`${API_BASE_URL}/chats`, {
        params: { user_id: mockUser.id },
      });
      setChats(chatsResponse.data);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
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
      toast.success("Chat deleted successfully.");
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col animate-fade-in-down duration-500">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <aside
          className={`
            bg-slate-100 border-r p-4
            w-full max-w-xs
            fixed z-30 top-0 left-0 h-full
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:static lg:translate-x-0 lg:w-1/5 lg:max-w-none lg:block lg:h-auto
            lg:z-auto
            lg:top-auto lg:left-auto
            shadow-lg lg:shadow-none
            max-h-screen
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
              <X size={24} />
            </button>
          </div>
          <ul className="space-y-2 overflow-y-auto h-full">
            {chats.map((chat, index) => (
              <li
                key={chat.id}
                className="py-2 animate-fade-in-down cursor-pointer flex justify-between items-center rounded transition"
                onClick={() => {
                  fetchChatById(chat.id);
                  setSidebarOpen(false);
                }}
              >
                <span className="truncate text-sm">
                  Chat {index + 1} -{" "}
                  {new Date(chat.created_at).toLocaleString("uz-UZ", {
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
                  aria-label={`Delete chat ${index + 1}`}
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
            className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}
        {/* Chat Interface */}
        <main className="flex-1 p-2 sm:p-4 flex flex-col relative md:ml-0 overflow-y-auto">
          <div className="flex-1 rounded-lg overflow-y-auto max-h-[calc(100vh-100px)] h-fit">
            {selectedChat ? (
              <div className="animate-fade-in-down overflow-auto">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="mb-2 sm:mb-4">
                    {msg.user && (
                      <div className="flex justify-end">
                        <div className="bg-gray-300 p-2 rounded-lg max-w-[80vw] sm:max-w-md break-words">
                          <p className="text-sm sm:text-base">{msg.user}</p>
                        </div>
                      </div>
                    )}
                    {msg.ai && (
                      <div className="flex justify-start">
                        <div className="p-2 rounded-lg max-w-[80vw] sm:max-w-md break-words">
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
            {isLoading && (
              <div className="animate-fade-in-down flex flex-col justify-center items-center w-full min-h-8">
                <Circles color="#00BFFF" height={50} width={200} />
              </div>
            )}
          </div>
          {/* Message Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="flex flex-col sm:flex-row gap-2 w-full"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Message input"
            />
            <label className="flex items-center cursor-pointer">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                aria-label="File upload"
              />
              <span className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828M7 17V7a2 2 0 012-2h8" />
                </svg>
              </span>
            </label>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto hover:bg-blue-700 disabled:bg-blue-400"
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