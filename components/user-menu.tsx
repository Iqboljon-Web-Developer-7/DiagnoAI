"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppContext } from "@/context/app-context"
import { User, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { LoginModal } from "./login-modal"
import { RegisterModal } from "./register-modal"
import { useRouter } from "next/navigation"

export function UserMenu() {
  const { user, isLoggedIn, logout } = useAppContext()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const openLoginModal = () => {
    setIsRegisterModalOpen(false)
    setIsLoginModalOpen(true)
  }

  const openRegisterModal = () => {
    setIsLoginModalOpen(false)
    setIsRegisterModalOpen(true)
  }

  if (isLoggedIn && user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <div className="flex items-center justify-center h-8 w-8 bg-blue-100 rounded-full">
                {user.avatar ? (
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-8 w-8 rounded-full" />
                ) : (
                  <User className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Shaxsiy kabinet</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard?tab=settings">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Sozlamalar</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Chiqish</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  }

  return (
    <>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={openLoginModal}>
          Kirish
        </Button>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={openRegisterModal}>
          Ro'yxatdan o'tish
        </Button>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={openLoginModal}
      />
    </>
  )
}
