"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"

import bgWallpaper from "@/assets/images/useful/bg-wallpaper-line.webp"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    Brain,
    Plus,
    MapPin,
    User,
} from "lucide-react"

import { toast } from "sonner"


import { DiagnosisClientProps } from "./types"
import { deleteChat } from "./actions"
import "react-medium-image-zoom/dist/styles.css";
import SideBarChat from "./components/SideBarChat/SideBarChat"
import { ChatMessages } from "./components/CurrentChat/CurrentChat"
import Form from "./components/Form/Form"



export default function DiagnosisClient({
    initialChats,
    initialSelectedChat,
    initialDoctors,
    initialSelectedId
}: DiagnosisClientProps) {
    const t = useTranslations("diagnosis")

    const router = useRouter()

    const [isSidebarOpen, setIsSidebarOpen] = useState(initialDoctors?.length > 0)
    const [isUserScrolling, setIsUserScrolling] = useState(false)

    const chatContainerRef = useRef<HTMLDivElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const handleNewChat = () => {
        setIsSidebarOpen(false)
        router.push('/ai-diagnosis')
    }

    const handleDeleteChat = async (id: string) => {
        try {
            await deleteChat(id)
            if (initialSelectedChat?.id === id) handleNewChat()
            toast.success(t("deleteSuccess") ?? "Chat deleted")
        } catch {
            toast.error(t("deleteFail") ?? "Failed to delete")
        }
    }

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
    }, [isUserScrolling])


    useEffect(() => {
        if (initialSelectedChat!?.messages!.length > 0 && messagesEndRef.current && !isUserScrolling) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [initialSelectedChat?.messages, isUserScrolling])

    return (
        <div className="z-50">
            <SidebarProvider className=" bg-cover  bg-no-repeat bg-center" defaultOpen={false} style={{ backgroundImage: `url(${bgWallpaper.src})` }}>
                <Sidebar side="left" hidden={true} className="border-r-0 shadow-lg   backdrop-blur-[2px] z-50">
                    <SidebarHeader className="relative border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                        <Link href={'/'} className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Brain className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">DiagnoAI</h2>
                            </div>
                        </Link>
                        <SidebarTrigger className="absolute bottom-0 -translate-y-full -translate-x-full bg-neutral-200 z-10 -right-10 text-black" />
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

                                <SidebarMenu>
                                    <SideBarChat initialChats={initialChats} handleDeleteChat={handleDeleteChat} />
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>

                <SidebarInset className="bg-transparent backdrop-blur-md "  >
                    <SidebarTrigger iconType="ai-diagnosis" className=" absolute top-4 left-4 z-10   duration-200 scale-125" />
                    <main className={`flex-1 p-2 md:p-4 max-h-[100svh]  ${!initialSelectedChat && 'flex items-center justify-center'}`}>
                        <div className={`gap-8 max-w-7xl mx-auto ${initialSelectedChat && 'h-full'}`}>
                            <div className="flex flex-col relative max-h-[96svh] overflow-auto h-full">
                                <Card className={`max-h-[96svh] overflow-auto flex-grow shadow-none border-0 bg-transparent ${!initialSelectedChat!?.messages!.length && 'flex items-center justify-center'}`}>
                                    <CardContent className="p-0 w-full">
                                        <div className={`overflow-y-auto p-6 space-y-4 ${initialSelectedChat!?.messages!.length === 0 ? "flex items-center justify-center" : ""}`} ref={chatContainerRef}>
                                            <ChatMessages initialSelectedChat={initialSelectedChat} t={t} />
                                            <div ref={messagesEndRef} />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-transparent border-none shadow-none animate-fade-in-down duration-200 opacity-0 delay-500">
                                    <CardContent className="p-2">
                                        <Form initialSelectedId={initialSelectedId}  />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
            <SidebarProvider className="min-h-0 bg-transparent" defaultOpen={false} open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <div className={`absolute top-5 right-5 ${initialDoctors?.length && 'animate-pulse'}`}>
                    <SidebarTrigger iconType="doctors" className="bg-purple-100 hover:bg-purple-200 hover:text-blue-600 duration-200 z-10 text-blue-500 scale-125" />
                    {initialDoctors?.length ?
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full absolute -top-1 -right-1"></span>
                        : ''
                    }
                </div>
                <Sidebar side="right" className="!bg-transparent backdrop-blur-[2px]" style={{ backgroundColor: 'transparent' }}>
                    <SidebarInset className="relative bg-transparent" style={{ backgroundColor: 'transparent' }}>
                        <div className="space-y-6">
                            <Card className="h-[100svh] shadow-xl border-0  bg-transparent">
                                <CardHeader className="p-4 relative">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <CardTitle className="leading-7 text-blue-900">Recommended Specialists</CardTitle>
                                        </div>
                                    </div>
                                    <SidebarTrigger className="absolute top-16 -translate-y-full -translate-x-full bg-neutral-200 z-10 left-4 text-black" />

                                </CardHeader>
                                <CardContent className="h-full">
                                    {initialDoctors?.length > 0 ? (
                                        <div className="space-y-4">
                                            {initialDoctors?.map((doc) => (
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