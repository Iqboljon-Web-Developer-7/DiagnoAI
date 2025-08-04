'use client';

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Brain, FileText, ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/context/store";
import { useTranslations, useMessages } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/navigation";
import axios, { AxiosResponse } from "axios";
import ReactMarkdown from "react-markdown";
import { Circles } from "react-loader-spinner";

interface Chat {
  id: string;
  created_at: string;
  updated_at?: string;
  messages?: { id: number; content: string; is_from_user: boolean; created_at: string }[];
}

interface ChatMessage {
  user?: string;
  ai?: string;
  doctors?: number[];
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  field: string;
  description: string
}

interface ChatApiResponse {
  id: string;
  created_at: string;
  updated_at?: string;
  messages?: { id: number; content: string; is_from_user: boolean; created_at: string }[];
  message?: string;
  doctors?: number[];
}

export default function AIDiagnosisPage() {
  const t = useTranslations('aiDiagnosis');
  const messages = useMessages();
  const { isLoggedIn, user } = useAppStore();

  const user_id = user?.id
  // Use dummy user_id for now
  // const isLoggedIn = true;
  // const user_id = "12456";
  const router = useRouter();
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [symptoms, setSymptoms] = useState('');
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = "https://api.diagnoai.uz/api";

  // Fetch the latest chat on mount
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchChats = async () => {
      try {
        const response = await axios.get<Chat[]>(`${API_BASE_URL}/chats`, {
          params: { user_id },
        });
        const latestChat = response.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        if (latestChat) {
          fetchChatById(latestChat.id);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        toast({ title: t("failedToLoadChats") });
      }
    };
    fetchChats();
  }, [isLoggedIn, user_id, t]);

  // Track user scrolling
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      setIsUserScrolling(scrollTop + clientHeight < scrollHeight - 50);
    };

    let timeout: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScroll, 100);
    };

    chatContainer.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      chatContainer.removeEventListener("scroll", debouncedHandleScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isUserScrolling) return;
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatMessages, isUserScrolling]);

  // Fetch specific chat by ID
  const fetchChatById = async (id: string) => {
    setAnalyzing(true);
    try {
      // The response now contains .data.messages (array of message objects)
      const response: AxiosResponse<ChatApiResponse> = await axios.get(`${API_BASE_URL}/chats/${id}`);
      const messagesArr = response?.data?.messages || [];
      const doctorsArr = response?.data?.doctors || [];

      // Map the messages array to ChatMessage[]
      const mappedMessages: ChatMessage[] = messagesArr.map((msg) => {
        if (msg.is_from_user) {
          return { user: msg.content };
        } else {
          return { ai: msg.content };
        }
      });

      setChatMessages(mappedMessages);

      setSelectedChat({
        id,
        created_at: response?.data?.created_at || new Date().toISOString(),
        updated_at: response?.data?.updated_at,
        messages: messagesArr,
      });

      // Fetch doctor details if any
      if (doctorsArr.length > 0) {
        const doctorResponse = await axios.post<Doctor[]>(`${API_BASE_URL}/doctors`, {
          ids: doctorsArr,
        });
        setDoctors(doctorResponse.data);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      toast({ title: t("failedToLoadChat") });
    } finally {
      setAnalyzing(false);
    }
  };

  // Get geolocation
  const getGeolocation = () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
        (error) => {
          console.error("Geolocation error:", error);
          resolve({ latitude: 0, longitude: 0 });
        }
      );
    });
  };

  // Handle file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = Array.from(e.target.files).filter(file => {
        const validTypes = ["image/jpeg", "image/png", "application/pdf"];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (!validTypes.includes(file.type)) {
          toast({ title: t("invalidFileType") });
          return false;
        }
        if (file.size > maxSize) {
          toast({ title: t("fileTooLarge") });
          return false;
        }
        return true;
      });
      setFiles(prev => [...prev, ...validFiles]);
    }
  }, [t]);

  // Remove file
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle sending message or file
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast({ title: t("notLoggedIn") });
      router.push("/login");
      return;
    }
    if (!symptoms.trim() && !files.length) {
      toast({ title: t("noInputProvided") });
      return;
    }

    setAnalyzing(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("user_id", user_id);
    try {
      const { latitude, longitude } = await getGeolocation();
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
    } catch (error) {
      console.log(error);
  
      formData.append("latitude", "0");
      formData.append("longitude", "0");
    }
    if (symptoms) formData.append("message", symptoms);
    files.forEach(file => formData.append("file", file));

    try {
      let response: AxiosResponse<ChatApiResponse>;
      if (!selectedChat) {
        response = await axios.post<ChatApiResponse>(`${API_BASE_URL}/chats/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setProgress(percent);
          },
        });
        setSelectedChat(response.data);
      } else {
        response = await axios.patch<ChatApiResponse>(`${API_BASE_URL}/chats/${selectedChat.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setProgress(percent);
          },
        });
      }

      // If the response contains messages array, map them
      if (response?.data?.messages && Array.isArray(response.data.messages)) {
        const mappedMessages: ChatMessage[] = response.data.messages.map((msg) => {
          if (msg.is_from_user) {
            return { user: msg.content };
          } else {
            return { ai: msg.content };
          }
        });
        setChatMessages(mappedMessages);
      } else {
        // fallback: push the new user/ai message as before
        setChatMessages(prev => [
          ...prev,
          { user: symptoms },
          { ai: response.data.message ?? "", doctors: response.data.doctors },
        ]);
      }

      // Fetch doctor details
      if (response.data.doctors && response.data.doctors.length > 0) {
        const doctorIds = response.data.doctors;
        const doctorPromises = doctorIds.map((id: number | string) =>
          axios.get<Doctor>(`${API_BASE_URL}/doctors/${id}`)
        );
        const doctorResponses = await Promise.all(doctorPromises);
        setDoctors(doctorResponses.map(res => res.data));
      }

      setSymptoms("");
      setFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({ title: t("failedToSendMessage") });
    } finally {
      setAnalyzing(false);
      setProgress(100);
    }
  };

  console.log(chatMessages);
  console.log(selectedChat);
  console.log(doctors);

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 py-5 sm:px-6 lg:px-8 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="sm:text-lg text-gray-600">{t('description')}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Chat Messages */}
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div
                  className="flex-1 rounded-lg overflow-y-auto max-h-[400px] h-fit"
                  ref={chatContainerRef}
                >
                  {chatMessages.length > 0 ? (
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
                                <ReactMarkdown >{msg.ai}</ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    !analyzing && (
                      <p className="text-center text-gray-500">{t("noMessages")}</p>
                    )
                  )}
                  {analyzing && (
                    <div className="flex justify-center items-center">
                      <Circles color="#00BFFF" height={30} width={30} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Input Form */}
            <Card>
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-xl sm:text-2xl">{t("symptomsTitle")}</CardTitle>
                <CardDescription className="text-sm sm:text-base">{t("uploadDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <form onSubmit={handleSendMessage}>
                  <Textarea
                    placeholder={t("symptomsPlaceholder")}
                    value={symptoms}
                    onChange={e => setSymptoms(e.target.value)}
                    className="min-h-32 mb-2"
                    aria-label={t("symptomsPlaceholder")}
                  />
                  <div className="border-2 border-dashed p-2 text-center hover:border-blue-400 transition rounded">
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      aria-label={t("uploadPrompt")}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-3 justify-center">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm sm:text-lg">{t("uploadPrompt")}</span>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium text-gray-700">{t("uploadedFilesLabel")}</h4>
                      {files.map((file, i) => (
                        <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                          <div className="flex items-center gap-2 text-sm">
                            {file.type.startsWith("image/") ? <ImageIcon className="text-blue-600 w-5 h-5" /> : <FileText className="text-green-600 w-5 h-5" />}
                            <span>{file.name}</span>
                            <span className="text-gray-500 text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(i)} className="text-red-600">
                            {t("removeButton")}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={analyzing || (!files.length && !symptoms.trim())}
                    className="w-full bg-[#2B6A73] hover:bg-[#268391] text-white sm:text-lg py-4 sm:py-6 mt-4"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t("analyzingText")}
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />
                        {t("analyzeButton")}
                      </>
                    )}
                  </Button>

                  {analyzing && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{t("analysisProgressLabel")}</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Recommended Doctors */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("recommendedSpecialistTitle")}</CardTitle>
                <CardDescription>{t("specialistDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                {doctors.length > 0 ? (
                  <ul className="space-y-4">
                    {doctors.map(doctor => (
                      <li key={doctor.id} className="border-b pb-2">
                        <p className="font-medium text-gray-900">{doctor.name}</p>
                        <p className="text-sm text-gray-600">Field: {doctor.field}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">Description: {doctor.description}</p>
                        <p className="text-sm text-gray-500">Hospital: {doctor.hospital}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center">{t("noDoctors")}</p>
                )}
                <Link href="/recommended-providers">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 mt-4">
                    {t("viewDoctorsButton")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}