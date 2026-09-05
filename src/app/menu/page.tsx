"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Map, Sparkles, Layers, RefreshCw, LifeBuoy, LogOut, ChevronRight
} from 'lucide-react';

export default function MenuPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const moreFeatures = [
    { name: 'AI Assistant', href: '/assistant', icon: Sparkles, badge: 'AI', desc: 'Chat with your smart assistant' },
    { name: 'Groups & Tags', href: '/groups', icon: Layers, desc: 'Manage your contact lists' },
    { name: 'Integrations', href: '/integrations', icon: RefreshCw, desc: 'Sync with other platforms' },
    { name: 'Support', href: '/support', icon: LifeBuoy, desc: 'Get help and documentation' },
  ];

  return (
    <div className="max-w-md mx-auto w-full pb-8 animation-fade-in">
      <div className="mb-6 px-2">
        <h1 className="text-2xl font-extrabold tracking-tight">Features</h1>
        <p className="text-muted-foreground text-sm mt-1">Explore all the tools available in your BlackBook.</p>
      </div>

      <div className="space-y-2">
        {moreFeatures.map((feat) => {
          const FeatIcon = feat.icon;
          return (
            <Link 
              key={feat.name} 
              href={feat.href}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/40 shadow-sm hover:shadow-md hover:border-border transition-all active:scale-[0.98] group"
            >
              <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center relative">
                <FeatIcon className="w-6 h-6 text-primary" />
                {feat.badge && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm">
                    {feat.badge}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate text-card-foreground group-hover:text-primary transition-colors">
                  {feat.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {feat.desc}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
            </Link>
          );
        })}

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all active:scale-[0.98] mt-6"
        >
          <div className="w-12 h-12 shrink-0 rounded-full bg-red-500/20 flex items-center justify-center">
            <LogOut className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <h3 className="font-semibold text-base text-red-600">
              Log Out
            </h3>
            <p className="text-xs text-red-500/70">
              Sign out of your account
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
