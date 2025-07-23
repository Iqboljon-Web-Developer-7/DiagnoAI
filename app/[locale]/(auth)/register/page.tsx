"use client"

import type React from "react"
import { useState } from "react"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/context/store"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const router = useRouter()
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
            await new Promise((resolve) => setTimeout(resolve, 1500))
            const success = await login(email, password)
            if (success) {
                router.push('/')
            } else {
                setError(t('errors.registrationFailed'))
            }
        } catch (err) {
            console.log(err);
            setError(t('errors.general'))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container max-w-[425px] mx-auto py-10">
            <div className="shadow-lg p-6 rounded-lg">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">{t('register.title')}</h1>
                    <p className="text-gray-500">{t('register.description')}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
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
                    <div className="flex justify-end gap-4 mt-6">
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
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-500">
                        {t('register.haveAccount')}{" "}
                        <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() => router.push('/login')}
                        >
                            {t('register.loginLink')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
