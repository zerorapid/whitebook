"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, Map, ScanLine, Sparkles, LayoutGrid, 
  Settings, Home, Layers, RefreshCw, LifeBuoy, LogOut, X 
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Directory', href: '/contacts', icon: Users },
    { name: 'Assistant', href: '/assistant', icon: Sparkles, isAction: true },
    { name: 'Features', href: '/menu', icon: LayoutGrid },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border/60 pb-[env(safe-area-inset-bottom,12px)] pt-1.5 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/contacts' && pathname.startsWith('/contacts/'));

          if (item.isAction) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative -top-3 group flex flex-col items-center"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 border-2 border-background ${
                  isActive 
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/20' 
                    : 'bg-primary text-primary-foreground hover:scale-105'
                }`}>
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className={`text-[10px] font-bold mt-1 tracking-tight ${
                  isActive ? 'text-foreground font-extrabold' : 'text-muted-foreground'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all relative ${
                isActive 
                  ? 'text-foreground font-bold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5] scale-105' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold text-foreground' : 'font-medium'}`}>
                {item.name}
              </span>
              {isActive && <span className="w-1 h-1 bg-foreground rounded-full mt-0.5" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
