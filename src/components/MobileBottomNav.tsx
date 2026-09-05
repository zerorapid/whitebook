"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Users, Map, ScanLine, Sparkles, LayoutGrid, 
  Settings, Home, Layers, RefreshCw, LifeBuoy, LogOut, X 
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push('/login');
  };

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Directory', href: '/contacts', icon: Users },
    { name: 'Scan', href: '/scanner', icon: ScanLine, isAction: true },
    { name: 'Features', icon: LayoutGrid, isMenu: true },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const moreFeatures = [
    { name: 'Map View', href: '/map', icon: Map },
    { name: 'AI Assistant', href: '/assistant', icon: Sparkles, badge: 'AI' },
    { name: 'Groups & Tags', href: '/groups', icon: Layers },
    { name: 'Integrations', href: '/integrations', icon: RefreshCw },
    { name: 'Support', href: '/support', icon: LifeBuoy },
  ];

  return (
    <>
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border/60 pb-[env(safe-area-inset-bottom,12px)] pt-1.5 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href ? (pathname === item.href || (item.href === '/contacts' && pathname.startsWith('/contacts/'))) : false;

            if (item.isAction) {
              return (
                <Link
                  key={item.name}
                  href={item.href!}
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

            if (item.isMenu) {
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setIsMenuOpen(true)}
                  className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all relative ${
                    isMenuOpen ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isMenuOpen ? 'stroke-[2.5] scale-105' : 'stroke-[1.8]'}`} />
                  <span className={`text-[10px] mt-1 tracking-tight ${isMenuOpen ? 'font-bold text-foreground' : 'font-medium'}`}>
                    {item.name}
                  </span>
                  {isMenuOpen && <span className="w-1 h-1 bg-foreground rounded-full mt-0.5" />}
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href!}
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

      {/* Features Bottom Sheet Overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Features Bottom Sheet */}
      <div className={`md:hidden fixed inset-x-0 bottom-0 z-50 bg-background border-t border-border/40 shadow-2xl rounded-t-3xl transition-transform duration-300 ease-out transform ${
        isMenuOpen ? 'translate-y-0' : 'translate-y-full'
      } pb-[env(safe-area-inset-bottom,20px)]`}>
        <div className="flex items-center justify-between p-5 pb-3 border-b border-border/30">
          <h2 className="text-lg font-bold tracking-tight">More Features</h2>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 grid grid-cols-4 gap-4">
          {moreFeatures.map((feat) => {
            const FeatIcon = feat.icon;
            return (
              <Link 
                key={feat.name} 
                href={feat.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center relative transition-colors">
                  <FeatIcon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                  {feat.badge && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm">
                      {feat.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-center leading-tight">
                  {feat.name}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="px-4 pb-4 mt-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-500/10 text-red-600 font-semibold hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
