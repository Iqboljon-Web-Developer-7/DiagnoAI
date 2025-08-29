// api.ts
// Handles API interactions for user login using TanStack Query

import { useMutation } from "@tanstack/react-query"
import { LoginFormData, LoginResponse, ErrorResponse } from "./types"

// Base API URL for login
const API_BASE_URL = "https://api.diagnoai.uz/api/users/login/"

// Mutation function to log in a user
export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: async (data: LoginFormData) => {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_or_phone: data.email,
          password: data.password,
        }),
      })

      const res = await response.json()

      if (!response.ok) {
        throw new Error(JSON.stringify({ data: res, status: response.status }))
      }

      return res
    },
  })
}