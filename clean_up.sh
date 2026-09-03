#!/bin/bash
set -e

cd /Users/Jayapalreddy/.gemini/antigravity/scratch/crm-os-next

# 1. Delete Folders
rm -rf src/app/calendar src/app/tasks src/app/reports

# 2. Update Sidebar
node -e "
const fs = require('fs');
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
sidebar = sidebar.replace(/\{ name: 'Calendar', href: '\\/calendar', icon: Calendar \},/, '');
sidebar = sidebar.replace(/\{ name: 'Tasks', href: '\\/tasks', icon: CheckSquare \},/, '');
sidebar = sidebar.replace(/\{ name: 'Reports', href: '\\/reports', icon: BarChart3 \},/, '');
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
"

# 3. Update Store
cat << 'STORE' > src/lib/store.tsx
"use client";
import React, { createContext, useContext, useState } from 'react';
import { contacts as initialContacts, groups as initialGroups } from './data';

const StoreContext = createContext<any>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [groups, setGroups] = useState(initialGroups);
  
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: 'High Priority Network Update', description: 'Action required for 2 contacts.', time: '2 hours ago', read: false },
    { id: 2, type: 'message', title: 'New contact added', description: 'Sarah Chen was added to your directory.', time: '4 hours ago', read: false },
  ]);

  return (
    <StoreContext.Provider value={{
      contacts,
      addContact: (c: any) => setContacts([...contacts, c]),
      deleteContact: (id: number) => setContacts(contacts.filter((c: any) => c.id !== id)),
      
      groups,
      deleteGroup: (id: number) => setGroups(groups.filter((g: any) => g.id !== id)),

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

# 4. Update Dashboard
cat << 'DASH' > src/app/page.tsx
"use client";
import Link from 'next/link';
import { 
  Users, Plus, ArrowRight, Search, 
  MoreHorizontal, Mail, Phone, Coffee, 
  FileText, TrendingUp, AlertCircle, Layers
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Dashboard() {
  const { contacts, groups } = useStore();
  const needsAttention = contacts.filter((c: any) => c.tags.includes('Investor') || c.tags.includes('VIP'));

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your White Book directory overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/contacts" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Contact
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Contacts</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{contacts.length}</div>
          <p className="text-xs text-green-600 font-medium mt-1">+12% from last month</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">VIPs & Investors</h3>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{needsAttention.length}</div>
          <p className="text-xs text-muted-foreground mt-1">High priority network</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Groups</h3>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{groups.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Lists and classifications</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Network Growth</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">Healthy</div>
          <p className="text-xs text-muted-foreground mt-1">Consistent engagement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">2 hours ago</div>
                  <div className="text-sm"><strong>Added new group</strong> for Tech Investors</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Yesterday</div>
                  <div className="text-sm"><strong>Added note</strong> to Elena Rodriguez's profile</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold leading-none tracking-tight">Priority Network</h3>
              <Link href="/contacts" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">View all</Link>
            </div>
            <div className="p-0">
              {needsAttention.map((contact: any) => (
                <div key={contact.id} className="p-4 border-b border-border flex items-center justify-between hover:bg-muted/50 transition-colors last:border-0">
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} 
                      alt={contact.name} 
                      className="w-10 h-10 rounded-full bg-blue-50/50 border border-border p-0.5 flex-shrink-0" 
                    />
                    <div>
                      <div className="font-medium text-sm">{contact.name}</div>
                      <div className="text-xs text-muted-foreground">{contact.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={`mailto:${contact.email}`}
                      className="p-2 hover:bg-accent rounded-md transition-colors text-muted-foreground inline-block"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    <Link 
                      href={`/contacts/${contact.id}`}
                      className="p-2 hover:bg-accent rounded-md transition-colors text-muted-foreground inline-block"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold leading-none tracking-tight">Recent Additions</h3>
              <Link href="/contacts" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">View directory</Link>
            </div>
            <div className="p-6 flex flex-col gap-6">
              {contacts.slice(0, 4).map((contact: any) => (
                <div key={contact.id} className="flex gap-4">
                  <img 
                    src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} 
                    alt={contact.name} 
                    className="w-8 h-8 rounded-full border border-border flex-shrink-0 bg-secondary" 
                  />
                  <div>
                    <div className="text-sm font-medium">{contact.name}</div>
                    <div className="text-xs text-muted-foreground mb-1">{contact.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
DASH

# Remove alerts or old calls in store data
