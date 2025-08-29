"use client";

import React, { memo } from "react";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@/i18n/navigation";
import { Doctor } from "../types";

interface DoctorItemProps {
  doctor: Doctor;
  router: ReturnType<typeof useRouter>;
}

// Memoized Doctor Item Component
const DoctorItem = memo(({ doctor, router }: DoctorItemProps) => (
  <div
    onClick={() => router.push(`/doctors/${doctor.id}`)}
    className="cursor-pointer p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
  >
    <div className="flex items-start gap-3">
      <Avatar className="h-12 w-12 border-2 border-green-200">
        <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          {doctor.name.split(" ").map((n) => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
        <Badge variant="secondary" className="mb-2 bg-green-100 text-green-800">
          {doctor.field}
        </Badge>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{doctor.description}</p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          <span>{doctor.hospital}</span>
        </div>
      </div>
    </div>
  </div>
));

DoctorItem.displayName = "DoctorItem";

export default DoctorItem;