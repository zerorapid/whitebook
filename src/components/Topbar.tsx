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
        <Link href="/" className="flex items-center gap-2 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 618.8 200.3" className="h-4 sm:h-5 w-auto fill-current text-foreground">
            <path d="M38.9,93.6L10.6,16.2h28.1l13.2,44.1,3,11.5h1.3l1.7-7.6,13.6-47.9h30.3l14.4,47.9,2.4,7.6h1.3l3-11.5,12-44.1h27.7l-1.3,7.9-27.2,69.5h-30.3l-14-42.6-2.6-11.1h-1.3l-2.5,11.1-13.9,42.6h-30.7Z"/>
            <path d="M191.8,93.6V16.1h25.5v29.6h41v-29.6h25.3v77.6h-25.3v-30.1h-41v30.1h-25.5Z"/>
            <path d="M323.2,93.6V16.1h25.3v77.6h-25.3Z"/>
            <path d="M411.6,93.6v-59.8h-31.4V15.9h88.8v17.9h-31.8v59.8h-25.6Z"/>
            <path d="M500.6,93.6V16.1h84.7v17.9h-59v10.9h43.7v18.3h-43.7v12.3h56.9l7.9,16.6c0,.3-1.2.7-3.6,1-2.4.3-6.5.5-12.3.5h-74.7Z"/>
            <path d="M15.2,194.6v-86.1h66.6c9.2,0,15.8,1.8,20,5.5,4.2,3.7,6.3,8.1,6.3,13.2v4.4c0,4-.9,7.3-2.6,9.9-1.7,2.6-3.5,4.4-5.5,5.5,4.3,1.4,7.7,3.7,10.2,7.1,2.5,3.4,3.8,7.8,3.8,13.2v2.6c0,2.9-.3,5.8-1,8.8-.7,2.9-2,5.6-3.9,8-1.9,2.4-4.6,4.3-8,5.8-3.5,1.5-8,2.2-13.5,2.2H15.2ZM43.7,141.7h29.2c2.5,0,4.3-.5,5.3-1.6,1-1.1,1.5-2.5,1.5-4.4v-1.5c0-2-.5-3.5-1.5-4.4-1-.9-3.2-1.3-6.6-1.3h-27.9v13.1ZM43.7,174.6h35.2c2.5,0,4.3-.5,5.3-1.4s1.5-2.4,1.5-4.5v-2.6c0-1.8-.6-3.3-1.9-4.3s-3.5-1.5-6.6-1.5h-33.5v14.3Z"/>
            <path d="M589.4,192.9c-4.6,0-9.1-.9-13.4-2.7-4.3-1.8-8.2-4.4-11.5-7.5-1.7-1.7-3.4-3.4-5.1-5-1.7-1.7-3.4-3.4-5.1-5-3.6-3.5-7.4-6.4-11.4-8.5-4-2.1-9-3.1-15-3.1h-1.4s.2,30.9.2,30.9l-27.1.2-.5-71.6-1.5-11.3,28.5-.2.2,32.6h4.2c1.6,0,2.8-.3,3.7-.7.9-.4,1.8-1.2,2.9-2.3,2.2-2.5,4.7-5.5,7.5-9,2.7-3.6,5.4-7.2,8.1-10.9,2.7-3.7,4.9-7,6.8-9.8l34.5-.2-5.7,8.5c-2.3,2.6-4.9,5.3-7.8,8.4-2.8,3-5.7,6-8.5,8.9-2.8,2.9-5.4,5.5-7.7,7.9-2.3,2.4-4.2,4.2-5.6,5.5,2.9,1.2,5.5,2.6,7.6,4.1,2.2,1.5,4.5,3.3,7.1,5.2,2.4,1.8,4.4,3.4,6.2,4.9,1.7,1.5,3.8,3.2,6.3,5,5.1,3.9,9.5,6.3,13.2,7.3,3.7,1,6.1,1.4,7.1,1.4l-5.5,15.7c-.9.3-2.4.6-4.4.9-2,.3-4.3.5-7,.5Z"/>
            <path d="M471.7,115.4c-5.4-4.7-14-7-25.7-7H163.5c-12,0-20.7,2.3-25.9,7-5.5,4.6-8.1,12-8.1,22v27.8c0,10.1,2.6,17.6,8.1,22.2,5.4,4.6,14.1,6.9,25.9,6.9h282.4c11.7,0,20.1-2.3,25.7-6.9,5.5-4.6,8.1-12.1,8.1-22.2v-27.8c0-10-2.6-17.4-8.1-22ZM289.9,160.7c0,3.3-2.7,5.9-6,5.9h-117.6c-3.3,0-5.9-2.6-5.9-5.9v-18.8c0-3.3,2.6-5.9,5.9-5.9h117.6c3.3,0,6,2.6,6,5.9v18.8ZM448.9,160.7c0,3.3-2.6,5.9-5.9,5.9h-118.3c-3.3,0-5.9-2.6-5.9-5.9v-18.8c0-3.3,2.6-5.9,5.9-5.9h118.3c3.3,0,5.9,2.6,5.9,5.9v18.8Z"/>
          </svg>
        </Link>
      </div>
      
      {/* Desktop Search */}
      <div className="hidden md:flex flex-1 items-center gap-4">
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search directory..." 
            className="w-full h-9 pl-9 pr-4 rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-border focus:ring-2 focus:ring-primary/10 text-sm font-medium transition-all"
          />
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
