"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
}

type Diagnosis = {
  id: string
  date: string
  diagnosis: string
  confidence: number
  status: string
  doctor: string
}

type Appointment = {
  id: string
  doctor: string
  specialty: string
  date: string
  time: string
  type: string
  status: string
}

type AppContextType = {
  user: User | null
  isLoggedIn: boolean
  diagnoses: Diagnosis[]
  appointments: Appointment[]
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  addDiagnosis: (diagnosis: Omit<Diagnosis, "id" | "date">) => void
  addAppointment: (appointment: Omit<Appointment, "id">) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([
    {
      id: "1",
      date: "2024-01-15",
      diagnosis: "Viral Infeksiya (ARVI)",
      confidence: 87,
      status: "Tugallangan",
      doctor: "Dr. Aziza Karimova",
    },
    {
      id: "2",
      date: "2024-01-10",
      diagnosis: "Migren",
      confidence: 92,
      status: "Shifokor bilan uchrashildi",
      doctor: "Dr. Bobur Toshmatov",
    },
    {
      id: "3",
      date: "2024-01-05",
      diagnosis: "Allergik rinit",
      confidence: 78,
      status: "Davolanish davom etmoqda",
      doctor: "Dr. Malika Rahimova",
    },
  ])

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      doctor: "Dr. Aziza Karimova",
      specialty: "Terapevt",
      date: "2024-01-20",
      time: "14:00",
      type: "Onlayn konsultatsiya",
      status: "Tasdiqlangan",
    },
    {
      id: "2",
      doctor: "Dr. Anvar Usmonov",
      specialty: "Nevropatolog",
      date: "2024-01-25",
      time: "10:30",
      type: "Klinikada uchrashish",
      status: "Kutilmoqda",
    },
  ])

  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsLoggedIn(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser = {
      id: "user-1",
      name: "Anvar Karimov",
      email: email,
      avatar: "/placeholder.svg?height=32&width=32",
    }

    setUser(mockUser)
    setIsLoggedIn(true)
    localStorage.setItem("user", JSON.stringify(mockUser))
    return true
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("user")
  }

  const addDiagnosis = (diagnosis: Omit<Diagnosis, "id" | "date">) => {
    const newDiagnosis = {
      ...diagnosis,
      id: `diagnosis-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
    }

    setTimeout(() => {
    setDiagnoses((prev) => [newDiagnosis, ...prev])
      
    }, 0);
  }

  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = {
      ...appointment,
      id: `appointment-${Date.now()}`,
    }

    setAppointments((prev) => [newAppointment, ...prev])
  }

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn,
        diagnoses,
        appointments,
        login,
        logout,
        addDiagnosis,
        addAppointment,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
