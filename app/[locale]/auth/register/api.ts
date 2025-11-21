import { useMutation } from "@tanstack/react-query"
import { RegisterFormData, RegisterResponse } from "./types"
import { serverFetch } from "@/app/actions"

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/users/register/`

export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, Error, RegisterFormData>({
    mutationFn: async (data: RegisterFormData) => {
      const response = await serverFetch("/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          first_name: data.first_name,
          phone_number: data.phoneNumber,
          password: data.password,
        },
      })

      console.log(response);
      

      return response
    },
  })
}