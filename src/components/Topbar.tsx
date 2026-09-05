"use client";
import { Bell, Search, Menu, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="h-14 md:h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 pt-[env(safe-area-inset-top,0px)]">
      {/* Mobile brand / back button */}
      <div className="flex items-center gap-1 md:hidden">
        {pathname !== '/' && (
          <button 
            onClick={() => router.back()} 
            className="p-1.5 -ml-1.5 mr-1 rounded-xl hover:bg-muted text-foreground transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <Link href="/" className="font-extrabold tracking-tight text-base py-2">
          WHITE BOOK
        </Link>
      </div>
      
      {/* Desktop Search */}
      <div className="hidden md:flex flex-1 items-center gap-4">
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search directory..." 
            className="w-full h-9 pl-9 pr-12 rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-border focus:ring-2 focus:ring-primary/10 text-sm font-medium transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground bg-muted border border-border/50 px-1.5 py-0.5 rounded flex items-center gap-0.5 pointer-events-none">
            <span className="font-sans">⌘</span>K
          </div>
        </div>
      </div>

      {/* Right Action icons */}
      <div className="flex items-center gap-2 md:gap-4">
        <Link 
          href="/notifications" 
          className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-background"></span>
        </Link>
      </div>
    </header>
  );
}
