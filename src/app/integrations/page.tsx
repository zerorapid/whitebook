"use client";
import { RefreshCw, Mail, Calendar, Linkedin, Phone } from 'lucide-react';
import { useState } from 'react';

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<string[]>(['Google Contacts']);

  const toggle = (name: string) => {
    setConnected(p => p.includes(name) ? p.filter(n => n !== name) : [...p, name]);
  };

  const platforms = [
    { name: "Google Contacts", icon: Mail, desc: "Two-way sync with your Google account.", color: "text-red-500" },
    { name: "Outlook", icon: Calendar, desc: "Import and sync Outlook contacts.", color: "text-blue-500" },
    { name: "LinkedIn", icon: Linkedin, desc: "Enrich contacts with LinkedIn data.", color: "text-blue-700" },
    { name: "iCloud Contacts", icon: Phone, desc: "Sync with your Apple devices.", color: "text-gray-500" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary" />
          Integrations
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Connect external sources to enrich your directory.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {platforms.map((p, i) => {
          const isConnected = connected.includes(p.name);
          return (
            <div key={i} className="bg-card border rounded-3xl p-6 shadow-sm flex flex-col items-center text-center gap-4 transition-all hover:shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <p.icon className={`w-8 h-8 ${p.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
              </div>
              <button 
                onClick={() => toggle(p.name)}
                className={`mt-2 px-6 py-2 rounded-xl font-bold text-sm transition-colors ${isConnected ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
              >
                {isConnected ? 'Connected' : 'Connect'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
}
