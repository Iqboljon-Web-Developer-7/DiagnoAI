"use client"

import type React from "react"
import { JSX, useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/context/store"
import { Loader2, User, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
}

interface RegisterResponse {
  user: {
    first_name: string
    last_name: string
    email: string
  }
  token: string
}

interface ErrorResponse {
  phone_number?: string[]
  email?: string[]
  [key: string]: unknown
}

type PasswordStrength = "weak" | "medium" | "strong"

const Page: React.FC = () => {
  const router = useRouter()
  const { setUser } = useAppStore()
  const t = useTranslations("Auth")

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })

  // UI state
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  // Derived state
  const passwordsMatch =
    formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
    
  const passwordStrength: PasswordStrength = formData.password
    ? formData.password.length >= 8
      ? "strong"
      : formData.password.length >= 6
      ? "medium"
      : "weak"
    : "weak"

  // TanStack Query mutation for registration
  const registerMutation = useMutation<RegisterResponse, Error, FormData>({
    mutationFn: async (data: FormData) => {
      const response = await fetch("https://api.diagnoai.uz/api/users/register/", {
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
    onSuccess: (data: RegisterResponse) => {
      setUser({
        id: `user-${Date.now()}`,
        name: `${data.user.first_name} ${data.user.last_name}`,
        email: data.user.email,
        avatar: "/placeholder.svg?height=32&width=32",
        token: data.token,
      })
      router.push("/")
    },
    onError: (error: Error) => {
      try {
        const parsedError = JSON.parse(error.message)
        if (parsedError.status === 400) {
          handleErrorResponse(parsedError.data as ErrorResponse)
        } else {
          setError(t("errors.general"))
        }
      } catch {
        setError(t("errors.general"))
      }
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError(t("errors.passwordMismatch"))
      return
    }

    registerMutation.mutate(formData)
  }

  const handleErrorResponse = (data: ErrorResponse): void => {
    if (data.phone_number) {
      setError(data.phone_number[0])
    } else if (data.email) {
      setError(data.email[0])
    } else if (typeof data === "object") {
      const firstError = Object.values(data)[0]
      setError(Array.isArray(firstError) ? firstError[0] : String(firstError))
    } else {
      setError(t("errors.general"))
    }
  }

  const renderInputField = (
    id: keyof FormData,
    label: string,
    type: string,
    placeholder: string,
    Icon: React.ElementType
  ): JSX.Element => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={formData[id]}
          onChange={handleInputChange}
          className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
          required
        />
      </div>
    </div>
  )

  return (
    <div className="  w-full overflow-auto flex justify-center fixed inset-0 z-50">
      <div className="w-full overflow-auto flex justify-center">
        <Card className="max-w-md mx-auto border-0  ">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("register.title")}
            </CardTitle>
            <CardDescription className="text-gray-600">{t("register.description")}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {renderInputField("firstName", "First Name", "text", "First Name", User)}
                {renderInputField("lastName", "Last Name", "text", "Last Name", User)}
              </div>

              {renderInputField("email", t("register.email"), "email", t("register.emailPlaceholder"), Mail)}
              {renderInputField("phoneNumber", "Phone Number", "tel", "Enter phone number", Phone)}

              {/* Password fields with special handling */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t("register.password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength === "strong"
                            ? "bg-green-500 w-full"
                            : passwordStrength === "medium"
                            ? "bg-yellow-500 w-2/3"
                            : "bg-red-500 w-1/3"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength === "strong"
                          ? "text-green-600"
                          : passwordStrength === "medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {passwordStrength === "strong" ? "Strong" : passwordStrength === "medium" ? "Medium" : "Weak"}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  {t("register.confirmPassword")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 ${
                      formData.confirmPassword && !passwordsMatch ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center gap-2 mt-2">
                    {passwordsMatch ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs">Passwords match</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs">Passwords don&apos;t match</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {(error || registerMutation.error) && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error || t("errors.general")}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("register.loading")}
                  </>
                ) : (
                  t("register.submit")
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">{t("register.haveAccount")}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
            >
              {t("register.loginLink")}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page
