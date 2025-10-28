"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useRouter } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { MapPin, User } from "lucide-react";
import React, { memo } from "react";
import { Doctor } from "../../types";
import Image from "next/image";

const Doctors = ({
  initialDoctors,
  t,
  isOpenedInOtherWeb
}: {
  initialDoctors: Doctor[];
  t: (key: string) => string;
  isOpenedInOtherWeb: string
}) => {
  const router = useRouter();

  return (
    <SidebarInset
      className="relative bg-transparent dark:bg-neutral-900/80"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="relative">
        <SidebarTrigger className="absolute top-16 -translate-y-full -translate-x-full bg-neutral-200 z-50 left-4 text-black dark:bg-neutral-700 dark:text-white" />
        <Card className="relative h-svh overflow-y-auto shadow-xl border-0 bg-transparent dark:bg-neutral-900/80">
          <CardHeader className="p-4 relative">
            <div className="flex items-center gap-3 py-2 px-2">
              <div>
                <CardTitle className="leading-7 text-blue-900 dark:text-neutral-200">
                  {t("specialists")}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            {initialDoctors?.length > 0 ? (
              <div className="space-y-4 overflow-y-auto">
                {initialDoctors?.map((doc) => (
                  <div
                    onClick={() => router.push(`/doctors/${doc?.id}${isOpenedInOtherWeb == 'true' && '?isOpenedInOtherWeb=true'}`)}
                    key={doc?.id}
                    className="cursor-pointer p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-linear-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 dark:border-neutral-700"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-14 w-14 border-2 border-green-200 dark:border-green-700 rounded-full">
                        {doc?.image ? (
                          <Image
                            width={120}
                            height={120}
                            src={`${process.env.NEXT_PUBLIC_API_URL}${doc.image}`}
                            alt={doc.name}
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <AvatarFallback className="bg-linear-to-r from-green-500 to-emerald-500 text-white dark:from-green-900 dark:to-emerald-900">
                            {doc?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0 grid gap-2">
                        <h4 className="font-semibold text-lg leading-5 text-gray-900 dark:text-gray-100">
                          {doc?.name}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 line-clamp-1 text-green-800 dark:bg-green-900 dark:text-green-300"
                        >
                          {doc?.translations?.field}
                        </Badge>
                        <p className="text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
                          {doc?.translations?.description}
                        </p>
                        <Link
                          onClick={(e) => e.stopPropagation()}
                          href={`/hospitals/${doc?.hospital?.id}`}
                          className="underline flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
                        >
                          <MapPin className="h-3 w-3" />
                          <span>{doc?.hospital?.name}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center dark:bg-neutral-800">
                  <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {t("noDiagnosis")}
                </p>
              </div>
            )}

            <Link href="/doctors" passHref className="fixed bottom-[1%] right-[3%]">
              <Button className="w-full mt-4 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white dark:from-green-900 dark:to-emerald-900 dark:hover:from-green-950 dark:hover:to-emerald-950">
                {t("viewAllSpecialists")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
};

export default memo(Doctors);
