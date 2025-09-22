import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import CollapsibleTabs from './_components/CollapsibleTabs';
import { LanguageSwitcher } from './_components/language-switcher';
import { UserMenu } from './_components/user-menu';
import Bookings from './_components/Bookings';

export async function Header() {
  return (
    <header className="fixed left-2 right-2 top-3 bg-white/50 rounded-3xl backdrop-blur-[2px] shadow-md max-w-7xl mx-auto p-1 flex justify-between items-center z-30">
      <div className="hover:scale-105 transition-transform duration-200 animate-fade-in-down opacity-0 delay-200">
        <Link href="/" className="flex items-center space-x-2 shrink-0">
          <Image loading='lazy' className="min-w-[2.125rem] max-w-24 hover:scale-105 hover:-rotate-1  duration-300" src="/logo.png" width={120} height={44} alt="Logo" />
        </Link>
      </div>

      <CollapsibleTabs />

      <div className="flex items-center animate-fade-in-down opacity-0 delay-1000">
        <LanguageSwitcher />
        <UserMenu />
        <Bookings />
        {/* <ThemeToggle /> */}
      </div>
    </header>
  );
}
