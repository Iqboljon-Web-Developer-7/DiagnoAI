export type ChatMessage = { id: number; content: string; is_from_user: boolean; created_at: string };
export type Chat = { id: string; created_at: string; updated_at?: string; messages?: ChatMessage[] };
export type Doctor = { id: number; name: string; specialty?: string; hospital?: { id: number; name: string }; field?: string; description?: string; image?: string; translations?: any };
