"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef, type FormEvent, use } from "react"
import axios, { type AxiosResponse } from "axios"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { toast } from "sonner"

import {
  X,
  Trash,
  Brain,
  FileText,
  ImageIcon,
  Loader2,
  Plus,
  MessageSquare,
  Stethoscope,
  MapPin,
  User,
  Send,
  Paperclip,
} from "lucide-react"

import bgWallpaper from "@/assets/images/useful/bg-wallpaper-line.webp"
import { useAppStore } from "@/store/store"



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
  hospital: {
    id: number
    name: string
  }
  field: string
  description: string
  translations?: {
    field: string
    description: string
    hospital: string
  }
  image?: string
}

interface ChatApiResponse {
  id: string
  created_at: string
  updated_at?: string
  messages?: { id: number; content: string; is_from_user: boolean; created_at: string }[]
  message?: string
  doctors?: number[]
}

type PageProps = {
  params: {
    locale: string;
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}
 
export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params) // ✅ unwrap Promise


  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  const t = useTranslations("diagnosis")
  const { isLoggedIn, user } = useAppStore()
  const router = useRouter()
  const user_id = user?.id

  // State management
  const [chats, setChats] = useState<Chat[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [symptoms, setSymptoms] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (doctors?.length) {
      setIsSidebarOpen(true)

    } else {
      setIsSidebarOpen(false)
    }
  }, [doctors])

  // Fetch all chats on mount
  useEffect(() => {
    if (!isLoggedIn) return
    const fetchChats = async () => {
      try {
        const resp = await axios.get<Chat[]>(`${API_BASE_URL}/chats`, {
          headers: {
            Authorization: `Bearer ${user?.token}`
          },
          params: { user_id },
        })
        setChats(resp.data)
      } catch (err) {
        toast(t("failedToLoadChats"))
        console.log(err);
      }
    }
    fetchChats()
  }, [isLoggedIn, user_id, user?.token, t, toast])

  // Fetch specific chat
  const fetchChatById = async (id: string) => {
    setAnalyzing(true)
    try {
      const resp = await axios.get<ChatApiResponse>(`${API_BASE_URL}/chats/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      })
      const msgs = resp.data.messages || []
      setChatMessages(msgs.map((m) => (m.is_from_user ? { user: m.content } : { ai: m.content })))
      setSelectedChat({
        id,
        created_at: resp.data.created_at,
        updated_at: resp.data.updated_at,
        messages: msgs,
      })

      if (resp.data.doctors?.length) {
        const docResp = await axios.post<Doctor[]>(`${API_BASE_URL}/api/${locale}/doctors`, {
          ids: resp.data.doctors,
        })
        setDoctors(docResp.data)
      }
    } catch {
      toast(t("failedToLoadChat"))
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
      await axios.delete(`${API_BASE_URL}/chats/${id}/`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      })
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
        if (!okType) toast(t("invalidFileType"))
        if (!okSize) toast(t("fileTooLarge"))
        return okType && okSize
      })
      setFiles((prev) => [...prev, ...valid])
    },
    [t, toast],
  )

  const removeFile = (idx: number) => setFiles((f) => f.filter((_, i) => i !== idx))

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn) {
      toast(t("notLoggedIn"))
      router.push("/auth/login")
      return
    }
    if (!symptoms.trim() && !files.length) {
      toast(t("noInputProvided"))
      return
    }

    setAnalyzing(true)
    const form = new FormData()
    form.append("id", user_id!)
    const { latitude, longitude } = await getGeolocation()
    form.append("latitude", latitude.toString())
    form.append("longitude", longitude.toString())
    if (symptoms) form.append("message", symptoms)
    files.forEach((f) => form.append("file", f))

    try {
      let resp: AxiosResponse<ChatApiResponse>
      if (!selectedChat) {
        resp = await axios.post(`${API_BASE_URL}/chats/`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`
          },
          // onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / (e.total || 1))),
        })
        setSelectedChat(resp.data)
      } else {
        let chatId = selectedChat.id
        
        if (!chatId) {
          chatId = chats[chats.length - 1]?.id
        }
        resp = await axios.patch(`${API_BASE_URL}/chats/${chatId}/`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`
          },
          // onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / (e.total || 1))),
        })
      }

      if (Array.isArray(resp.data.messages)) {
        setChatMessages(resp.data.messages.map((m) => (m.is_from_user ? { user: m.content } : { ai: m.content })))
      } else {
        setChatMessages((prev) => [...prev, { user: symptoms }, { ai: resp.data.message || "" }])
      }

      if (resp.data.doctors?.length) {
        const docs = await Promise.all(
          resp.data.doctors.map((id) => axios.get<Doctor>(`${API_BASE_URL}/api/${locale}/doctors/${id}`)),
        )
        setDoctors(docs.map((d) => d.data))
      }

      setSymptoms("")
      setFiles([])

      const updated = await axios.get<Chat[]>(`${API_BASE_URL}/chats`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        },
        params: { user_id },
      })
      setChats(updated.data)
    } catch(err) {
      console.log(err);
      
      toast(t("failedToSendMessage"))
    } finally {
      setAnalyzing(false)
      // setProgress(100)
    }
  }

  useEffect(() => {
    const header = document.querySelector("header")
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
    <div className="z-50">
      <SidebarProvider className=" bg-cover  bg-no-repeat bg-center" defaultOpen={false} style={{ backgroundImage: `url(${bgWallpaper.src})` }}>
        <Sidebar side="left" hidden={true} className="border-r-0 shadow-lg   backdrop-blur-sm z-50">
          <SidebarHeader className="relative border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <Link href={'/'} className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">DiagnoAI</h2>
              </div>
            </Link>
            <SidebarTrigger  className="absolute bottom-0 -translate-y-full -translate-x-full bg-neutral-200 z-10 -right-10 text-black" />
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <Button
                  onClick={handleNewChat}
                  className="w-full mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('newConsultation')}
                </Button>

                <SidebarMenu className="gap-3">
                  {chats.map((chat, i) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        onClick={() => fetchChatById(chat.id)}
                        className="group relative p-0 rounded-lg hover:bg-blue-50 py-2 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="p-2 my-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">Session {i + 1}</p>
                            <p className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleDateString()}</p>
                          </div>
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteChat(chat.id)
                            }}
                            className="md:opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-transparent backdrop-blur-md "  >
         {/* <div className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4"> */}
            {/* <Link href={'/'} className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">DiagnoAI</h2>
              </div>
            </Link> */}
            {/* <SidebarTrigger className="bottom-0 -translate-y-full -translate-x-full bg-neutral-200 z-10 -right-10 text-black" /> */}
          {/* </div> */}
          <SidebarTrigger iconType="ai-diagnosis" className=" absolute top-4 left-4 z-10   duration-200 scale-125" />
          <main className="flex-1 p-2 md:p-4 max-h-[100svh]  ">
            <div className="gap-8 max-w-7xl mx-auto h-full">
              <div className="flex flex-col relative h-full max-h-[96svh] overflow-auto">
                <Card className={`min-h-[40svh] max-h-[96svh] overflow-auto flex-grow shadow-none border-0 bg-transparent ${!chatMessages.length && 'flex items-center justify-center'}`}>
                  <CardContent className="p-0">
                    <div className={`overflow-y-auto p-6 space-y-4 ${chatMessages.length === 0 ? "flex items-center justify-center" : ""}`} ref={chatContainerRef}>
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
                                <div className="flex flex-col sm:flex-row gap-3 max-w-full sm:max-w-[80%]">
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
                        <div className="flex flex-col items-center justify-center text-center animate-fade-in-down duration-200 opacity-0 delay-300">
                          <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
                            <Stethoscope className="h-12 w-12 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("title")}</h3>
                          <p className="text-gray-600 max-w-md">
                           {t("description")}
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

                <Card className="bg-transparent border-none shadow-none animate-fade-in-down duration-200 opacity-0 delay-500">
                  <CardContent className="p-2">
                    <form onSubmit={handleSendMessage} className="space-y-4">
                      <div className="relative">
                        <Textarea
                          placeholder={t('symptomPlaceholder')}
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          className="min-h-8 text-sm md:text-lg max-h-40 w-full pr-12 border-2 border-gray-200 focus:border-blue-400 rounded-2xl border-none focus-visible:ring-0"
                          rows={1}
                          style={{
                            height: 'auto',
                            overflow: 'auto'
                          }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                          }}
                        />
                        <div className="rounded-xl text-center transition-colors absolute bottom-2 lg:bottom-3 right-11">
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
                        <div className="rounded-xl text-center transition-colors absolute -bottom-1 lg:bottom-0 right-1">
                          <Button
                            size={"icon"}
                            type="submit"
                            title={analyzing ? "Analyzing..." : (!symptoms.trim() && !files.length) ? "Type something please..." : "Send"}
                            disabled={analyzing || (!symptoms.trim() && !files.length)}
                            className="text-blackshadow-lg rounded-full bg-transparent hover:bg-transparent hover:text-blue-500 hover:scale-105 duration-200"
                          >
                            {analyzing ? (
                              <>
                                <Loader2 className="animate-spin  h-4 w-4" />
                              </>
                            ) : (
                              <>
                                <Send size={1} />
                              </>
                            )}
                          </Button>

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
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
      <SidebarProvider className="min-h-0 bg-transparent" defaultOpen={false} open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <div className={`absolute top-5 right-5 ${doctors?.length && 'animate-pulse'}`}>
          <SidebarTrigger iconType="doctors" className="bg-purple-100 hover:bg-purple-200 hover:text-blue-600 duration-200 z-10 text-blue-500 scale-125" />
          {doctors?.length ?
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full absolute -top-1 -right-1"></span>
            : ''
          }
        </div>
        <Sidebar side="right" className="!bg-transparent backdrop-blur-lg" style={{ backgroundColor: 'transparent' }}>
          <SidebarInset className="relative bg-transparent" style={{ backgroundColor: 'transparent' }}>
            <div className="space-y-6">
              <Card className="h-[100svh] shadow-xl border-0  bg-transparent">
                <CardHeader className="p-4 relative">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="leading-7">Recommended Specialists</CardTitle>
                    </div>
                  </div>
                  <SidebarTrigger className="absolute top-16 -translate-y-full -translate-x-full bg-neutral-200 z-10 left-4 text-black" />

                </CardHeader>
                <CardContent className="h-full">
                  {doctors?.length > 0 ? (
                    <div className="space-y-4">
                      {doctors?.map((doc) => (
                        <div
                          onClick={() => router.push(`/doctors/${doc?.id}`)}
                          key={doc?.id}
                          className="cursor-pointer p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-12 w-12 border-2 border-green-200">
                              {doc?.image ? (
                                <img src={`${process.env.NEXT_PUBLIC_API_URL}${doc.image}`} alt={doc.name} className="object-cover" />
                              ) : (
                                <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                  {doc?.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900">{doc?.name}</h4>
                              <Badge variant="secondary" className="mb-2 bg-green-100 text-green-800">
                                {doc?.translations?.field}
                              </Badge>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{doc?.translations?.description}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span>{doc?.hospital?.name}</span>
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

                  <Link href="/doctors" passHref>
                    <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                      View All Specialists
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

          </SidebarInset>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}