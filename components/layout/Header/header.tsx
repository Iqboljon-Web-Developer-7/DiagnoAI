"use client"

import { Link} from '@/i18n/navigation';
import Image from 'next/image';
import CollapsibleTabs from './_components/CollapsibleTabs';
import { LanguageSwitcher } from './_components/language-switcher';
import { UserMenu } from './_components/user-menu'; 
import { Bookings } from './_components/Bookings';

export async function Header() { 
  return (
    // <header className={`min-h-16 w-full items-center justify-center bg-transparent sticky top-0 z-30 px-3 flex`}  >
      <div className="fixed left-2 right-2 top-3 bg-white/70 w-full rounded-2xl backdrop-blur-sm max-w-7xl mx-auto px-[1%] flex justify-between items-center z-30">
        <div className="hover:scale-105 transition-transform duration-200 animate-fade-in-down opacity-0 delay-200">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Image className="min-w-[2.125rem] max-w-24 hover:scale-105 hover:-rotate-1  duration-300" src="/logo.png" width={200} height={40} alt="Logo" loading="lazy"/>
          </Link>
        </div>

        <CollapsibleTabs  />

        <div className="flex items-center  sm:space-x-2 lg:space-x-4 animate-fade-in-down opacity-0 delay-1000">
          <LanguageSwitcher />
          <UserMenu />
          <Bookings />
          {/* <ThemeToggle /> */}
        </div>
      </div>
    // </header>
  );
}
