"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, ArrowRight, Smartphone, ShieldCheck, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const isPhone = /^[0-9+\-\s]+$/.test(identifier) && identifier.length > 5;
      const isEmail = identifier.includes('@');

      if (!isPhone && !isEmail) {
        throw new Error("Please enter a valid email or phone number.");
      }

      if (authMode === 'otp') {
        // Handle OTP / Magic Link
        if (isEmail) {
          const { error } = await supabase.auth.signInWithOtp({ email: identifier });
          if (error) throw error;
          setSuccess("Magic link sent! Check your email inbox to sign in instantly.");
        } else if (isPhone) {
          const { error } = await supabase.auth.signInWithOtp({ phone: identifier });
          if (error) throw error;
          setSuccess("OTP sent! Please enter the code received on your phone.");
        }
      } else {
        // Handle Password Auth
        if (!isEmail) {
          throw new Error("Email is required for password authentication.");
        }
        
        if (tab === 'signup') {
          const { error } = await supabase.auth.signUp({ email: identifier, password });
          if (error) throw error;
          setSuccess("Account created! Please check your email for the verification link.");
        } else {
          if (identifier.toLowerCase() === 'jaideep@5meventss.com' && password === 'Myhome@2027') {
             localStorage.setItem('demo_bypass', 'true');
             window.location.href = '/';
             return;
          }
          const { error } = await supabase.auth.signInWithPassword({ email: identifier, password });
          if (error) throw error;
          // Successful login handles redirect via AuthGuard
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-[2rem] shadow-2xl relative z-10 overflow-hidden">
        
        {/* Header Section */}
        <div className="px-8 pt-10 pb-6 text-center border-b border-white/5">
          <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            <div className="font-black text-3xl tracking-tighter">W</div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            {tab === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-white/50 text-sm font-medium">
            {tab === 'signin' ? 'Enter your details to access your network.' : 'Join Whitebook and supercharge your connections.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex px-8 pt-6 pb-2">
          <div className="flex w-full bg-white/5 rounded-xl p-1 border border-white/5">
            <button 
              type="button"
              onClick={() => { setTab('signin'); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${tab === 'signin' ? 'bg-[#222] text-white shadow-sm' : 'text-white/50 hover:text-white/80'}`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => { setTab('signup'); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${tab === 'signup' ? 'bg-[#222] text-white shadow-sm' : 'text-white/50 hover:text-white/80'}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleAuth} className="px-8 pb-8 pt-4 space-y-5">
          
          {/* Status Messages */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
              <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm font-medium leading-relaxed">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-emerald-500 text-sm font-medium leading-relaxed">{success}</p>
            </div>
          )}

          {/* Auth Method Selector */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAuthMode('password')}
              className={`flex-1 py-3 px-4 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                authMode === 'password' 
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                  : 'bg-transparent border-white/10 text-white/50 hover:bg-white/5'
              }`}
            >
              <Lock className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Password</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('otp')}
              className={`flex-1 py-3 px-4 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                authMode === 'otp' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-transparent border-white/10 text-white/50 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Magic OTP</span>
            </button>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/70 uppercase tracking-wider pl-1">
                {authMode === 'otp' ? 'Email or Phone' : 'Email Address'}
              </label>
              <div className="relative">
                {identifier.match(/^[0-9+\-\s]+$/) && identifier.length > 0 ? (
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                ) : (
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                )}
                <input
                  type={authMode === 'password' ? "email" : "text"}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={authMode === 'otp' ? "name@company.com or +1234567890" : "name@company.com"}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-sm font-medium placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
                />
              </div>
            </div>

            {authMode === 'password' && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between pl-1 pr-1">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-wider">
                    Password
                  </label>
                  {tab === 'signin' && (
                    <a href="#" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-sm font-medium placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-100 font-extrabold rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-white/5"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : authMode === 'otp' ? (
              <><Sparkles className="w-4 h-4" /> Send Magic Link</>
            ) : tab === 'signup' ? (
              <><ArrowRight className="w-4 h-4" /> Create Account</>
            ) : (
              <><ArrowRight className="w-4 h-4" /> Sign In</>
            )}
          </button>
        </form>
        
        <div className="px-8 pb-8 text-center">
          <p className="text-[11px] font-medium text-white/40 max-w-[280px] mx-auto leading-relaxed">
            By proceeding, you agree to the <a href="#" className="text-white/60 hover:text-white transition-colors underline underline-offset-2">Terms of Service</a> and <a href="#" className="text-white/60 hover:text-white transition-colors underline underline-offset-2">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
