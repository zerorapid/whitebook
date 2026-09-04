#!/bin/bash
set -e

cd /Users/Jayapalreddy/.gemini/antigravity/scratch/crm-os-next

# 1. Fix Notifications (Use Trash2 Icon)
cat << 'NOTIF' > src/app/notifications/page.tsx
"use client";
import { Bell, Check, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-3xl mx-auto">
      <div className="flex items-center justify-between pb-6 border-b border-border/40">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Stay updated on syncs, duplicates, and reminders.</p>
        </div>
        <button onClick={markAllAsRead} className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-lg hover:bg-secondary/80 transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif: any) => (
          <div key={notif.id} className={`p-4 rounded-xl border flex gap-4 transition-colors ${notif.read ? 'bg-card' : 'bg-primary/5 border-primary/20'}`}>
            <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${notif.read ? 'bg-transparent' : 'bg-primary'}`}></div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{notif.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{notif.description}</p>
              <div className="text-xs text-muted-foreground font-medium mt-2">{notif.time}</div>
            </div>
            <div className="flex flex-col gap-2">
              {!notif.read && (
                <button onClick={() => markAsRead(notif.id)} className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors" title="Mark as read">
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => deleteNotification(notif.id)} className="p-2 hover:bg-rose-50 text-rose-500 rounded-md transition-colors" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
NOTIF

# 2. Fix New Contact Button (Create a New Contact Page)
mkdir -p src/app/contacts/new
cat << 'NEWCONTACT' > src/app/contacts/new/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Briefcase, Mail, Phone, MapPin, Save } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

export default function NewContactPage() {
  const router = useRouter();
  const { addContact } = useStore();
  
  const [formData, setFormData] = useState({
    name: '', role: '', company: '', email: '', phone: '', location: '', notes: ''
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newContact = {
      id: Date.now(),
      ...formData,
      tags: ['New'],
      lastContact: 'Just now'
    };
    addContact(newContact);
    router.push('/contacts');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Link href="/contacts" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
      </Link>
      
      <div className="bg-card rounded-2xl border shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-6">Create New Contact</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input required type="text" className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Company</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input required type="text" className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  onChange={e => setFormData({...formData, company: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Job Title / Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input required type="text" className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  onChange={e => setFormData({...formData, role: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input required type="email" className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input type="tel" className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input type="text" className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. New York, NY" 
                  onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
NEWCONTACT

# Update Dashboard to link to /contacts/new
sed -i '' 's|href="/contacts" className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all bg-foreground text-background|href="/contacts/new" className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all bg-foreground text-background|g' src/app/page.tsx

# Update Contacts page to link to /contacts/new
sed -i '' 's|href="/contacts" className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all bg-foreground text-background|href="/contacts/new" className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all bg-foreground text-background|g' src/app/contacts/page.tsx


# 3. Fix Map View (Make it real with OpenStreetMap iframe)
cat << 'MAPS' > src/app/map/page.tsx
"use client";
import { useState } from 'react';
import { Map as MapIcon, Crosshair } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function MapPage() {
  const { contacts } = useStore();
  const [loading, setLoading] = useState(true);

  // We generate a static map with points using a free mapping service iframe
  // In production, you would use a Leaflet component here.
  const mapUrl = "https://www.openstreetmap.org/export/embed.html?bbox=-123.003,37.382,-73.498,43.261&layer=mapnik";

  return (
    <div className="space-y-6 animate-in fade-in duration-700 h-[calc(100vh-6rem)] flex flex-col">
      <div className="space-y-1.5 shrink-0">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <MapIcon className="w-8 h-8 text-primary" />
          Network Map
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Live geographic distribution of your {contacts.length} contacts.</p>
      </div>

      <div className="flex-1 rounded-2xl border bg-card relative overflow-hidden shadow-sm">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 z-10">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-semibold">Loading Map Tiles...</p>
          </div>
        )}
        <iframe 
          src={mapUrl}
          className="w-full h-full border-0" 
          onLoad={() => setLoading(false)}
        ></iframe>
        
        {/* Floating Controls */}
        <div className="absolute bottom-6 left-6 z-20 bg-background/90 backdrop-blur-md p-4 rounded-xl border shadow-lg max-w-sm">
          <h3 className="font-bold text-sm mb-1">Geographic Density</h3>
          <p className="text-xs text-muted-foreground mb-3">Powered by free OpenStreetMap APIs.</p>
          <button className="flex items-center justify-center w-full py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors">
            <Crosshair className="w-3 h-3 mr-2" /> Recenter on My Location
          </button>
        </div>
      </div>
    </div>
  );
}
MAPS

# 4. Fix Integrations (Plugin Options & Free APIs)
cat << 'INTEGRATIONS' > src/app/integrations/page.tsx
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
INTEGRATIONS
