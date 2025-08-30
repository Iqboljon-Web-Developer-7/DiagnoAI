// api.ts
// Handles client-side API interactions for hospital-related actions using TanStack Query

"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { BookAppointmentData } from "./types"
import axios from "axios"

// Base API URL
const API_BASE_URL = "https://api.diagnoai.uz/api"

// Mutation function to book an appointment
export const useBookAppointmentMutation = (token: string | undefined) => {
  return useMutation<unknown, Error, BookAppointmentData>({
    mutationFn: async ({ userId, latitude, longitude, hospitalName, type }) => {
      if (!token) {
        throw new Error("Authentication required")
      }

      const formData = new FormData()
      formData.append("user_id", userId)
      formData.append("latitude", latitude.toString())
      formData.append("longitude", longitude.toString())
      formData.append("message", `Book appointment at ${hospitalName}`)

      const response = await fetch(`${API_BASE_URL}/chats/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to book appointment")
      }

      return response.json()
    },
  })
}

export const useGetHospitals = (token: string | undefined) => {
  return useQuery({
    queryKey: ['hospitals'],
    queryFn: async () => {
      const API_BASE_URL = "https://api.diagnoai.uz/api"

      const response = await axios.get(`${API_BASE_URL}/hospitals/`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      return response.data.map((hospital: any) => ({
        id: hospital.id,
        name: hospital.name,
        latitude: hospital.latitude,
        longitude: hospital.longitude,
        type: hospital.type || "General",
        address: hospital.address || "N/A",
        description: hospital.description || "No description available",
        rating: hospital.rating || 4.0,
        reviews: hospital.reviews || 0,
        beds: hospital.beds || 100,
        services: hospital.services || "General Services",
        image: hospital.image || "/placeholder-hospital.jpg",
      }))
    },
    enabled: !!token
  })
}