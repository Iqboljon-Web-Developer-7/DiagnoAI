// @ts-nocheck
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, MessageSquare, Trash, Paperclip, Send, Stethoscope, ImageIcon, FileText, X, MapPin, User } from "lucide-react";
import dynamic from "next/dynamic";
import Doctors from "./componnets/Doctors";
import { createChat, getChats, getDoctors, handleDeleteChat, updateChat } from "./actions/actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

type ChatMessage = { id: number; content: string; is_from_user: boolean; created_at: string };
type Chat = { id: string; created_at: string; updated_at?: string; messages?: ChatMessage[] };
type Doctor = { id: number; name: string; specialty?: string; hospital?: { id: number; name: string }; field?: string; description?: string; image?: string; translations?: any };

type DiagnosisClientProps = {
  initialChats: Chat[];
  initialSelectedChat: Chat | null;
  initialDoctors: Doctor[];
  initialSelectedId: string | null;
  token: string | null;
};

export function DiagnosisClient({ initialChats, initialSelectedChat, initialDoctors, initialSelectedId, token }: DiagnosisClientProps) {
  const router = useRouter(); 

  // state
  const [chats, setChats] = useState<Chat[]>(initialChats || []);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(initialSelectedChat || null);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors || []);

  console.log(initialSelectedChat);

  const [chatMessages, setChatMessages] = useState<{ user?: string; ai?: string }[]>(() => {
    if (!initialSelectedChat?.messages) return [];
    return initialSelectedChat.messages.map((m) => (m.is_from_user ? { user: m.content } : { ai: m.content }));
  });

  useEffect(() => {
    if (!initialSelectedChat?.messages) return;
    setChatMessages(initialSelectedChat.messages.map((m) => (m.is_from_user ? { user: m.content } : { ai: m.content })));
  }, [initialSelectedChat])

  console.log(chatMessages);


  const [symptoms, setSymptoms] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log("doctors client", doctors);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // keep doctors-driven sidebar open
  // useEffect(() => {
  //   setIsSidebarOpen(!!doctors?.length);
  // }, [doctors]);

  // scroll
  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages]);

  // Client-side fetching when user clicks a chat - still SSR preloaded but this updates latest
  // const fetchChatById = useCallback(async (id: string) => {
  //   setAnalyzing(true);

  //   try {
  //     const resp = await axios.get<Chat>(`${API_BASE_URL}/chats/${id}`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });
  //     const data = resp.data;
  //     const msgs = data.messages || [];
  //     setChatMessages(msgs.map((m) => (m.is_from_user ? { user: m.content } : { ai: m.content })));
  //     setSelectedChat({ id: data.id, created_at: data.created_at, updated_at: data.updated_at, messages: msgs });



  //     if ((resp as any).data?.doctors?.length) {
  //       doctorIds = res?.data?.doctors
  //       const docIds = (resp as any).data.doctors as number[];
  //       const docs = await Promise.all(docIds.map((d) => axios.get<Doctor>(`${API_BASE_URL}/api/en/doctors/${d}`, {
  //         headers: {
  //           'Authorization': `Bearer ${token}`
  //         }
  //       })));
  //       setDoctors(docs.map((d) => d.data));
  //     }
  //   } catch (err) {
  //     toast.error("Failed to load chat");
  //   } finally {
  //     setAnalyzing(false);
  //   }
  // }, []);

  // delete chat
 

  // new chat
  const handleNewChat = () => {
    setSelectedChat(null);
    setChatMessages([]);
    setDoctors([]);
  };

  // file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const valid = Array.from(e.target.files).filter((file) => {
      const okType = ["image/jpeg", "image/png", "application/pdf"].includes(file.type);
      const okSize = file.size <= 5 * 1024 * 1024;
      if (!okType) toast("Invalid file type");
      if (!okSize) toast("File too large");
      return okType && okSize;
    });
    setFiles((prev) => [...prev, ...valid]);
  }, []);

  const removeFile = (idx: number) => setFiles((f) => f.filter((_, i) => i !== idx));

  let doctorIds;
  console.log(doctorIds);


  // send message (CSR) - required because of geolocation & file upload
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!symptoms.trim() && !files.length) return toast("Nothing to send");
    setAnalyzing(true);

    const form = new FormData();
    try {
      const geo = await new Promise<{ latitude: number; longitude: number }>((res) =>
        navigator.geolocation.getCurrentPosition(
          (pos) => res({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
          () => res({ latitude: 0, longitude: 0 }),
        ),
      );
      form.append("latitude", String(geo.latitude));
      form.append("longitude", String(geo.longitude));
      if (symptoms) form.append("message", symptoms);
      files.forEach((f) => form.append("file", f));

      // @ts-ignore
      let resp;
      if (!selectedChat) {
        resp = await createChat(form)
        // await axios.post<Partial<Chat & { message?: string; doctors?: number[] }>>(`${API_BASE_URL}/chats/`, form, {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //     "Authorization": `Bearer ${token}`
        //   },
        // });
        // setSelectedChat(resp.data as Chat)
      } else {
        const chatId = selectedChat.id;
        resp = await updateChat(chatId, form);
      }

      // messages handling
      if (Array.isArray((resp as any)?.messages)) {
        const msgs = (resp as any)?.messages as ChatMessage[];
        setChatMessages(msgs.map((m) => (m.is_from_user ? { user: m.content } : { ai: m.content })));
      } else {
        setChatMessages((prev) => [...prev, { user: symptoms }, { ai: (resp as any)?.message || "" }]);
      }

      // doctors
      if ((resp as any)?.doctors?.length) {
        const docIds = (resp as any)?.doctors as number[];
        doctorIds = (resp as any)?.doctors as number[];
        router.push(`/diagnosis?chatId=${initialSelectedId}?doctorIds=${doctorIds.join(',')}`);

        const docs = await getDoctors(docIds);

        // Promise.all(docIds.map((d) => axios.get(`${API_BASE_URL}/api/en/doctors/${d}`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // })));
        setDoctors(docs.map((d) => (d as any).data));
      }

      // clear
      setSymptoms("");
      setFiles([]);

      const updated = await getChats();
      setChats(updated);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    } finally {
      setAnalyzing(false);
    }
  };

  // render
  return (
    <div className="z-50 mt-20">
      <SidebarProvider defaultOpen={false} className="bg-transparent">
        <div className="flex flex-col gap-4 max-w-7xl mx-auto p-4">
          <div className="w-80">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Sessions</h3>
                  <Button size="sm" onClick={handleNewChat}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <SidebarMenu>
                  {chats.map((c, i) => (
                    <SidebarMenuItem key={c.id}>
                      <SidebarMenuButton onClick={() => { router.push(`/diagnosis?chatId=${c.id}`) }}>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-50 rounded">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm">Session {i + 1}</div>
                            <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
                          </div>
                          <div onClick={(e) => { e.stopPropagation(); handleDeleteChat(c.id!); }}>
                            <Trash className="h-4 w-4 text-red-500" />
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <Card className="min-h-[40vh]">
              <CardContent>
                <div ref={chatContainerRef} className="space-y-4 max-h-[60vh] overflow-auto p-4">
                  {chatMessages.length === 0 && !analyzing ? (
                    <div className="text-center p-8">
                      <div className="mb-4"><Stethoscope className="h-12 w-12 text-blue-600" /></div>
                      <h3 className="font-semibold">Start a consultation</h3>
                    </div>
                  ) : (
                    chatMessages.map((m, idx) => (
                      <div key={idx}>
                        {m.user && (
                          <div className="flex justify-end">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl max-w-[80%]">{m.user}</div>
                          </div>
                        )}
                        {m.ai && (
                          <div className="flex gap-2">
                            <Avatar className="h-8 w-8"><AvatarFallback>AI</AvatarFallback></Avatar>
                            <div className="bg-gray-50 p-3 rounded-2xl">
                              {/* Use dynamic markdown import */}
                              <ReactMarkdown>{m.ai}</ReactMarkdown>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {analyzing && (
                    <div className="flex gap-2 items-center">
                      <Loader2 className="h-4 w-4 animate-spin" /> <span>Analyzing...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="mt-4">
                  <div className="relative">
                    <Textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Describe your symptoms..." rows={1} onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = `${t.scrollHeight}px`; }} />

                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                      <input id="file-upload" type="file" className="hidden" multiple accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileUpload} />
                      <label htmlFor="file-upload" className="cursor-pointer"><Paperclip className="h-4 w-4" /></label>
                      <Button type="submit" disabled={analyzing || (!symptoms.trim() && !files.length)}>
                        {analyzing ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 rounded">
                              {f.type.startsWith("image/") ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                            </div>
                            <div>
                              <div className="text-sm">{f.name}</div>
                              <div className="text-xs text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(i)}><X className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* <Doctors doctorIds={doctorIds} token={token} /> */}
        </div>
      </SidebarProvider>
    </div>
  );
}
