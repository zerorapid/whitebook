"use client";
import { useState } from 'react';
import { RefreshCw, Mail, Smartphone, Globe, Cloud, Check, Key, Plug, ExternalLink } from 'lucide-react';

export default function IntegrationsPage() {
  const [activeSettings, setActiveSettings] = useState<string | null>(null);

  const sources = [
    { id: 'google', name: 'Google Contacts', desc: 'Uses Free Google People API', icon: Mail, status: 'Connected', color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'icloud', name: 'Apple iCloud', desc: 'Sync via App-Specific Password', icon: Cloud, status: 'Connected', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'outlook', name: 'Outlook / 365', desc: 'Uses Microsoft Graph API', icon: Mail, status: 'Connect', color: 'text-sky-600', bg: 'bg-sky-50' },
    { id: 'custom', name: 'Custom REST API', desc: 'Bring your own API key', icon: Plug, status: 'Configure', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto pb-12">
      <div className="space-y-1.5">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary" />
          Integrations & API Plugins
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Configure API connections to keep your directory synced everywhere.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sources.map((s) => {
          const Icon = s.icon;
          const isExpanded = activeSettings === s.id;
          return (
            <div key={s.id} className="rounded-2xl border bg-card shadow-sm overflow-hidden transition-all">
              <div className="p-6 flex items-center justify-between hover:bg-muted/30 cursor-pointer" onClick={() => setActiveSettings(isExpanded ? null : s.id)}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{s.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{s.desc}</p>
                  </div>
                </div>
                <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${s.status === 'Connected' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-secondary text-secondary-foreground'}`}>
                  {s.status === 'Connected' ? <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Synced</span> : s.status}
                </button>
              </div>
              
              {/* Plugin Configuration Drawer */}
              {isExpanded && (
                <div className="p-6 bg-muted/10 border-t border-border animate-in slide-in-from-top-2">
                  <h4 className="font-semibold text-sm mb-4 flex items-center gap-2"><Key className="w-4 h-4" /> API Configuration</h4>
                  
                  {s.id === 'google' ? (
                    <div className="space-y-4">
                      <p className="text-xs text-muted-foreground">White Book uses the <a href="https://developers.google.com/people" className="text-primary hover:underline" target="_blank">Google People API</a> (100% free) to bi-directionally sync contacts.</p>
                      <button className="px-4 py-2 bg-foreground text-background text-sm font-bold rounded-lg hover:bg-foreground/90 transition-all flex items-center gap-2">
                        Revoke OAuth Access
                      </button>
                    </div>
                  ) : s.id === 'custom' ? (
                    <div className="space-y-4 max-w-md">
                      <p className="text-xs text-muted-foreground mb-4">Connect to a proprietary internal CRM or database by providing an API endpoint and Bearer token.</p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Webhook URL</label>
                          <input type="url" placeholder="https://api.yourcompany.com/v1/contacts" className="w-full p-2 bg-background border rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">API Key (Bearer Token)</label>
                          <input type="password" placeholder="••••••••••••••••" className="w-full p-2 bg-background border rounded-lg text-sm" />
                        </div>
                        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 transition-all">Save Plugin Settings</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Client ID</label>
                        <input type="text" className="w-full p-2 bg-background border rounded-lg text-sm" placeholder="Optional for this service" />
                      </div>
                      <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 transition-all">Authenticate Plugin</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
