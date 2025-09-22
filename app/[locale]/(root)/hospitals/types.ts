// types.ts
// TypeScript interfaces and types for the hospital feature

// Hospital data structure
export interface Hospital {
  id: number
  name: string
  latitude: number
  longitude: number
  type?: string
  address?: string
  description?: string
  rating?: number
  reviews?: number
  beds?: number
  services?: string
  distance?: number
  image?: string
  phone_number:number,
  departments: string[]
}

// Hospital type for filtering
export interface HospitalType {
  name: string
  count: number
  icon: string
}

// Appointment data structure
export interface Appointment {
  doctor: string
  specialty: string
  date: string
  time: string
  type: string
  status: string
}

// Data for booking an appointment
export interface BookAppointmentData {
  userId: string
  latitude: number
  longitude: number
  hospitalName: string
  type?: string
}

// API error response structure
export interface ErrorResponse {
  detail?: string
  [key: string]: unknown
}

// User data structure for the app store
export interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
  role?: string
  token?: string
}   