"use client";
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AuthGuard from './AuthGuard';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      {pathname === "/login" ? (
        children
      ) : (
        <div className="flex h-screen overflow-hidden bg-muted/40">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
      )}
    </AuthGuard>
  );
}
