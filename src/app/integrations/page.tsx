"use client";
import { RefreshCw, Mail, Smartphone, Globe, Cloud, Check } from 'lucide-react';

export default function IntegrationsPage() {
  const sources = [
    { name: 'Google Contacts', icon: Mail, status: 'Connected', color: 'text-rose-500', bg: 'bg-rose-50' },
    { name: 'iCloud', icon: Cloud, status: 'Connected', color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Outlook / 365', icon: Mail, status: 'Connect', color: 'text-sky-600', bg: 'bg-sky-50' },
    { name: 'Native iOS / Android', icon: Smartphone, status: 'Connect App', color: 'text-slate-700', bg: 'bg-slate-100' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl">
      <div className="space-y-1.5">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary" />
          Sync & Integrations
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Keep one clean, always-current address book across every account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sources.map((s, i) => {
          const Icon = s.icon;
          const connected = s.status === 'Connected';
          return (
            <div key={i} className="p-6 rounded-2xl border bg-card shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{s.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">Two-way real-time sync</p>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${connected ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                {connected ? <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Synced</span> : s.status}
              </button>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <h3 className="text-xl font-bold mb-2">Automate with your stack</h3>
        <p className="text-sm text-muted-foreground mb-6">Pipe your contacts wherever work happens via Zapier, Salesforce, and LinkedIn.</p>
        <div className="flex flex-wrap gap-3">
          {['Zapier', 'LinkedIn', 'Salesforce', 'HubSpot', 'Slack', 'Notion', 'Developer API'].map(app => (
            <div key={app} className="px-4 py-2 rounded-full border bg-muted/30 text-sm font-semibold text-foreground flex items-center gap-2 hover:bg-muted cursor-pointer transition-colors">
              <Globe className="w-4 h-4 text-muted-foreground" /> {app}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
