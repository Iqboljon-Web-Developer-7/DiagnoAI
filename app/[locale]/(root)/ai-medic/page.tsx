// @ts-nocheck

"use client"

import axios from "axios";
import { FormEvent, useEffect, useState } from "react";

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
    }, []);

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
        const formData = new FormData();
        formData.append("user_id", mockUser.id);
        formData.append("latitude", "0"); // Replace with actual geolocation
        formData.append("longitude", "0"); // Replace with actual geolocation
        if (message) formData.append("message", message);
        if (file) formData.append("file", file);

        try {
            await axios.post(API_BASE_URL + "/chats/", formData, {       
                headers: { "Content-Type": "multipart/form-data" },
            });
            setChatMessages([...chatMessages, { user: message, ai: "AI response placeholder" }]);
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
            await axios.delete(`${API_BASE_URL}/chats/${id}`);
            setChats(chats.filter((chat) => chat.id !== id));
            if (selectedChat?.id === id) {
                setSelectedChat(null);
                setChatMessages([]);
            }
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">MediGrok</h1>
                <div>
                    <span className="mr-4">Welcome, {mockUser.id}</span>
                    <button className="bg-blue-800 px-4 py-2 rounded">Logout</button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar: Chat History */}
                <aside className="w-1/4 bg-white p-4 border-r hidden md:block">
                    <h2 className="text-lg font-semibold mb-4">Chat History</h2>
                    <ul>
                        {chats.map((chat) => (
                            <li
                                key={chat.id}
                                className="p-2 hover:bg-blue-100 cursor-pointer flex justify-between items-center"
                                onClick={() => fetchChatById(chat.id)}
                            >
                                <span>Chat {chat.id} - {new Date(chat.created_at).toLocaleString()}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteChat(chat.id);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Chat Interface */}
                <main className="flex-1 p-4 flex flex-col">
                    <div className="flex-1 bg-white rounded-lg shadow p-4 overflow-y-auto">
                        {isLoading && <p className="text-center text-gray-500">Loading...</p>}
                        {selectedChat ? (
                            <>
                                <h2 className="text-lg font-semibold mb-4">Chat {selectedChat.id}</h2>
                                {chatMessages.map((msg, index) => (
                                    <div key={index} className="mb-4">
                                        {msg.user && (
                                            <div className="flex justify-end">
                                                <div className="bg-blue-100 p-2 rounded-lg max-w-md">
                                                    <p>{msg.user}</p>
                                                </div>
                                            </div>
                                        )}
                                        {msg.ai && (
                                            <div className="flex justify-start">
                                                <div className="bg-gray-200 p-2 rounded-lg max-w-md">
                                                    <p>{msg.ai}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p className="text-center text-gray-500">Select a chat or start a new one</p>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 p-2 border rounded-lg"
                            aria-label="Message input"
                        />
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="p-2 border rounded-lg"
                            aria-label="File upload"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                            disabled={isLoading}
                        >
                            Send
                        </button>
                    </form>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>
                    MediGrok is not a substitute for professional medical advice. Consult a healthcare professional for serious concerns.
                </p>
                <p>
                    <a href="/contact" className="underline">Contact Support</a> |{' '}
                    <a href="/privacy" className="underline">Privacy Policy</a>
                </p>
            </footer>
        </div>
    );
}