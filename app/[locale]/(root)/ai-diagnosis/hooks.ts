"use client";

import { useState, useEffect, useRef, useCallback, useDeferredValue } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner"
import { useAppStore } from "@/Store/store";
import axios from "axios";
import { Chat, ChatMessage, Doctor, ChatApiResponse } from "./types";
import { usePathname } from "@/i18n/navigation";
/**
 * Custom hook for managing chat functionality in the AI Diagnosis feature.
 * 
 * This hook handles:
 * - Chat history management (fetch, create, delete)
 * - Message sending and receiving
 * - File upload handling
 * - Geolocation services
 * - UI state management (loading, progress)
 * 
 * @returns An object containing all chat-related state and functions
 */
export const useChat = () => {
  const pathname = usePathname()
  const { user } = useAppStore();
  const router = useRouter();

  // State management
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [symptoms, setSymptoms] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Refs for scrolling
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>(null);

  // Deferred value for smooth rendering
  const deferredChatMessages = useDeferredValue(chatMessages);

  // Scroll to bottom of chat
  const scrollToEnd = useCallback((ref: { current: HTMLSpanElement | null }) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Fetch chats from API
  const fetchChats = useCallback(async () => {
    if (!user?.token) return;
    
    try {
      const response = await axios.get("https://api.diagnoai.uz/chats/", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to load chat history. Please try again later.");
    }
  }, [user?.token]);

  // Fetch chats on component mount
  useEffect(() => {
    if (user?.id) {
      fetchChats();
    }
  }, [user?.id, fetchChats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Fetch chat by ID
  const fetchChatById = async (chatId: string) => {
    if (!user?.token) return;

    try {
      const response = await axios.get(`https://api.diagnoai.uz/chats/${chatId}/`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setChatMessages(response.data.messages);
      setDoctors(response.data.doctors || []);
      setCurrentChatId(chatId);
      
      // Use RAF for smoother scrolling
      requestAnimationFrame(() => {
        scrollToEnd(messagesEndRef);
      });
    } catch (error) {
      console.error("Error fetching chat:", error);
      toast.error("Failed to load chat history");
    }
  };

  // Create a new chat
  const handleNewChat = useCallback(() => {
    setChatMessages([]);
    setDoctors([]);
    setCurrentChatId(null);
    router.push("/ai-diagnosis");
  }, [router]);

  // Delete a chat
  const handleDeleteChat = async (chatId: string) => {
    if (!user?.token) return;

    try {
      await axios.delete(`https://api.diagnoai.uz/chats/${chatId}/`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
      if (pathname.includes(chatId)) {
        router.push("/ai-diagnosis");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  // Get geolocation with timeout
  const getGeolocation = async () => {
    if (!navigator.geolocation) {
      return { latitude: 0, longitude: 0 };
    }

    return new Promise<{ latitude: number; longitude: number }>((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve({ latitude: 0, longitude: 0 });
      }, 5000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          clearTimeout(timeoutId);
          resolve({ latitude: 0, longitude: 0 });
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  };

  // Handle file upload with memoized validation
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files);
    const isValidType = (file: File) => file.type.match(/(image\/jpeg|image\/png|application\/pdf)/);
    const isValidSize = (file: File) => file.size <= 5 * 1024 * 1024;

    const invalidFiles = newFiles.filter(file => !isValidType(file));
    const oversizedFiles = newFiles.filter(file => !isValidSize(file));

    if (invalidFiles.length > 0) {
      toast.error("Only JPG, PNG, and PDF files are allowed");
      return;
    }

    if (oversizedFiles.length > 0) {
      toast.error("Files must be less than 5MB");
      return;
    }

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  // Remove a file
  const removeFile = useCallback((idx: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== idx));
  }, []);

  // Handle overflow based on analyzing state
  useEffect(() => {
    const aiMainContainer = document.querySelector(".ai-main");
    if (aiMainContainer) {
      document.body.style.overflow = analyzing ? "hidden" : "auto";
      aiMainContainer.classList.toggle("overflow-hidden", analyzing);
      aiMainContainer.classList.toggle("overflow-auto", !analyzing);
    }
  }, [analyzing]);

  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Please sign in to use the AI diagnosis feature");
      router.push("/sign-in");
      return;
    }

    if (!symptoms.trim() && (!files || files.length === 0)) {
      toast.error("Please describe your symptoms or upload relevant medical documents");
      return;
    }

    setAnalyzing(true);
    setProgress(0);

    requestAnimationFrame(() => {
      scrollToEnd(messagesEndRef);
    });

    try {
      const geolocation = await getGeolocation();
      const formData = new FormData();

      formData.append("message", symptoms);
      formData.append("latitude", geolocation.latitude.toString());
      formData.append("longitude", geolocation.longitude.toString());
      files.forEach(file => formData.append("files", file));

      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 1000);

      const headers = {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      };

      const response: ChatApiResponse = !currentChatId
        ? await axios.post("https://api.diagnoai.uz/chats/", formData, { headers })
        : await axios.patch(`https://api.diagnoai.uz/chats/${currentChatId}/`, formData, { headers });

      if (!currentChatId) {
        setChats(prevChats => [response.data.chat!, ...prevChats]);
      }

      setChatMessages(response.data.messages!);
      setDoctors(response.data.doctors!);
      setSymptoms("");
      setFiles([]);

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setProgress(100);

      if (!currentChatId && response.data.chat) {
        router.push(`/ai-diagnosis/${response.data.chat.id}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      toast.error("Failed to send message. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return {
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
    fetchChats,
    fetchChatById,
    handleNewChat,
    handleDeleteChat,
    handleFileUpload,
    removeFile,
    handleSendMessage,
    scrollToEnd
  };
};