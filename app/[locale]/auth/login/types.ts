// types.ts
// TypeScript interfaces and types for the login feature

// Form data structure for login
export interface LoginFormData {
  email: string
  password: string
}

// API response structure for successful login
export interface LoginResponse {
  role: string
  token: string
}

// API error response structure
export interface ErrorResponse {
  detail?: string
  [key: string]: unknown
}

// User data structure for the app store
export interface User {
  id: string
  email: string
  avatar: string
  role: string
  token: string
}