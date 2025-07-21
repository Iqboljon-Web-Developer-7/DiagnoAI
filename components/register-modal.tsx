"use client"

import type React from "react"

import { useState } from "react"
import { useTranslations } from 'next-intl'
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
import { useAppStore } from "@/context/store"
import { Loader2 } from "lucide-react"

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  onLoginClick?: () => void
}

export function RegisterModal({ isOpen, onClose, onSuccess, onLoginClick }: RegisterModalProps) {
  const { login } = useAppStore()
  const t = useTranslations('Auth')
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
      setError(t('errors.passwordMismatch'))
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
        setError(t('errors.registrationFailed'))
      }
    } catch (err) {
      setError(t('errors.general'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('register.title')}</DialogTitle>
          <DialogDescription>{t('register.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('register.fullName')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('register.fullNamePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t('register.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('register.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t('register.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">{t('register.confirmPassword')}</Label>
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('register.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('register.loading')}
                </>
              ) : (
                t('register.submit')
              )}
            </Button>
          </DialogFooter>
          <div className="mt-4 text-center text-sm text-gray-500">
            {t('register.haveAccount')}{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={onLoginClick}
            >
              {t('register.loginLink')}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
