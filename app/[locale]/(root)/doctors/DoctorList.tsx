"use client";

import dynamic from "next/dynamic";
import React, { memo, useEffect, useMemo, useState } from "react";
import { Doctor } from "./types";
import { DoctorCard } from "./DoctorCard";
import { useAppStore } from "@/store/store";

const Filters = dynamic(
  () => import("./components/Filters").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 my-5 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
    ),
  }
);

interface DoctorListProps {
  doctors: Doctor[];
}

const DoctorList = memo(({ doctors }: DoctorListProps) => {
  const { user, setLocation } = useAppStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setLocation(0, 0);
        }
      );
    } else {
      setLocation(0, 0);
    }
  }, [setLocation]);

  const memoizedDoctors = useMemo(() => doctors, [doctors]);

  if (!memoizedDoctors?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 dark:bg-gray-900">
        <div className="relative">
          <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-blue-400 dark:text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 dark:bg-yellow-600 rounded-full opacity-80 animate-pulse"></div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          No Doctors Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          We couldn't find any doctors matching your criteria. Try adjusting
          your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid  dark:bg-gray-900">
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          onClearFilters={() => {
            setSearchTerm("");
            setSelectedRating("");
          }}
        />

      <div className="col-span-4 grid md:grid-cols-2 gap-2">
        {memoizedDoctors.map((doctor, index) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            user={user!}
            index={index}
          />
        ))}
      </div>
    </div>
  );
});

DoctorList.displayName = "DoctorList";

export { DoctorList };
