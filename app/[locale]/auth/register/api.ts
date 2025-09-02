import { useMutation } from "@tanstack/react-query"
import { RegisterFormData, RegisterResponse } from "./types"

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/users/register/`

export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, Error, RegisterFormData>({
    mutationFn: async (data: RegisterFormData) => {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_number: data.phoneNumber,
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