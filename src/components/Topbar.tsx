"use client";
import { useState } from "react";
import Link from 'next/link';
import { Search, Bell, HelpCircle, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();

  return (
    <div className="h-16 border-b border-border bg-background flex items-center justify-between px-6 z-40 sticky top-0">
      <div className="flex items-center flex-1 max-w-md">
        <button className="md:hidden mr-4" onClick={onMenuClick}>
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search contacts, notes, tags..." 
            className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onFocus={() => router.push('/contacts?search=focus')}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Link href="/notifications" className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground text-muted-foreground relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-background"></span>
        </Link>
        <Link href="/support" className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors">
          <HelpCircle className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
