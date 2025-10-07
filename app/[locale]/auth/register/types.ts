// types.ts
// TypeScript interfaces and types for the registration feature

// Form data structure for registration
export interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  password: string
  confirmPassword: string
}

// API response structure for successful registration
export interface RegisterResponse {
  user: {
    first_name: string
    last_name: string
    email: string
  }
  token: string
}

// API error response structure
export interface ErrorResponse {
  phone_number?: string[]
  email?: string[]
  [key: string]: unknown
}

// Password strength indicator
export type PasswordStrength = "weak" | "medium" | "strong"

// User data structure for the app store
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  token: string
}