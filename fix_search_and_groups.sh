#!/bin/bash
set -e

cd /Users/Jayapalreddy/.gemini/antigravity/scratch/crm-os-next

# 1. Update the Store to handle Groups completely
cat << 'STORE' > src/lib/store.tsx
"use client";
import React, { createContext, useContext, useState } from 'react';
import { contacts as initialContacts, groups as initialGroups } from './data';

const StoreContext = createContext<any>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
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
      updateContact: (id: number, data: any) => setContacts(contacts.map((c: any) => c.id === id ? { ...c, ...data } : c)),
      deleteContact: (id: number) => setContacts(contacts.filter((c: any) => c.id !== id)),
      
      groups,
      addGroup: (g: any) => setGroups([...groups, g]),
      updateGroup: (id: number, name: string) => setGroups(groups.map((g: any) => g.id === id ? { ...g, name } : g)),
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

# 2. Fix Smart Search safely in Contacts Directory
cat << 'SEARCH' > src/app/contacts/page.tsx
"use client";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, Plus, Filter, 
  Mail, Phone, Building2, Star, ArrowUpRight, Sparkles
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function ContactsDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const { contacts } = useStore();

  const filteredContacts = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') return contacts;
    const query = searchQuery.toLowerCase().trim();
    
    return contacts.filter((c: any) => {
      // Safely check properties
      const name = c.name?.toLowerCase() || '';
      const role = c.role?.toLowerCase() || '';
      const company = c.company?.toLowerCase() || '';
      const location = c.location?.toLowerCase() || '';
      
      const basicMatch = 
        name.includes(query) ||
        role.includes(query) ||
        company.includes(query) ||
        location.includes(query);

      let semanticMatch = false;
      
      // Smart parsing with Regex to avoid crashes on split
      const worksMatch = query.match(/(?:works at|at)\s+(.+)/);
      if (worksMatch && worksMatch[1]) {
        if (company.includes(worksMatch[1].trim())) semanticMatch = true;
      }
      
      const livesMatch = query.match(/(?:lives in|in)\s+(.+)/);
      if (livesMatch && livesMatch[1]) {
        if (location.includes(livesMatch[1].trim())) semanticMatch = true;
      }
      
      if (query.includes("vip") && c.tags?.includes("VIP")) {
        semanticMatch = true;
      }

      return basicMatch || semanticMatch;
    });
  }, [contacts, searchQuery]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Directory</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage and search your professional network.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/contacts/new" className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all bg-foreground text-background hover:bg-foreground/90 hover:scale-105 active:scale-95 h-10 px-5 shadow-lg shadow-black/5">
            <Plus className="w-4 h-4 mr-2" />
            New Contact
          </Link>
        </div>
      </div>

      <div className="relative max-w-3xl mx-auto md:mx-0 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search className="h-5 w-5" />
        </div>
        <input 
          type="text" 
          placeholder="Try 'Works at Google' or 'Lives in New York'..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-11 pr-32 py-4 bg-card border border-border rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-100">
            <Sparkles className="w-3 h-3" /> Smart Search
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact: any, idx: number) => (
          <div 
            key={contact.id} 
            className="group relative bg-card rounded-2xl border border-border/60 hover:border-border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {contact.tags?.includes('VIP') && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            )}
            
            <div className="flex flex-col items-center text-center space-y-4">
              <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} alt={contact.name} className="w-20 h-20 rounded-full bg-secondary border-4 border-background shadow-sm" />
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground tracking-tight">{contact.name}</h3>
                <p className="text-sm font-medium text-primary">{contact.role}</p>
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground mt-1">
                  <Building2 className="w-3.5 h-3.5" /> {contact.company}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/40 grid grid-cols-3 gap-2">
              <a href={`mailto:${contact.email}`} className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors group/btn">
                <Mail className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Email</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors group/btn">
                <Phone className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Call</span>
              </a>
              <Link href={`/contacts/${contact.id}`} className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors group/btn">
                <ArrowUpRight className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">View</span>
              </Link>
            </div>
          </div>
        ))}
        {filteredContacts.length === 0 && (
          <div className="col-span-full py-12 text-center bg-card rounded-2xl border border-dashed">
            <p className="text-muted-foreground font-semibold">No contacts found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
SEARCH

# 3. Create fully functional Groups System
cat << 'GROUPS' > src/app/groups/page.tsx
"use client";
import { useState } from 'react';
import { Layers, Plus, Users, Trash2, Edit2, X, Check } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function GroupsPage() {
  const { groups, addGroup, deleteGroup, contacts, updateContact } = useStore();
  const [activeGroup, setActiveGroup] = useState<any>(null);
  
  // Modals state
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Find contacts that belong to a group (by tag)
  const getContactsInGroup = (groupName: string) => {
    return contacts.filter((c: any) => c.tags?.includes(groupName));
  };

  // Add/Remove contact from active group
  const toggleContactInGroup = (contact: any) => {
    if (!activeGroup) return;
    const hasTag = contact.tags?.includes(activeGroup.name);
    
    let newTags = contact.tags || [];
    if (hasTag) {
      newTags = newTags.filter((t: string) => t !== activeGroup.name);
    } else {
      newTags = [...newTags, activeGroup.name];
    }
    
    updateContact(contact.id, { tags: newTags });
  };

  const handleCreateGroup = (e: any) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    
    const newGroup = {
      id: Date.now(),
      name: newGroupName,
      color: "bg-blue-100 text-blue-600"
    };
    addGroup(newGroup);
    setNewGroupName('');
    setShowNewGroup(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40 shrink-0">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Layers className="w-8 h-8 text-primary" />
            Groups & Cohorts
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Organize your network into distinct event cohorts and lists.</p>
        </div>
        <button 
          onClick={() => setShowNewGroup(true)}
          className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all bg-foreground text-background hover:bg-foreground/90 h-10 px-5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
        {/* Left Column: Group List */}
        <div className="w-full md:w-80 border rounded-2xl bg-card shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b bg-muted/30 font-bold text-sm tracking-wide uppercase text-muted-foreground">All Groups</div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {groups.map((group: any) => {
              const count = getContactsInGroup(group.name).length;
              return (
                <div 
                  key={group.id} 
                  onClick={() => setActiveGroup(group)}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${activeGroup?.id === group.id ? 'bg-primary/10 border-primary/20 border' : 'hover:bg-muted border border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${group.color || 'bg-slate-100 text-slate-600'}`}>
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">{group.name}</span>
                  </div>
                  <span className="text-xs font-bold bg-background border px-2 py-0.5 rounded-full text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Group Details & Contacts */}
        <div className="flex-1 border rounded-2xl bg-card shadow-sm flex flex-col overflow-hidden relative">
          {activeGroup ? (
            <>
              <div className="p-6 border-b flex items-center justify-between bg-muted/10">
                <div>
                  <h2 className="text-2xl font-bold">{activeGroup.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{getContactsInGroup(activeGroup.name).length} members in this group</p>
                </div>
                <button 
                  onClick={() => {
                    deleteGroup(activeGroup.id);
                    setActiveGroup(null);
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">Manage Members</h3>
                <div className="space-y-2">
                  {contacts.map((contact: any) => {
                    const isInGroup = contact.tags?.includes(activeGroup.name);
                    return (
                      <div key={contact.id} className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${isInGroup ? 'bg-primary/5 border-primary/30' : 'bg-background hover:bg-muted'}`}>
                        <div className="flex items-center gap-3">
                          <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} className="w-10 h-10 rounded-full bg-secondary" />
                          <div>
                            <div className="font-semibold text-sm">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">{contact.role}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleContactInGroup(contact)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isInGroup ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                        >
                          {isInGroup ? 'Remove' : 'Add to Group'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <Layers className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-semibold">Select a group to view and manage members</p>
            </div>
          )}
        </div>
      </div>

      {/* New Group Modal */}
      {showNewGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md p-6 rounded-2xl shadow-xl border animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create New Group</h2>
              <button onClick={() => setShowNewGroup(false)} className="text-muted-foreground hover:bg-muted p-2 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Group Name</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Investors 2026" 
                  className="w-full p-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors">
                Save Group
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
GROUPS
