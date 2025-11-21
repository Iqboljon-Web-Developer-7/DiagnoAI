// api.ts
import { useMutation } from "@tanstack/react-query"
import { LoginFormData, LoginResponse } from "./types"
import { serverFetch } from "@/app/actions"

// Base API URL for login
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/users/login/`


// Mutation function to log in a user
export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: async (data: LoginFormData) => {
      const response = await serverFetch("/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:  {
          email_or_phone: data.text || "",
          password: data.password,
        },
      })

      return response
    },
  })
}