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
import { useAppStore } from "@/store/store"
import { User, LogOut, LogIn, UserPlus, Hospital } from "lucide-react"
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
      {user?.role == "clinic" && (
        <Link className='px-2' href={"/doctor-panel"}><Hospital size={20} /></Link>
      )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="relative bg-transparent hover:bg-blue-100 rounded-full" size={"icon"} aria-label={'userMenu'}>
              <div className="flex items-center justify-center h-8 w-8 rounded-full">
                <User color="black" className="h-4 w-4 text-blue-600" aria-hidden="true" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white/50 backdrop-blur-sm border-none" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="font-medium leading-none">{user.name}</p>
                <p className="text-sm leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='bg-white/30' />
            {/* <Link href="/dashboard">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>{t('dashboard')}</span>
              </DropdownMenuItem>
            </Link> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem className='hover:bg-white/30 duration-500 ease-in-out' onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center ">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="link" 
                  className='hover:bg-white/60 duration-200 rounded-full' 
                  size="sm" 
                  onClick={openLoginModal}
                  aria-label={t('login')}
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
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
              <Button 
                size="sm" 
                variant={"link"} 
                className="hover:bg-blue-700 hover:text-slate-100 duration-200 rounded-full" 
                onClick={openRegisterModal}
                aria-label={t('register')}
              >
                <UserPlus size={3} aria-hidden="true" />
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
