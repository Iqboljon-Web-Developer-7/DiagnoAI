"use client";

import dynamic from "next/dynamic";
import type React from "react";
import { useState, useEffect, useRef, useTransition } from "react";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

import bgWallpaper from "@/assets/images/useful/bg-wallpaper-line-2.webp";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Plus } from "lucide-react";

import { toast } from "sonner";

import "react-medium-image-zoom/dist/styles.css";

import { DiagnosisClientProps } from "./types";
import { deleteChat } from "./actions";

import ChatMessages from "./components/CurrentChat/CurrentChat";
import VoiceButton from "./components/VoiceModeBtn";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
const SidebarInset = dynamic(
  () =>
    import("@/components/ui/sidebar").then((mod) => ({
      default: mod.SidebarInset,
    })),
  { ssr: false }
);

const Form = dynamic(() => import("./components/Form/Form"), {
  ssr: false,
  loading: () => (
    <div className="h-[44px] bg-gray-200 dark:bg-gray-800 animate-pulse text-center">
      Loading form...
    </div>
  ),
});
const SideBarChat = dynamic(
  () => import("./components/SideBarChat/SideBarChat"),
  { ssr: false }
);
const Doctors = dynamic(() => import("./components/Doctors/Doctors"), {
  ssr: false,
});

export default function DiagnosisClient({
  initialChats,
  initialSelectedChat,
  initialDoctors,
  initialSelectedId,
  isOpenedInOtherWeb
}: DiagnosisClientProps) {
  const t = useTranslations("diagnosis");

  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(
    initialDoctors?.length > 0
  );
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isPending, startTransition] = useTransition();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleNewChat = () => {
    setIsSidebarOpen(false);
    router.push("/ai-diagnosis");
  };

  const handleDeleteChat = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteChat(id);

        if (initialSelectedChat?.id === id) handleNewChat();
        toast.success(t("deleteSuccess") ?? "Chat deleted");
      } catch {
        toast.error(t("deleteFail") ?? "Failed to delete");
      }
    });
  };

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

  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [isUserScrolling]);

  useEffect(() => {
    if (
      initialSelectedChat!?.messages!.length > 0 &&
      messagesEndRef.current &&
      !isUserScrolling
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [initialSelectedChat?.messages, isUserScrolling]);

  return (
    <div>
      <SidebarProvider
        className="bg-cover bg-no-repeat bg-center"
        defaultOpen={false}
        style={{ backgroundImage: `url(${bgWallpaper.src})` }}
      >
        <Sidebar
          side="left"
          variant="sidebar"
          hidden={false}
          className="border-none shadow-lg backdrop-blur-sm z-50 dark:bg-black/30"
        >
          <SidebarHeader className="relative text-white p-4 gap-3 dark:from-blue-900 dark:to-purple-900 flex flex-row items-center justify-between flex-wrap">
            {isOpenedInOtherWeb != 'true' && (
              <Link
                href={"/"}
                className="flex items-center gap-2 hover:text-green-300 duration-200 w-fit"
              >
                <div className="p-2 bg-white/20 rounded-lg dark:bg-neutral-700/40 text-neutral-900 dark:text-neutral-200">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-neutral-900 dark:text-neutral-200">DiagnoAI</h2>
                </div>
              </Link>
            )}
            <Button
              size={"sm"}
              onClick={handleNewChat}
              className="flex shrink mr-1
                   bg-linear-to-r text-neutral-900 dark:text-neutral-200 hover:bg-black/20 shadow-md bg-black/30"
            >
              <Plus />
              {t("newConsultation")}
            </Button>
            <SidebarTrigger className="absolute -bottom-1 -translate-y-full -translate-x-full bg-neutral-200 dark:bg-neutral-700 z-10 -right-10 text-black dark:text-white" />
          </SidebarHeader>

          <SidebarContent className="pt-2 px-2">
            <SidebarGroup className="overflow-hidden">
              <SidebarGroupContent className="relative overflow-hidden">
                <SidebarMenu className="sticky top-16 h-full overflow-auto">
                  <SideBarChat
                    isPending={isPending}
                    initialSelectedId={initialSelectedId}
                    initialChats={initialChats}
                    handleDeleteChat={handleDeleteChat}
                  />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="backdrop-blur-md dark:bg-cyan-950/50">
          <SidebarTrigger
            iconType="ai-diagnosis"
            className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 duration-200 scale-125 dark:text-white"
          />
          <main
            className={`flex-1 overflow-hidden max-h-svh ${!initialSelectedChat && "flex items-center justify-center"
              }`}
          >
            <div
              className={`gap-8 max-w-7xl mx-auto ${initialSelectedChat && "h-full"
                }`}
            >
              <div
                className={`flex flex-col relative max-h-[98svh] overflow-hidden h-full  `}
              >
                <Card
                  className={`max-h-[96svh] overflow-auto grow shadow-none border-0 bg-transparent ${!initialSelectedChat!?.messages!.length &&
                    "flex items-center justify-center"
                    }`}
                >
                  <CardContent className="p-0 w-full">
                    <div
                      className={`overflow-y-auto p-2 pr-0 sm:p-6 space-y-4 ${initialSelectedChat!?.messages!.length === 0
                        ? "flex items-center justify-center"
                        : ""
                        }`}
                      ref={chatContainerRef}
                    >
                      <ChatMessages
                        initialSelectedChat={initialSelectedChat}
                        t={t}
                        isOpenedInOtherWeb={isOpenedInOtherWeb}
                      />
                      <div ref={messagesEndRef} />
                    </div>
                  </CardContent>
                </Card>

                <span className="flex items-end justify-center p-1 gap-2">
                  <Card className="flex-1 grow bg-transparent border-none shadow-none animate-fade-in-down duration-200 opacity-0 delay-500 p-0">
                    <CardContent className="flex items-start justify-center flex-col p-0 min-w-[80vw] sm:min-w-lg">
                      <Form initialSelectedId={initialSelectedId} isOpenedInOtherWeb={isOpenedInOtherWeb} />
                    </CardContent>
                  </Card>
                  <VoiceButton />
                </span>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
      <SidebarProvider
        className="min-h-0 bg-transparent"
        defaultOpen={false}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      >
        <div
          className={`absolute top-2 right-2 sm:top-4 sm:right-4 ${initialDoctors?.length && "animate-pulse"
            }`}
        >
          <SidebarTrigger
            iconType="doctors"
            className="bg-purple-100 hover:bg-purple-200 hover:text-blue-600 duration-200 z-10 text-blue-500 scale-125 dark:bg-purple-900 dark:hover:bg-purple-800 dark:text-blue-300 dark:hover:text-blue-400"
          />
          {initialDoctors?.length ? (
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full absolute -top-1 -right-1"></span>
          ) : (
            ""
          )}
        </div>
        <Sidebar
          variant="sidebar"
          side="right"
          className="bg-white/30 border-none transition-all backdrop-blur-xs dark:bg-neutral-800/40"
          style={{ backgroundColor: "transparent" }}
        >
          <Doctors initialDoctors={initialDoctors} t={t} isOpenedInOtherWeb={isOpenedInOtherWeb} />
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
