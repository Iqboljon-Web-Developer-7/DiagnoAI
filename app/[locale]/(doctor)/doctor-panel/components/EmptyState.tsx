"use client";
import React from "react";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

const EmptyState: React.FC = () => {
  const t = useTranslations("doctorPanel");
  return (
    <div className="p-8 text-center">
      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{t("noAppointmentsFound")}</h3>
      <p className="text-gray-600">{t("noBookingsMatchFilters")}</p>
    </div>
  );
};

export default EmptyState;