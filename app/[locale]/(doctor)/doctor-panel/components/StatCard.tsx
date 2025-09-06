"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color = "text-blue-500", className }) => {
  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-sm border border-gray-100", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <Icon className={cn("h-8 w-8", color)} />
      </div>
    </div>
  );
};

export default StatCard;