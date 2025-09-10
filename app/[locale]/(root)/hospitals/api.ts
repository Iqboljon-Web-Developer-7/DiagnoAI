// api.ts
// Handles client-side API interactions for hospital-related actions using TanStack Query

"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { BookAppointmentData, Hospital } from "./types"
import axios from "axios"

// Base API URL
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`

// Mutation function to book an appointment
export const useBookAppointmentMutation = (token: string | undefined) => {
  return useMutation<unknown, Error, BookAppointmentData>({
    mutationFn: async ({ userId, latitude, longitude, hospitalName  }) => {
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

export const useGetHospitals = () => {
  return useQuery<Hospital[]>({
    queryKey: ['hospitals'],
    queryFn: async () => {
      const response = await axios.get<Hospital[]>(`${API_BASE_URL}/api/hospitals/`)
      return response.data
    }
  })
}

// Fetch single hospital by ID
export const useGetHospital = (id: string | undefined, token?: string) => {
  return useQuery({
    queryKey: ["hospital", id],
    queryFn: async () => {
      if (!id) throw new Error("Invalid hospital id")
      const response = await axios.get(`${API_BASE_URL}/api/hospitals/${id}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      return response.data
    },
    enabled: !!id,
  })
}