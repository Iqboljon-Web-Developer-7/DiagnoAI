"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LanguageSwitcher from "@/components/layout/Header/_components/language-switcher"
import UserMenu from "@/components/layout/Header/_components/user-menu"
import Bookings from "@/components/layout/Header/_components/Bookings"
import ThemeToggle from "@/components/ThemeToggle"

export default function SettingsPage() {
  return (
    <div className="pt-16 min-h-screen bg-gradient from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <main className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-2">Manage language, theme, account and bookings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Language</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Select your preferred language</span>
                <LanguageSwitcher />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Toggle light or dark mode</span>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Access account options</span>
                <UserMenu />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">View recent bookings</span>
                <Bookings />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}