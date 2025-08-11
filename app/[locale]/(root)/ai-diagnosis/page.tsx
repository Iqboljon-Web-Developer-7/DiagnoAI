"use client";

import React, { useState, useCallback, useEffect, useRef, FormEvent } from "react";
import axios, { AxiosResponse } from "axios";
import { Menu, X, Trash, Upload, Brain, FileText, ImageIcon, Loader2 } from "lucide-react";
import { Circles } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

import { useAppStore } from "@/context/store";
import { useTranslations, useMessages } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/navigation";

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

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  field: string;
  description: string;
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
  const t = useTranslations("aiDiagnosis");
  const messagesIntl = useMessages();
  const { isLoggedIn, user } = useAppStore();
  const router = useRouter();
  const { toast: toastUI } = useToast();

  const user_id = user?.id;

  const API_BASE_URL = "https://api.diagnoai.uz/api";

  // Sidebar and chats state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);

  // Diagnosis UI state
  const [files, setFiles] = useState<File[]>([]);
  const [symptoms, setSymptoms] = useState("");
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all chats on mount
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchChats = async () => {
      try {
        const resp = await axios.get<Chat[]>(`${API_BASE_URL}/chats`, {
          params: { user_id },
        });
        setChats(resp.data);
      } catch (err) {
        toastUI({ title: t("failedToLoadChats") });
      }
    };
    fetchChats();
  }, [isLoggedIn, user_id, t, toastUI]);

  // Fetch specific chat
  const fetchChatById = async (id: string) => {
    setAnalyzing(true);
    try {
      const resp = await axios.get<ChatApiResponse>(`${API_BASE_URL}/chats/${id}`);
      const msgs = resp.data.messages || [];
      setChatMessages(
        msgs.map(m => (m.is_from_user ? { user: m.content } : { ai: m.content }))
      );
      setSelectedChat({
        id,
        created_at: resp.data.created_at,
        updated_at: resp.data.updated_at,
        messages: msgs,
      });
      // load doctors if any
      if (resp.data.doctors?.length) {
        const docResp = await axios.post<Doctor[]>(`${API_BASE_URL}/doctors`, {
          ids: resp.data.doctors,
        });
        setDoctors(docResp.data);
      }
    } catch {
      toastUI({ title: t("failedToLoadChat") });
    } finally {
      setAnalyzing(false);
    }
  };

  // New Chat
  const handleNewChat = () => {
    setSelectedChat(null);
    setChatMessages([]);
    setDoctors([]);
  };

  // Delete Chat
  const handleDeleteChat = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/chats/${id}/`);
      setChats(chats.filter(c => c.id !== id));
      if (selectedChat?.id === id) handleNewChat();
      toast.success(t("deleteSuccess") ?? "Chat deleted");
    } catch {
      toast.error(t("deleteFail") ?? "Failed to delete");
    }
  };

  // Track scrolling
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    let timeout: NodeJS.Timeout;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        setIsUserScrolling(scrollTop + clientHeight < scrollHeight - 50);
      }, 100);
    };
    container.addEventListener("scroll", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatMessages, isUserScrolling]);

  // Geolocation helper
  const getGeolocation = () =>
    new Promise<{ latitude: number; longitude: number }>(res =>
      navigator.geolocation.getCurrentPosition(
        pos => res({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => res({ latitude: 0, longitude: 0 })
      )
    );

  // File upload handler
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const valid = Array.from(e.target.files).filter(file => {
        const okType = ["image/jpeg", "image/png", "application/pdf"].includes(file.type);
        const okSize = file.size <= 5 * 1024 * 1024;
        if (!okType) toastUI({ title: t("invalidFileType") });
        if (!okSize) toastUI({ title: t("fileTooLarge") });
        return okType && okSize;
      });
      setFiles(prev => [...prev, ...valid]);
    },
    [t, toastUI]
  );

  const removeFile = (idx: number) => setFiles(f => f.filter((_, i) => i !== idx));

  // Send message
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toastUI({ title: t("notLoggedIn") });
      router.push("/login");
      return;
    }
    if (!symptoms.trim() && !files.length) {
      toastUI({ title: t("noInputProvided") });
      return;
    }

    setAnalyzing(true);
    setProgress(0);
    const form = new FormData();
    form.append("user_id", user_id!);
    const { latitude, longitude } = await getGeolocation();
    form.append("latitude", latitude.toString());
    form.append("longitude", longitude.toString());
    if (symptoms) form.append("message", symptoms);
    files.forEach(f => form.append("file", f));

    try {
      let resp: AxiosResponse<ChatApiResponse>;
      if (!selectedChat) {
        resp = await axios.post(`${API_BASE_URL}/chats/`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: e => setProgress(Math.round((e.loaded * 100) / (e.total || 1))),
        });
        setSelectedChat(resp.data);
      } else {
        let chatId = selectedChat.id
        if (!chatId) {
          chatId = chats[chats.length - 1].id
        }

        resp = await axios.patch(
          `${API_BASE_URL}/chats/${chatId}/`,
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: e => setProgress(Math.round((e.loaded * 100) / (e.total || 1))),
          }
        );
      }

      if (Array.isArray(resp.data.messages)) {
        setChatMessages(
          resp.data.messages.map(m =>
            m.is_from_user ? { user: m.content } : { ai: m.content }
          )
        );
      } else {
        setChatMessages(prev => [
          ...prev,
          { user: symptoms },
          { ai: resp.data.message || "" },
        ]);
      }

      // load any returned doctors
      if (resp.data.doctors?.length) {
        const docs = await Promise.all(
          resp.data.doctors.map(id => axios.get<Doctor>(`${API_BASE_URL}/doctors/${id}`))
        );
        setDoctors(docs.map(d => d.data));
      }

      setSymptoms("");
      setFiles([]);
      // refresh sidebar list
      const updated = await axios.get<Chat[]>(`${API_BASE_URL}/chats`, {
        params: { user_id },
      });
      setChats(updated.data);
    } catch {
      toastUI({ title: t("failedToSendMessage") });
    } finally {
      setAnalyzing(false);
      setProgress(100);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 bg-slate-100 border-r p-4
          w-64 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0 z-50" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:w-1/5
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t("chatHistory")}</h2>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label={t("closeSidebar")}
          >
            <X size={24} />
          </button>
        </div>
        <button
          className="w-full mb-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleNewChat}
        >
          {t("newChat")}
        </button>
        <ul className="overflow-y-auto space-y-2 h-[calc(100vh-152px)]">
          {chats.map((chat, i) => (
            <li
              key={chat.id}
              className="flex justify-between items-center p-2 bg-white rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                fetchChatById(chat.id);
                setSidebarOpen(false);
              }}
            >
              <span className="truncate text-sm">
                {/* {{ number: i + 1)} */}
                {new Date(chat.created_at).toLocaleString("uz-UZ", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteChat(chat.id);
                }}
                className="text-red-500 hover:text-red-700"
                aria-label={t("deleteChatTooltip", { number: i + 1 })}
              >
                <Trash size={16} />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile toggle */}
      <button
        className="fixed top-12 left-4 lg:hidden p-1 bg-white rounded shadow bg-white/50 backdrop-blur"
        onClick={() => setSidebarOpen(true)}
        aria-label={t("openSidebar")}
        
      >
        <Menu size={22} />
      </button>

      {/* Main content */}
      <main className="flex-1 p-4 space-y-6">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-gray-600">{t("description")}</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-4">
                <div
                  className="overflow-y-auto max-h-[400px] space-y-4"
                  ref={chatContainerRef}
                >
                  {chatMessages.length > 0 ? (
                    chatMessages.map((msg, idx) => (
                      <div key={idx}>
                        {msg.user && (
                          <div className="flex justify-end">
                            <div className="bg-gray-300 p-2 rounded max-w-md">
                              <p>{msg.user}</p>
                            </div>
                          </div>
                        )}
                        {msg.ai && (
                          <div className="flex justify-start">
                            <div className="bg-white p-2 rounded max-w-md">
                              <ReactMarkdown>{msg.ai}</ReactMarkdown>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : !analyzing ? (
                    <p className="text-center text-gray-500">{t("noMessages")}</p>
                  ) : null}
                  {analyzing && (
                    <div className="flex justify-center">
                      <Circles height={30} width={30} color="#00BFFF" />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle>{t("symptomsTitle")}</CardTitle>
                <CardDescription>{t("uploadDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <Textarea
                    placeholder={t("symptomsPlaceholder")}
                    value={symptoms}
                    onChange={e => setSymptoms(e.target.value)}
                    className="min-h-[120px]"
                  />

                  <div className="border-2 border-dashed p-4 text-center rounded hover:border-blue-400">
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center gap-2">
                      <Upload />
                      <span>{t("uploadPrompt")}</span>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">{t("uploadedFilesLabel")}</h4>
                      {files.map((file, i) => (
                        <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                          <div className="flex items-center gap-2">
                            {file.type.startsWith("image/") ? <ImageIcon /> : <FileText />}
                            <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(i)}>
                            {t("removeButton")}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={analyzing || (!symptoms.trim() && !files.length)}
                    className="w-full mt-4 flex justify-center items-center"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="animate-spin mr-2" />
                        {t("analyzingText")}
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2" />
                        {t("analyzeButton")}
                      </>
                    )}
                  </Button>

                  {analyzing && (
                    <div>
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

          {/* Doctors column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("recommendedSpecialistTitle")}</CardTitle>
                <CardDescription>{t("specialistDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                {doctors.length > 0 ? (
                  <ul className="space-y-4">
                    {doctors.map(doc => (
                      <li key={doc.id} className="border-b pb-2">
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm">Field: {doc.field}</p>
                        <p className="text-sm line-clamp-2">Description: {doc.description}</p>
                        <p className="text-xs text-gray-500">Hospital: {doc.hospital}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500">{t("noDoctors")}</p>
                )}
                <Link href="/recommended-providers" passHref>
                  <Button size="sm" className="w-full mt-4">
                    {t("viewDoctorsButton")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
