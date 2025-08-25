"use client";

import { useState, useEffect, useRef, useCallback, useDeferredValue } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner"
import { useAppStore } from "@/context/store";
import axios, { AxiosError } from "axios";
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

  // Deferred value for smooth rendering
  const deferredChatMessages = useDeferredValue(chatMessages);

  // Scroll to bottom of chat
  const scrollToEnd = useCallback((ref: { current: HTMLSpanElement | null }) => {
    if (ref.current) {
      console.log(ref?.current?.className);
      
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    // if (messagesEndRef.current) {
    //   messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    // }
  }, [deferredChatMessages]);

  // Fetch chats from API
  const fetchChats = async () => {
    try {
      const response = await axios.get("https://api.diagnoai.uz/chats/", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to load chat history. Please try again later.");
    }
  };

  // Fetch chats on component mount
  useEffect(() => {
    if (user?.id) {
      fetchChats();
    }
  }, [fetchChats, user?.id]);


  // Fetch chat by ID
  const fetchChatById = async (chatId: string) => {
    try {
      const response = await axios.get(`https://api.diagnoai.uz/chats/${chatId}/`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setChatMessages(response.data.messages);
      setDoctors(response.data.doctors || []);
      setCurrentChatId(chatId);
      setTimeout(() => {
        scrollToEnd(messagesEndRef)

      }, 1000);
    } catch (error) {
      console.error("Error fetching chat:", error);
      toast.error("Failed to load chat history");
    }
  };

  // Create a new chat
  const handleNewChat = () => {
    setChatMessages([]);
    setDoctors([]);
    setCurrentChatId(null);
    router.push("/ai-diagnosis");
  };

  // Delete a chat
  const handleDeleteChat = async (chatId: string) => {
    try {
      await axios.delete(`https://api.diagnoai.uz/chats/${chatId}/`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setChats(chats.filter((chat) => chat.id !== chatId));
      if (pathname.includes(chatId)) {
        router.push("/ai-diagnosis");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  // Get geolocation
  const getGeolocation = async () => {
    if (navigator.geolocation) {
      return new Promise<{ latitude: number; longitude: number }>((resolve) => {
        const timeoutId = setTimeout(() => {
          console.warn("Geolocation request timed out");
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
          (error) => {
            clearTimeout(timeoutId);
            console.error("Error getting geolocation:", error);

            // Handle specific geolocation errors
            switch (error.code) {
              case error.PERMISSION_DENIED:
                toast.error("Location access was denied. Using default location instead.");
                break;
              case error.POSITION_UNAVAILABLE:
                toast.error("Your location information is unavailable. Using default location instead.");
                break;
              case error.TIMEOUT:
                toast.error("The location request timed out. Using default location instead.");
                break;
            }

            resolve({ latitude: 0, longitude: 0 });
          },
          { timeout: 5000, enableHighAccuracy: false, maximumAge: 0 }
        );
      });
    }
    return { latitude: 0, longitude: 0 };
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Validate file types
      const invalidFiles = newFiles.filter(
        (file) => !file.type.match(/(image\/jpeg|image\/png|application\/pdf)/)
      );

      if (invalidFiles?.length > 0) {
        toast.error("Only JPG, PNG, and PDF files are allowed");
        return;
      }

      // Validate file sizes (max 5MB)
      const oversizedFiles = newFiles.filter((file) => file.size > 5 * 1024 * 1024);

      if (oversizedFiles?.length > 0) {
        toast.error("Files must be less than 5MB");
        return;
      }

      setFiles([...files, ...newFiles]);
    }
  };

  // Remove a file
  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };
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
    let progressInterval: NodeJS.Timeout | undefined;

    if (!user?.id) {
      toast.error("Please sign in to use the AI diagnosis feature");
      router.push("/sign-in");
      return;
    }

    if (!symptoms.trim() && files?.length === 0) {
      toast.error("Please describe your symptoms or upload relevant medical documents");
      return;
    }

    setAnalyzing(true);
    setProgress(0);

    setTimeout(() => {
      scrollToEnd(messagesEndRef);
    }, 1000);

    try {
      const geolocation = await getGeolocation();
      const formData = new FormData();

      formData.append("message", symptoms);
      formData.append("latitude", geolocation.latitude.toString());
      formData.append("longitude", geolocation.longitude.toString());

      files.forEach((file) => {
        formData.append("files", file);
      });

      // Simulate progress
      progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 1000);

      let response: ChatApiResponse;

      if (!currentChatId) {
        // Create new chat
        response = await axios.post("https://api.diagnoai.uz/chats/", formData, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        // Add new chat to list
        setChats([response.data.chat!, ...chats]);
      } else {
        // Add to existing chat
        response = await axios.patch(`https://api.diagnoai.uz/chats/${currentChatId}/`, formData, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Update messages and doctors
      setChatMessages(response.data.messages!);
      setDoctors(response.data.doctors!);

      // Clear form
      setSymptoms("");
      setFiles([]);

      // Complete progress
      clearInterval(progressInterval);
      setProgress(100);

      // Update URL if new chat
      if (!currentChatId && response.data.chat) {
        router.push(`/ai-diagnosis/${response.data.chat.id}`);
      }
    } catch (error: unknown) {
      console.error("Error sending message:", error);

      if (typeof progressInterval !== 'undefined') {
        clearInterval(progressInterval);
      }

      // Handle different types of errors
      // if (error.response) {
      //   const statusCode = error.response.status;
      //   let errorMessage = "Failed to process your request";

      //   if (statusCode === 401 || statusCode === 403) {
      //     errorMessage = "Authentication error. Please sign in again.";
      //     router.push("/sign-in");
      //   } else if (statusCode === 413) {
      //     errorMessage = "Files are too large. Please reduce file size or number.";
      //   } else if (statusCode >= 500) {
      //     errorMessage = "Server error. Please try again later.";
      //   }

      //   toast.error(errorMessage);
      // } else if (error.request) {
      //   toast.error("Unable to connect to the server. Please check your internet connection.");
      // } else {
      //   toast.error("Failed to process your request. Please try again.");
      // }
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