"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Paperclip, Send, FileText, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { ChatApiResponse } from "../../types";
import { createChat, updateChat } from "../../actions";

import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useAppStore } from "@/store/store";
import AutoWrite from "@/components/shared/AutoWritten";

interface FormProps {
  initialSelectedId?: string;
  isOpenedInOtherWeb?:string
}

function Form({ initialSelectedId, isOpenedInOtherWeb }: FormProps) {
  const { isLoggedIn, user } = useAppStore();
  const t = useTranslations("diagnosis");

  const router = useRouter();
  const user_id = user?.id;

  const [analyzing, setAnalyzing] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const getGeolocation = () =>
    new Promise<{ latitude: number; longitude: number }>((res) =>
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          res({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        () => res({ latitude: 0, longitude: 0 })
      )
    );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSymptoms("");
    setFiles([]);

    if (!isLoggedIn) {
      toast(t("notLoggedIn"));
      router.push(`/auth/login${isOpenedInOtherWeb === 'true' ? '?isOpenedInOtherWeb=true' : ''}`);
      return;
    }

    const form = new FormData();
    form.append("id", user_id!);
    const { latitude, longitude } = await getGeolocation();
    form.append("latitude", latitude.toString());
    form.append("longitude", longitude.toString());
    if (symptoms) form.append("message", symptoms);
    files.forEach((f) => form.append("file", f));
    setAnalyzing(true);

    try {
      let resp: ChatApiResponse;

      resp = initialSelectedId
        ? await updateChat(initialSelectedId, form)
        : await createChat(form);

      initialSelectedId = resp.id || initialSelectedId;

      const url = resp.doctors?.length
        ? `/ai-diagnosis?chatId=${initialSelectedId}&doctorIds=${resp.doctors.join(",")}${isOpenedInOtherWeb ? '&isOpenedInOtherWeb=true' : ''}`
        : `/ai-diagnosis?chatId=${initialSelectedId}${isOpenedInOtherWeb ? '&isOpenedInOtherWeb=true' : ''}`;
      router.push(url);
      setAnalyzing(false);
      setFiles([]);
    } catch (err) {
      console.error("Error sending message:", err);
      toast(t("failedToSendMessage"));
      setAnalyzing(false);
    }
  };

  return (
    <>
      {analyzing && (
        <AutoWrite
          speed={65}
          repeat={0}
          sequence={[
            "ai-thinking.1",
            "ai-thinking.2",
            "ai-thinking.3",
            "ai-thinking.4",
          ]}
          className="max-w-md text-center mx-auto text-gray-700 dark:text-gray-200"
        />
      )}
      <div
        className="
        w-[-webkit-fill-available] max-w-[70vw] sm:max-w-screen overflow-x-auto overflow-y-hidden flex items-center justify-start"
      >
        {files!?.length > 0 && (
          <div className="py-2">
            <div className="flex items-center justify-start gap-3">
              {files!.map((file, i) => (
                <div key={i} className="relative group w-12 h-12">
                  <div className="aspect-square w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center hover:bg-white/30 dark:hover:bg-gray-800/30 duration-100">
                    {file.type.startsWith("image/") ? (
                      <Zoom>
                        <Image
                          width={48}
                          height={48}
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </Zoom>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <div className="text-center p-4">
                          <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                            {file.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newFiles = [...files];
                      newFiles.splice(i, 1);
                      setFiles(newFiles);
                    }}
                    className="absolute -top-2 -right-4 bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 backdrop-blur-[2px] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="space-y-4 w-full">
        <div className="relative">
          <Textarea
            disabled={analyzing}
            placeholder={analyzing ? "Analyzing..." : t("symptomPlaceholder")}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="min-h-5 disabled:opacity-100 shadow-subtle{ md:min-h-8 resize-none text-sm bg-slate-100 dark:bg-gray-800/50 backdrop-blur-2xl md:text-lg max-h-40 w-full pr-16 sm:pr-14 focus:border-blue-400 dark:focus:border-blue-600 rounded-2xl border-none focus-visible:outline-hidden focus-visible:ring-offset-0 text-gray-700 dark:text-gray-200"
            rows={2}
            cols={2}
            style={{
              height: "auto",
              overflow: "auto",
            }}
          />
          <div className="rounded-xl text-center transition-colors absolute bottom-2 md:bottom-3 right-11">
            <input
              disabled={analyzing}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Paperclip className="h-4 w-4 md:h-5 md:w-5 text-gray-700 dark:text-gray-200" />
            </label>
          </div>
          <div className="rounded-xl text-center transition-colors absolute -bottom-1 md:bottom-1 right-1">
            <Button
              size={"icon"}
              type="submit"
              title={
                analyzing
                  ? "Analyzing..."
                  : !symptoms.trim() && !files?.length
                  ? "Type something please..."
                  : "Send"
              }
              disabled={analyzing || (!symptoms.trim() && !files?.length)}
              className="text-black dark:text-gray-200 rounded-full bg-transparent  hover:bg-transparent shado-none hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 duration-200"
            >
              {analyzing ? (
                <Loader2 className="animate-spin h-4 w-4 md:h-5 md:w-5 text-gray-700 dark:text-gray-200" />
              ) : (
                <Send className="h-4 w-4 md:h-5 md:w-5 scale-125 text-gray-700 dark:text-gray-200" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

export default memo(Form);
