"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppContext } from "@/context/app-context"
import { Loader2 } from "lucide-react"

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  onLoginClick?: () => void
}

export function RegisterModal({ isOpen, onClose, onSuccess, onLoginClick }: RegisterModalProps) {
  const { login } = useAppContext()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Parollar mos kelmadi")
      return
    }

    setIsLoading(true)

    try {
      // For demo purposes, we'll just use the login function
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const success = await login(email, password)
      if (success) {
        onSuccess?.()
        onClose()
      } else {
        setError("Ro'yxatdan o'tish muvaffaqiyatsiz tugadi.")
      }
    } catch (err) {
      setError("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ro'yxatdan o'tish</DialogTitle>
          <DialogDescription>Diagno AI platformasidan foydalanish uchun ro'yxatdan o'ting</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">To'liq ism</Label>
              <Input
                id="name"
                type="text"
                placeholder="Anvar Karimov"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Parolni tasdiqlang</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row">
            <div className="flex items-center text-sm mr-auto">
              <span>Hisobingiz bormi?</span>
              <Button type="button" variant="link" className="p-0 h-auto ml-1" onClick={onLoginClick}>
                Kirish
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ro'yxatdan o'tish...
                  </>
                ) : (
                  "Ro'yxatdan o'tish"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
