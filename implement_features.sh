#!/bin/bash
set -e

cd /Users/Jayapalreddy/.gemini/antigravity/scratch/crm-os-next

# 1. Update the Store to include new data models (Follow-ups, duplicates, etc)
cat << 'STORE' > src/lib/store.tsx
"use client";
import React, { createContext, useContext, useState } from 'react';
import { contacts as initialContacts, groups as initialGroups } from './data';

const StoreContext = createContext<any>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  // Enhanced Contacts with birthdays, follow-ups, and locations
  const enhancedContacts = initialContacts.map((c: any, i: number) => ({
    ...c,
    birthday: i % 3 === 0 ? 'Oct 12' : null,
    followUp: i % 4 === 0 ? 'Tomorrow' : null,
    locationCoords: { lat: 40.7128 + (Math.random() * 0.1), lng: -74.0060 + (Math.random() * 0.1) },
    notes: "Met at the annual conference. " + (c.notes || "")
  }));

  const [contacts, setContacts] = useState(enhancedContacts);
  const [groups, setGroups] = useState(initialGroups);
  
  const [duplicates, setDuplicates] = useState([
    { id: 1, name: "David Kim", match: "David K.", confidence: "98%" },
    { id: 2, name: "Sarah Chen", match: "Sarah C.", confidence: "95%" }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: 'Sync Complete', description: 'Google Contacts synced successfully. 12 updated.', time: 'Just now', read: false },
    { id: 2, type: 'message', title: '2 Duplicates Found', description: 'AI detected 2 overlapping contacts.', time: '1 hr ago', read: false },
  ]);

  return (
    <StoreContext.Provider value={{
      contacts,
      addContact: (c: any) => setContacts([...contacts, c]),
      deleteContact: (id: number) => setContacts(contacts.filter((c: any) => c.id !== id)),
      
      groups,
      deleteGroup: (id: number) => setGroups(groups.filter((g: any) => g.id !== id)),

      duplicates,
      resolveDuplicate: (id: number) => setDuplicates(duplicates.filter(d => d.id !== id)),

      notifications,
      markAsRead: (id: number) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n)),
      markAllAsRead: () => setNotifications(notifications.map(n => ({ ...n, read: true }))),
      deleteNotification: (id: number) => setNotifications(notifications.filter(n => n.id !== id)),
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
STORE

# 2. Update Sidebar
cat << 'SIDEBAR' > src/components/Sidebar.tsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, Layers, Settings, LifeBuoy,
  Scan, Sparkles, Map, RefreshCw
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Directory', href: '/contacts', icon: Users },
    { name: 'Map View', href: '/map', icon: Map },
    { name: 'Groups & Tags', href: '/groups', icon: Layers },
  ];

  const tools = [
    { name: 'AI Assistant', href: '/assistant', icon: Sparkles },
    { name: 'Card Scanner', href: '/scanner', icon: Scan },
    { name: 'Sync & Integrations', href: '/integrations', icon: RefreshCw },
  ];

  const system = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Support', href: '/support', icon: LifeBuoy },
  ];

  const renderLinks = (links: any[]) => (
    <ul className="space-y-1">
      {links.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <li key={item.name}>
            <Link href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
              <Icon className="w-4 h-4" />
              {item.name}
              {item.name === 'AI Assistant' && <span className="ml-auto bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">2</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#18181b] text-white flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 618.8 200.3" className="h-5 w-auto fill-current text-white">
            <path d="M38.9,93.6L10.6,16.2h28.1l13.2,44.1,3,11.5h1.3l1.7-7.6,13.6-47.9h30.3l14.4,47.9,2.4,7.6h1.3l3-11.5,12-44.1h27.7l-1.3,7.9-27.2,69.5h-30.3l-14-42.6-2.6-11.1h-1.3l-2.5,11.1-13.9,42.6h-30.7Z"/>
            <path d="M191.8,93.6V16.1h25.5v29.6h41v-29.6h25.3v77.6h-25.3v-30.1h-41v30.1h-25.5Z"/>
            <path d="M323.2,93.6V16.1h25.3v77.6h-25.3Z"/>
            <path d="M411.6,93.6v-59.8h-31.4V15.9h88.8v17.9h-31.8v59.8h-25.6Z"/>
            <path d="M500.6,93.6V16.1h84.7v17.9h-59v10.9h43.7v18.3h-43.7v12.3h56.9l7.9,16.6c0,.3-1.2.7-3.6,1-2.4.3-6.5.5-12.3.5h-74.7Z"/>
            <path d="M15.2,194.6v-86.1h66.6c9.2,0,15.8,1.8,20,5.5,4.2,3.7,6.3,8.1,6.3,13.2v4.4c0,4-.9,7.3-2.6,9.9-1.7,2.6-3.5,4.4-5.5,5.5,4.3,1.4,7.7,3.7,10.2,7.1,2.5,3.4,3.8,7.8,3.8,13.2v2.6c0,2.9-.3,5.8-1,8.8-.7,2.9-2,5.6-3.9,8-1.9,2.4-4.6,4.3-8,5.8-3.5,1.5-8,2.2-13.5,2.2H15.2ZM43.7,141.7h29.2c2.5,0,4.3-.5,5.3-1.6,1-1.1,1.5-2.5,1.5-4.4v-1.5c0-2-.5-3.5-1.5-4.4-1-.9-3.2-1.3-6.6-1.3h-27.9v13.1ZM43.7,174.6h35.2c2.5,0,4.3-.5,5.3-1.4s1.5-2.4,1.5-4.5v-2.6c0-1.8-.6-3.3-1.9-4.3s-3.5-1.5-6.6-1.5h-33.5v14.3Z"/>
            <path d="M589.4,192.9c-4.6,0-9.1-.9-13.4-2.7-4.3-1.8-8.2-4.4-11.5-7.5-1.7-1.7-3.4-3.4-5.1-5-1.7-1.7-3.4-3.4-5.1-5-3.6-3.5-7.4-6.4-11.4-8.5-4-2.1-9-3.1-15-3.1h-1.4s.2,30.9.2,30.9l-27.1.2-.5-71.6-1.5-11.3,28.5-.2.2,32.6h4.2c1.6,0,2.8-.3,3.7-.7.9-.4,1.8-1.2,2.9-2.3,2.2-2.5,4.7-5.5,7.5-9,2.7-3.6,5.4-7.2,8.1-10.9,2.7-3.7,4.9-7,6.8-9.8l34.5-.2-5.7,8.5c-2.3,2.6-4.9,5.3-7.8,8.4-2.8,3-5.7,6-8.5,8.9-2.8,2.9-5.4,5.5-7.7,7.9-2.3,2.4-4.2,4.2-5.6,5.5,2.9,1.2,5.5,2.6,7.6,4.1,2.2,1.5,4.5,3.3,7.1,5.2,2.4,1.8,4.4,3.4,6.2,4.9,1.7,1.5,3.8,3.2,6.3,5,5.1,3.9,9.5,6.3,13.2,7.3,3.7,1,6.1,1.4,7.1,1.4l-5.5,15.7c-.9.3-2.4.6-4.4.9-2,.3-4.3.5-7,.5Z"/>
            <path d="M471.7,115.4c-5.4-4.7-14-7-25.7-7H163.5c-12,0-20.7,2.3-25.9,7-5.5,4.6-8.1,12-8.1,22v27.8c0,10.1,2.6,17.6,8.1,22.2,5.4,4.6,14.1,6.9,25.9,6.9h282.4c11.7,0,20.1-2.3,25.7-6.9,5.5-4.6,8.1-12.1,8.1-22.2v-27.8c0-10-2.6-17.4-8.1-22ZM289.9,160.7c0,3.3-2.7,5.9-6,5.9h-117.6c-3.3,0-5.9-2.6-5.9-5.9v-18.8c0-3.3,2.6-5.9,5.9-5.9h117.6c3.3,0,6,2.6,6,5.9v18.8ZM448.9,160.7c0,3.3-2.6,5.9-5.9,5.9h-118.3c-3.3,0-5.9-2.6-5.9-5.9v-18.8c0-3.3,2.6-5.9,5.9-5.9h118.3c3.3,0,5.9,2.6,5.9,5.9v18.8Z"/>
          </svg>
        </div>
        {onClose && <button className="md:hidden text-white/50" onClick={onClose}>&times;</button>}
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-3 mb-8">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">Core</div>
          {renderLinks(navigation)}
        </div>
        
        <div className="px-3 mb-8">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">Smart Tools</div>
          {renderLinks(tools)}
        </div>

        <div className="px-3 mb-8">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">System</div>
          {renderLinks(system)}
        </div>
      </div>
    </div>
  );
}
SIDEBAR

# 3. Create AI Assistant (Deduplication/Enrichment) Page
mkdir -p src/app/assistant
cat << 'ASSISTANT' > src/app/assistant/page.tsx
"use client";
import { Sparkles, Merge, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function AssistantPage() {
  const { duplicates, resolveDuplicate } = useStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl">
      <div className="space-y-1.5">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Assistant
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Smart contact management: deduplicate, enrich, and clean your network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Merge className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-1">Duplicate Management</h3>
          <p className="text-sm text-muted-foreground mb-4">We found {duplicates.length} overlapping contacts across your accounts.</p>
          
          <div className="space-y-3">
            {duplicates.map((dupe: any) => (
              <div key={dupe.id} className="p-4 rounded-xl border bg-muted/30 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{dupe.name} <span className="text-muted-foreground font-normal">matches</span> {dupe.match}</div>
                  <div className="text-xs text-primary font-medium mt-1">{dupe.confidence} Match Confidence</div>
                </div>
                <button onClick={() => resolveDuplicate(dupe.id)} className="px-3 py-1.5 bg-background border shadow-sm rounded-lg text-xs font-semibold hover:bg-muted transition-colors">
                  Merge
                </button>
              </div>
            ))}
            {duplicates.length === 0 && (
              <div className="text-sm text-emerald-600 flex items-center gap-2 font-medium p-4 bg-emerald-50 rounded-xl">
                <CheckCircle2 className="w-4 h-4" /> All contacts are deduplicated.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-1">Contact Enrichment</h3>
          <p className="text-sm text-muted-foreground mb-4">AI automatically searches public profiles to fill in missing job titles and photos.</p>
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <span className="font-semibold block mb-1">Auto-Enrichment is Active</span>
              Your contacts are automatically updated daily with the latest LinkedIn and public data.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
ASSISTANT

# 4. Create Scanner Page
mkdir -p src/app/scanner
cat << 'SCANNER' > src/app/scanner/page.tsx
"use client";
import { useState } from 'react';
import { Scan, Camera, Upload, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Scan className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Business Card Scanner</h1>
        <p className="text-muted-foreground text-sm font-medium">Snap a card and our AI will transcribe it into a structured contact in seconds.</p>
      </div>

      {!scanned ? (
        <div className="rounded-3xl border-2 border-dashed border-border/60 bg-card/50 p-12 text-center hover:bg-muted/30 transition-colors cursor-pointer group" onClick={handleScan}>
          {scanning ? (
            <div className="space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold text-primary animate-pulse">Extracting contact details via AI...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-background border shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform"><Camera className="w-5 h-5 text-muted-foreground" /></div>
                <div className="w-12 h-12 rounded-full bg-background border shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform"><Upload className="w-5 h-5 text-muted-foreground" /></div>
              </div>
              <div>
                <p className="text-base font-semibold">Click to capture or upload card</p>
                <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, and PDF</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-8 shadow-lg animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <h3 className="text-lg font-bold">Transcription Complete</h3>
          </div>
          <div className="space-y-4 bg-muted/30 p-4 rounded-xl border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Full Name</label>
                <div className="font-medium">Alexander Pierce</div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Company</label>
                <div className="font-medium">Stark Industries</div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email</label>
                <div className="font-medium text-primary">alex@stark.com</div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Phone</label>
                <div className="font-medium">+1 (555) 019-2834</div>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 bg-primary text-primary-foreground h-11 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
            Save Contact <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
SCANNER

# 5. Create Integrations Page
mkdir -p src/app/integrations
cat << 'INTEGRATIONS' > src/app/integrations/page.tsx
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
INTEGRATIONS

# 6. Make Dashboard show Birthdays and Follow Ups
cat << 'DASH' > src/app/page.tsx
"use client";
import Link from 'next/link';
import { 
  Users, Plus, Search, 
  MoreHorizontal, Mail, Sparkles, 
  FileText, TrendingUp, AlertCircle, CalendarClock,
  ChevronRight, ArrowUpRight, Gift
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Dashboard() {
  const { contacts } = useStore();
  const followUps = contacts.filter((c: any) => c.followUp);
  const birthdays = contacts.filter((c: any) => c.birthday);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground text-sm font-medium">Your entire network synced, deduplicated, and enriched.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <h3 className="tracking-tight text-sm font-semibold text-muted-foreground uppercase">Total Synced</h3>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Users className="h-4 w-4" /></div>
          </div>
          <div className="text-3xl font-bold tracking-tight">{contacts.length}</div>
        </div>
        <div className="group rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <h3 className="tracking-tight text-sm font-semibold text-muted-foreground uppercase">Follow-ups</h3>
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><CalendarClock className="h-4 w-4" /></div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-amber-600">{followUps.length}</div>
        </div>
        <div className="group rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <h3 className="tracking-tight text-sm font-semibold text-muted-foreground uppercase">Birthdays</h3>
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500"><Gift className="h-4 w-4" /></div>
          </div>
          <div className="text-3xl font-bold tracking-tight">{birthdays.length}</div>
        </div>
        <div className="group rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <h3 className="tracking-tight text-sm font-semibold text-muted-foreground uppercase">AI Updates</h3>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Sparkles className="h-4 w-4" /></div>
          </div>
          <div className="text-3xl font-bold tracking-tight">12</div>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-bold tracking-tight">Pending Follow-ups</h3>
          </div>
          <div className="p-2">
            {followUps.map((contact: any) => (
              <div key={contact.id} className="p-3 rounded-xl flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} alt="" className="w-10 h-10 rounded-full bg-secondary" />
                  <div>
                    <div className="font-semibold text-sm">{contact.name}</div>
                    <div className="text-xs font-medium text-amber-600">Due {contact.followUp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-bold tracking-tight">Upcoming Birthdays</h3>
          </div>
          <div className="p-2">
            {birthdays.map((contact: any) => (
              <div key={contact.id} className="p-3 rounded-xl flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} alt="" className="w-10 h-10 rounded-full bg-secondary" />
                  <div>
                    <div className="font-semibold text-sm">{contact.name}</div>
                    <div className="text-xs font-medium text-muted-foreground">Turns 40 on {contact.birthday}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
DASH

# 7. Add Map Page Placeholder
mkdir -p src/app/map
cat << 'MAP' > src/app/map/page.tsx
"use client";
import { Map as MapIcon, MapPin } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function MapPage() {
  const { contacts } = useStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-700 h-[calc(100vh-6rem)] flex flex-col">
      <div className="space-y-1.5 shrink-0">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <MapIcon className="w-8 h-8 text-primary" />
          Network Map
        </h1>
        <p className="text-muted-foreground text-sm font-medium">See home and work locations of your contacts on a map.</p>
      </div>

      <div className="flex-1 rounded-2xl border-2 border-border/60 bg-muted/10 relative overflow-hidden flex items-center justify-center">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        {/* Mock Pins */}
        <div className="absolute top-1/4 left-1/3 text-rose-500 animate-bounce"><MapPin className="w-8 h-8 fill-rose-100" /></div>
        <div className="absolute top-1/2 left-1/2 text-blue-500"><MapPin className="w-8 h-8 fill-blue-100" /></div>
        <div className="absolute bottom-1/3 right-1/4 text-emerald-500"><MapPin className="w-8 h-8 fill-emerald-100" /></div>

        <div className="z-10 bg-background/80 backdrop-blur-md p-6 rounded-2xl border shadow-lg text-center max-w-sm">
          <MapIcon className="w-10 h-10 mx-auto text-primary mb-3" />
          <h3 className="font-bold text-lg mb-2">Map Integration Required</h3>
          <p className="text-sm text-muted-foreground">Connect a Google Maps or Mapbox API key in Settings to view live location clustering for {contacts.length} contacts.</p>
        </div>
      </div>
    </div>
  );
}
MAP
