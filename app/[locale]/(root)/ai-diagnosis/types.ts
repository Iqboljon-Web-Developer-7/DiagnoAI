// Types for AI Diagnosis components

export interface Chat {
  id: string;
  created_at: string;
  updated_at?: string;
  messages?: { id: number; content: string; is_from_user: boolean; created_at: string }[];
}

export interface ChatMessage {
  id?: number;
  chatId?: string;
  content?: string;
  is_from_user?: boolean;
  created_at?: string;
  user?: string; // User message content
  ai?: string;   // AI response content
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  field: string;
  description: string;
  rating?: number;
  image?: string;
}

export interface ChatApiResponse {
  data:{

    chat?: Chat;
    id?: string;
    created_at?: string;
    updated_at?: string;
    messages?: { id: number; content: string; is_from_user: boolean; created_at: string }[];
    message?: string;
    doctors?: Doctor[];
  }
}