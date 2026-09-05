"use client";
import { Settings, Shield, Bell, User, Save } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'Push Notifications': true,
    'Email Summaries': false,
    'Two-Factor Auth': false,
    'Biometric Login': true
  });

  const [profile, setProfile] = useState({
    name: 'Executive User',
    email: 'executive@example.com',
    password: ''
  });

  const toggle = (key: string) => setToggles(p => ({ ...p, [key]: !p[key] }));

  const sections = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { name: "Push Notifications", desc: "Get alerts for duplicates and updates." },
        { name: "Email Summaries", desc: "Weekly digest of your network growth." }
      ]
    },
    {
      title: "Security",
      icon: Shield,
      items: [
        { name: "Two-Factor Auth", desc: "Require a code when logging in." },
        { name: "Biometric Login", desc: "Use FaceID/TouchID on supported devices." }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="space-y-1.5 px-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Manage your profile, preferences, and security.</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings Form */}
        <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-border/40 pb-4">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Profile Settings</h2>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/30 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium transition-all outline-none" 
                placeholder="Your full name" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={e => setProfile({...profile, email: e.target.value})}
                className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/30 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium transition-all outline-none" 
                placeholder="you@example.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">New Password</label>
              <input 
                type="password" 
                value={profile.password}
                onChange={e => setProfile({...profile, password: e.target.value})}
                className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/30 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium transition-all outline-none" 
                placeholder="••••••••" 
              />
              <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">Leave blank to keep your current password.</p>
            </div>
            <div className="pt-2">
              <button className="flex items-center justify-center gap-2 w-full sm:w-auto h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] rounded-xl text-sm font-bold transition-all shadow-sm">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Toggle Sections */}
        {sections.map((sec, idx) => (
          <div key={idx} className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-border/40 pb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                <sec.icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold tracking-tight">{sec.title}</h2>
            </div>
            
            <div className="space-y-6">
              {sec.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm tracking-tight text-foreground truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggle(item.name)}
                    className={`shrink-0 w-12 h-6 rounded-full flex items-center px-1 transition-colors ${toggles[item.name] ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${toggles[item.name] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
