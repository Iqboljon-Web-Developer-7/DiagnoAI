"use client"

import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAppStore } from "@/context/store"
import { User, LogOut, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function UserMenu({ className }: { className?: string }) {
  const { user, isLoggedIn, logout } = useAppStore()
  const t = useTranslations('UserMenu')
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const openLoginModal = () => {
    router.push("/auth/login")
  }

  const openRegisterModal = () => {
    router.push("/auth/register")

  }

  if (isLoggedIn && user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="relative" variant={"link"} size={"icon"}>
              <div className="flex items-center justify-center h-8 w-8 rounded-full">
                <User color="black" className="h-4 w-4 text-blue-600" />
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
                <span>{t('dashboard')}</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center space-x-0 sm:space-x-2 lg:space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="link" className='hover:bg-slate-100 duration-200' size="sm" onClick={openLoginModal}>
                  <LogIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('login')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        <div className="hidden sm:block">

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant={"link"} className="hover:bg-blue-700 hover:text-slate-100 duration-200" onClick={openRegisterModal}>
                <UserPlus size={3} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('register')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        </div>
      </div>

    </div>
  )
}
