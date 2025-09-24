export interface Chat {
  id: string
  created_at: string
  updated_at?: string
  messages?: { id: number; content: string; is_from_user: boolean; created_at: string }[]
}

export interface ChatMessage {
  user?: string
  ai?: string
}

export interface Doctor {
  id: number
  name: string
  specialty: string
  hospital: {
    id: number
    name: string
  }
  field: string
  description: string
  translations?: {
    field: string
    description: string
    hospital: string
  }
  image?: string
}

export interface ChatApiResponse {
  id: string
  created_at: string
  updated_at?: string
  messages?: { id: number; content: string; is_from_user: boolean; created_at: string }[]
  message?: string
  doctors?: number[]
}

export interface DiagnosisClientProps {
    initialChats: Chat[]
    initialSelectedChat: Chat | null
    initialDoctors: Doctor[]
    initialSelectedId?: string
}