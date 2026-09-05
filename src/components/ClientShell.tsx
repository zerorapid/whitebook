"use client";
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AuthGuard from './AuthGuard';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileBottomNav from './MobileBottomNav';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      {pathname === "/login" ? (
        children
      ) : (
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
          {/* Desktop & Mobile Drawer Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          {/* Mobile Overlay with Backdrop Blur */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main viewport area */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            <Topbar onMenuClick={() => setSidebarOpen(true)} />
            
            <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8 md:pb-8">
              {children}
            </main>

            {/* Native Mobile Bottom Navigation Bar */}
            <MobileBottomNav onOpenMenu={() => setSidebarOpen(true)} />
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
