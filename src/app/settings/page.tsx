"use client";
import { Settings, Shield, Bell, Globe, Check, User } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'Public Profile': true,
    'Share Contact Info': false,
    'Push Notifications': true,
    'Email Summaries': false,
    'Two-Factor Auth': false,
    'Biometric Login': true
  });

  const toggle = (key: string) => setToggles(p => ({ ...p, [key]: !p[key] }));

  const sections = [
    {
      title: "Profile Settings",
      icon: User,
      items: [
        { name: "Public Profile", desc: "Allow others to discover your professional card." },
        { name: "Share Contact Info", desc: "Include email and phone when sharing your profile." }
      ]
    },
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
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Manage your preferences and security.</p>
      </div>

      <div className="grid gap-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="bg-card border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                <sec.icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">{sec.title}</h2>
            </div>
            
            <div className="space-y-6">
              {sec.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggle(item.name)}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${toggles[item.name] ? 'bg-primary' : 'bg-secondary'}`}
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
