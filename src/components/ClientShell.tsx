"use client";

import { usePathname } from 'next/navigation';
import AuthGuard from './AuthGuard';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileBottomNav from './MobileBottomNav';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard>
      {pathname === "/login" ? (
        children
      ) : (
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
          {/* Desktop Sidebar (hidden on mobile) */}
          <Sidebar />

          {/* Main viewport area */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            <Topbar />
            
            <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8 md:pb-8">
              {children}
            </main>

            {/* Native Mobile Bottom Navigation Bar */}
            <MobileBottomNav />
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
