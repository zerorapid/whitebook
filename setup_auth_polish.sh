#!/bin/bash
set -e
cd /Users/Jayapalreddy/.gemini/antigravity/scratch/crm-os-next

echo "1. Creating AuthGuard..."
cat << 'AUTHGUARD' > src/components/AuthGuard.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session && pathname !== '/login') {
        router.push('/login');
      } else if (session && pathname === '/login') {
        router.push('/');
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session && pathname !== '/login') {
        router.push('/login');
      } else if (session && pathname === '/login') {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#18181b] text-white">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user && pathname !== '/login') return null;

  return <>{children}</>;
}
AUTHGUARD

echo "2. Creating Login Page..."
mkdir -p src/app/login
cat << 'LOGIN' > src/app/login/page.tsx
"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Success! Please check your email for a confirmation link, or log in if auto-confirm is enabled.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#18181b] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">White Book</h1>
          <p className="text-white/50 mt-2 text-sm">Secure Private Network Directory</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center font-medium">{error}</div>}
          
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-white/90 font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In')}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            className="text-white/50 hover:text-white text-sm font-medium transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
LOGIN

echo "3. Updating ClientShell.tsx to hide Sidebar on Login..."
node -e "
const fs = require('fs');
let content = fs.readFileSync('src/components/ClientShell.tsx', 'utf8');

// Add imports
content = content.replace(
  'import { useState } from \'react\';',
  'import { useState } from \'react\';\\nimport { usePathname } from \'next/navigation\';\\nimport AuthGuard from \'./AuthGuard\';'
);

// Add logic
content = content.replace(
  'export default function ClientShell({ children }: { children: React.ReactNode }) {',
  'export default function ClientShell({ children }: { children: React.ReactNode }) {\\n  const pathname = usePathname();'
);

content = content.replace(
  'return (\\n    <div className=\"flex h-screen overflow-hidden bg-muted/40\">',
  \`return (
    <AuthGuard>
      {pathname === '/login' ? (
        children
      ) : (
        <div className="flex h-screen overflow-hidden bg-muted/40">\`
);

content = content.replace(
  '</main>\\n      </div>\\n    </div>\\n  );',
  '</main>\\n      </div>\\n    </div>\\n      )}\\n    </AuthGuard>\\n  );'
);

fs.writeFileSync('src/components/ClientShell.tsx', content);
"

echo "4. Updating Store to use user_id..."
node -e "
const fs = require('fs');
let content = fs.readFileSync('src/lib/store.tsx', 'utf8');

content = content.replace(
  'const payload = { ...c };',
  \`const payload = { ...c };
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) payload.user_id = session.user.id;\`
);

fs.writeFileSync('src/lib/store.tsx', content);
"

echo "5. Updating Sidebar to add Logout..."
node -e "
const fs = require('fs');
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

content = content.replace(
  'import { usePathname } from \'next/navigation\';',
  'import { usePathname, useRouter } from \'next/navigation\';\\nimport { supabase } from \'@/lib/supabase\';'
);

content = content.replace(
  'const pathname = usePathname();',
  'const pathname = usePathname();\\n  const router = useRouter();\\n  const handleLogout = async () => {\\n    await supabase.auth.signOut();\\n    router.push(\\'/login\\');\\n  };'
);

content = content.replace(
  '</div>\\n    </div>\\n  );',
  '</div>\\n      \\n      <div className=\"px-6 pb-6\">\\n        <button onClick={handleLogout} className=\"w-full py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg text-sm font-medium transition-colors\">\\n          Log Out\\n        </button>\\n      </div>\\n    </div>\\n  );'
);

fs.writeFileSync('src/components/Sidebar.tsx', content);
"

echo "Setup Complete!"
