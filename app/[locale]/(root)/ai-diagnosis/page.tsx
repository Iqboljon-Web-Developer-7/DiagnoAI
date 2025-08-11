"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef, type FormEvent } from "react"
import axios, { type AxiosResponse } from "axios"
import {
  X,
  Trash,
  Upload,
  Brain,
  FileText,
  ImageIcon,
  Loader2,
  Plus,
  MessageSquare,
  Stethoscope,
  MapPin,
  User,
  Sparkles,
  Send,
  Paperclip,
} from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAppStore } from "@/context/store"
import { useTranslations, useMessages } from "next-intl"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "@/i18n/navigation"

interface Chat {
  id: string
  created_at: string
  updated_at?: string
  messages?: { id: number; content: string; is_from_user: boolean; created_at: string }[]
}

interface ChatMessage {
  user?: string
  ai?: string
}

interface Doctor {
  id: number
  name: string
  specialty: string
  hospital: string
  field: string
  description: string
}

interface ChatApiResponse {
  id: string
  created_at: string
  updated_at?: string
  messages?: { id: number; content: string; is_from_user: boolean; created_at: string }[]
  message?: string
  doctors?: number[]
}

export default function AIDiagnosisPage() {
  const t = useTranslations("aiDiagnosis")
  const messagesIntl = useMessages()
  const { isLoggedIn, user } = useAppStore()
  const router = useRouter()
  const { toast: toastUI } = useToast()
  const user_id = user?.id
  const API_BASE_URL = "https://api.diagnoai.uz/api"

  // State management
  const [chats, setChats] = useState<Chat[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [symptoms, setSymptoms] = useState("")
  const [progress, setProgress] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch all chats on mount
  useEffect(() => {
    if (!isLoggedIn) return
    const fetchChats = async () => {
      try {
        const resp = await axios.get<Chat[]>(`${API_BASE_URL}/chats`, {
          params: { user_id },
        })
        setChats(resp.data)
      } catch (err) {
        toastUI({ title: t("failedToLoadChats") })
      }
    }
    fetchChats()
  }, [isLoggedIn, user_id, t, toastUI])

  // Fetch specific chat
  const fetchChatById = async (id: string) => {
    setAnalyzing(true)
    try {
      const resp = await axios.get<ChatApiResponse>(`${API_BASE_URL}/chats/${id}`)
      const msgs = resp.data.messages || []
      setChatMessages(msgs.map((m) => (m.is_from_user ? { user: m.content } : { ai: m.content })))
      setSelectedChat({
        id,
        created_at: resp.data.created_at,
        updated_at: resp.data.updated_at,
        messages: msgs,
      })

      if (resp.data.doctors?.length) {
        const docResp = await axios.post<Doctor[]>(`${API_BASE_URL}/doctors`, {
          ids: resp.data.doctors,
        })
        setDoctors(docResp.data)
      }
    } catch {
      toastUI({ title: t("failedToLoadChat") })
    } finally {
      setAnalyzing(false)
    }
  }

  const handleNewChat = () => {
    setSelectedChat(null)
    setChatMessages([])
    setDoctors([])
  }

  const handleDeleteChat = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/chats/${id}/`)
      setChats(chats.filter((c) => c.id !== id))
      if (selectedChat?.id === id) handleNewChat()
      toast.success(t("deleteSuccess") ?? "Chat deleted")
    } catch {
      toast.error(t("deleteFail") ?? "Failed to delete")
    }
  }

  // Auto-scroll logic
  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return
    let timeout: NodeJS.Timeout
    const onScroll = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = container
        setIsUserScrolling(scrollTop + clientHeight < scrollHeight - 50)
      }, 100)
    }
    container.addEventListener("scroll", onScroll)
    return () => {
      container.removeEventListener("scroll", onScroll)
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [chatMessages, isUserScrolling])

  const getGeolocation = () =>
    new Promise<{ latitude: number; longitude: number }>((res) =>
      navigator.geolocation.getCurrentPosition(
        (pos) => res({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => res({ latitude: 0, longitude: 0 }),
      ),
    )

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return
      const valid = Array.from(e.target.files).filter((file) => {
        const okType = ["image/jpeg", "image/png", "application/pdf"].includes(file.type)
        const okSize = file.size <= 5 * 1024 * 1024
        if (!okType) toastUI({ title: t("invalidFileType") })
        if (!okSize) toastUI({ title: t("fileTooLarge") })
        return okType && okSize
      })
      setFiles((prev) => [...prev, ...valid])
    },
    [t, toastUI],
  )

  const removeFile = (idx: number) => setFiles((f) => f.filter((_, i) => i !== idx))

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn) {
      toastUI({ title: t("notLoggedIn") })
      router.push("/login")
      return
    }
    if (!symptoms.trim() && !files.length) {
      toastUI({ title: t("noInputProvided") })
      return
    }

    setAnalyzing(true)
    setProgress(0)
    const form = new FormData()
    form.append("user_id", user_id!)
    const { latitude, longitude } = await getGeolocation()
    form.append("latitude", latitude.toString())
    form.append("longitude", longitude.toString())
    if (symptoms) form.append("message", symptoms)
    files.forEach((f) => form.append("file", f))

    try {
      let resp: AxiosResponse<ChatApiResponse>
      if (!selectedChat) {
        resp = await axios.post(`${API_BASE_URL}/chats/`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / (e.total || 1))),
        })
        setSelectedChat(resp.data)
      } else {
        let chatId = selectedChat.id
        if (!chatId) {
          chatId = chats[chats.length - 1].id
        }
        resp = await axios.patch(`${API_BASE_URL}/chats/${chatId}/`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / (e.total || 1))),
        })
      }

      if (Array.isArray(resp.data.messages)) {
        setChatMessages(resp.data.messages.map((m) => (m.is_from_user ? { user: m.content } : { ai: m.content })))
      } else {
        setChatMessages((prev) => [...prev, { user: symptoms }, { ai: resp.data.message || "" }])
      }

      if (resp.data.doctors?.length) {
        const docs = await Promise.all(
          resp.data.doctors.map((id) => axios.get<Doctor>(`${API_BASE_URL}/doctors/${id}`)),
        )
        setDoctors(docs.map((d) => d.data))
      }

      setSymptoms("")
      setFiles([])

      const updated = await axios.get<Chat[]>(`${API_BASE_URL}/chats`, {
        params: { user_id },
      })
      setChats(updated.data)
    } catch {
      toastUI({ title: t("failedToSendMessage") })
    } finally {
      setAnalyzing(false)
      setProgress(100)
    }
  }

  useEffect(() => {
    let header = document.querySelector("header")
    if (header && header.style) {
      header.style.display = "none"
    }
    return () => {
      if (header && header.style) {
        header.style.display = "flex"
      }
    }
  }, [])

  return (
    <div className="min-h-screen z-50 bg-neutral-200">
      <ToastContainer position="top-right" autoClose={3000} />

      <SidebarProvider defaultOpen={false}>
        <Sidebar hidden={true} className="border-r-0 shadow-lg bg-white/80 backdrop-blur-sm z-50">
          <SidebarHeader className="relative border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <Link href={'/'} className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">DiagnoAI</h2>
                <p className="text-blue-100 text-sm">Medical Assistant</p>
              </div>
            </Link>
            <SidebarTrigger className="absolute bottom-0 -translate-y-full -translate-x-full bg-neutral-200 z-10 -right-10 text-black" />
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Conversations
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <Button
                  onClick={handleNewChat}
                  className="w-full mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Consultation
                </Button>

                <SidebarMenu>
                  {chats.map((chat, i) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        onClick={() => fetchChatById(chat.id)}
                        className="group relative p-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">Session {i + 1}</p>
                            <p className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleDateString()}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteChat(chat.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <main className="flex-1 p-6">
                <SidebarTrigger className="absolute bg-neutral-200 z-10" />
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div className="lg:col-span-2 space-y-6 relative">
                <Card className="shadow-xl border-0 bg-[#edf8f4] backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="h-[500px] overflow-y-auto p-6 space-y-4" ref={chatContainerRef}>
                      {chatMessages.length > 0 ? (
                        chatMessages.map((msg, idx) => (
                          <div key={idx} className="space-y-4">
                            {msg.user && (
                              <div className="flex justify-end">
                                <div className="max-w-[80%] bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl rounded-br-md shadow-lg">
                                  <p className="text-sm leading-relaxed">{msg.user}</p>
                                </div>
                              </div>
                            )}
                            {msg.ai && (
                              <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[80%]">
                                  <Avatar className="h-8 w-8 border-2 border-blue-200">
                                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                                      AI
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="bg-gray-50 p-4 rounded-2xl rounded-bl-md shadow-md">
                                    <ReactMarkdown  >
                                      {msg.ai}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : !analyzing ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
                            <Stethoscope className="h-12 w-12 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to DiagnoAI</h3>
                          <p className="text-gray-600 max-w-md">
                            Describe your symptoms or upload medical documents to get started with your AI-powered
                            medical consultation.
                          </p>
                        </div>
                      ) : null}

                      {analyzing && (
                        <div className="flex justify-start">
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8 border-2 border-blue-200">
                              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                                AI
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-gray-50 p-4 rounded-2xl rounded-bl-md shadow-md">
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                <span className="text-sm text-gray-600">Analyzing your symptoms...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </CardContent>
                </Card>

                {/* Input Area */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <form onSubmit={handleSendMessage} className="space-y-4">
                      <div className="relative">
                        <Textarea
                          placeholder="Describe your symptoms in detail..."
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          className="min-h-[120px] pr-12 border-2 border-gray-200 focus:border-blue-400 rounded-xl resize-none"
                        />
                        <div className="rounded-xl text-center transition-colors absolute bottom-3 right-3">
                          <input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Paperclip className="h-4 w-4" />
                          </label>
                        </div>
                      </div>



                      {files.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Uploaded Files</h4>
                          {files.map((file, i) => (
                            <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  {file.type.startsWith("image/") ? (
                                    <ImageIcon className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-blue-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{file.name}</p>
                                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(i)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={analyzing || (!symptoms.trim() && !files.length)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg h-12"
                      >
                        {analyzing ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Get AI Diagnosis
                          </>
                        )}
                      </Button>

                      {analyzing && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Analysis Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Doctors Sidebar */}
              <div className="space-y-6">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        <Stethoscope className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Recommended Specialists</CardTitle>
                        <CardDescription>Based on your symptoms</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {doctors.length > 0 ? (
                      <div className="space-y-4">
                        {doctors.map((doc) => (
                          <div
                            key={doc.id}
                            className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-12 w-12 border-2 border-green-200">
                                <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                  {doc.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                                <Badge variant="secondary" className="mb-2 bg-green-100 text-green-800">
                                  {doc.field}
                                </Badge>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{doc.description}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <MapPin className="h-3 w-3" />
                                  <span>{doc.hospital}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">Complete your diagnosis to see recommended specialists</p>
                      </div>
                    )}

                    <Link href="/recommended-providers" passHref>
                      <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                        View All Specialists
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
