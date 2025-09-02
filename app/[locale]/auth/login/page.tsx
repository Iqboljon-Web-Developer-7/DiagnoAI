"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/Store/store"
import { Loader2, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { useLoginMutation } from "./api"
import { LoginFormData, ErrorResponse } from "./types"
import { toast } from "sonner"

// Main login page component
const LoginPage: React.FC = () => {
  const { setUser } = useAppStore()
  const router = useRouter()
  const t = useTranslations("Auth")

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  // UI state
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  // TanStack Query mutation for login
  const loginMutation = useLoginMutation()

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError("")

    loginMutation.mutate(formData, {
      onSuccess: (data) => {
        setUser({
          id: `user-${Date.now()}`,
          email: formData.email,
          avatar: "/placeholder.svg?height=32&width=32",
          role: data.role,
          token: data.token,
        })
        toast.success("Login successful!")
        router.push("/")
      },
      onError: (error: Error) => {
        try {
          const parsedError = JSON.parse(error.message)
          handleErrorResponse(parsedError.data as ErrorResponse)
        } catch {
          setError(t("errors.general"))
        }
      },
    })
  }

  // Handle API error responses
  const handleErrorResponse = (data: ErrorResponse): void => {
    console.log(data);

    if (data.detail) {
      setError(data.detail)
    } else if (typeof data === "object") {
      const firstError = Object.values(data)[0]
      setError(Array.isArray(firstError) ? firstError[0] : String(firstError))
    } else {
      setError(t("errors.loginFailed"))
    }
  }

  // Render input field with icon
  const renderInputField = (
    id: keyof LoginFormData,
    label: string,
    type: string,
    placeholder: string,
    Icon: React.ElementType
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-950 w-5 h-5" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={formData[id]}
          onChange={handleInputChange}
          className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/50 transition-all duration-200"
          required
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-50 to-purple-200 flex items-center justify-center p-4  animate-fade-in-down delay-200 opacity-0">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-indigo-900">
                {t("login.title")}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">{t("login.description")}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Email Field */}
              {renderInputField("email", t("login.email"), "email", t("login.emailPlaceholder"), Mail)}

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t("login.password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-950 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-11 pr-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/50 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {(error || loginMutation.error) && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-600 text-center">{error || t("errors.general")}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t("login.loading")}</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>{t("login.submit")}</span>
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <span>{t("login.noAccount")}</span>{' '}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                {t("login.registerLink")}
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginPage