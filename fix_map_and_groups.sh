#!/bin/bash
set -e
cd /Users/Jayapalreddy/.gemini/antigravity/scratch/crm-os-next

# 1. Update the Store to handle WhatsApp-style cascading changes
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
    { id: 1, type: 'alert', title: 'Sync Complete', description: 'Google Contacts synced successfully.', time: 'Just now', read: false },
  ]);

  return (
    <StoreContext.Provider value={{
      contacts,
      addContact: (c: any) => setContacts([...contacts, c]),
      updateContact: (id: number, data: any) => setContacts(contacts.map((c: any) => c.id === id ? { ...c, ...data } : c)),
      deleteContact: (id: number) => setContacts(contacts.filter((c: any) => c.id !== id)),
      
      groups,
      addGroup: (g: any, initialContactIds: number[] = []) => {
        setGroups([...groups, g]);
        // Instantly add these contacts to the group
        if (initialContactIds.length > 0) {
          setContacts(contacts.map((c: any) => {
            if (initialContactIds.includes(c.id)) {
              const newTags = c.tags ? [...c.tags, g.name] : [g.name];
              return { ...c, tags: Array.from(new Set(newTags)) };
            }
            return c;
          }));
        }
      },
      updateGroup: (id: number, newName: string) => {
        const groupToEdit = groups.find((g: any) => g.id === id);
        if (!groupToEdit) return;
        
        const oldName = groupToEdit.name;
        
        // Update group name
        setGroups(groups.map((g: any) => g.id === id ? { ...g, name: newName } : g));
        
        // Cascade tag change to all members
        setContacts(contacts.map((c: any) => {
          if (c.tags?.includes(oldName)) {
            const newTags = c.tags.map((t: string) => t === oldName ? newName : t);
            return { ...c, tags: newTags };
          }
          return c;
        }));
      },
      deleteGroup: (id: number) => {
        const groupToDelete = groups.find((g: any) => g.id === id);
        setGroups(groups.filter((g: any) => g.id !== id));
        // Remove the tag from all contacts
        if (groupToDelete) {
          setContacts(contacts.map((c: any) => {
            if (c.tags?.includes(groupToDelete.name)) {
              return { ...c, tags: c.tags.filter((t: string) => t !== groupToDelete.name) };
            }
            return c;
          }));
        }
      },

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

# 2. Rebuild the Map Page using Leaflet and CartoDB (No API Keys, 100% Free, Perfect B&W)
cat << 'MAP' > src/app/map/page.tsx
"use client";
import { useEffect, useRef, useState } from 'react';
import { Map as MapIcon, Crosshair } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function MapPage() {
  const { contacts } = useStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Inject Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Inject Leaflet JS
    const loadLeaflet = () => {
      if ((window as any).L) {
        initMap();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !(window as any).L) return;

      const L = (window as any).L;
      
      // Clean up previous map instance if it exists
      if ((mapRef.current as any)._leaflet_id) {
        return; 
      }

      const map = L.map(mapRef.current, {
        zoomControl: false, // We'll disable default zoom controls for a cleaner look
        attributionControl: false
      }).setView([40.7128, -74.0060], 13); // NYC Center

      // CartoDB Positron: Beautiful, completely free Black & White line-art map (No API key needed!)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add markers
      contacts.forEach((contact: any) => {
        const latOffset = (Math.random() - 0.5) * 0.05;
        const lngOffset = (Math.random() - 0.5) * 0.05;
        const isVIP = contact.tags?.includes('VIP');

        const circleMarker = L.circleMarker([40.7128 + latOffset, -74.0060 + lngOffset], {
          color: '#ffffff',
          weight: 2,
          fillColor: isVIP ? '#000000' : '#888888',
          fillOpacity: 1,
          radius: 8
        }).addTo(map);

        circleMarker.bindTooltip(`<b>${contact.name}</b><br/>${contact.company}`, {
          className: 'bg-white text-black border shadow-sm rounded-lg p-2 font-sans text-xs',
          direction: 'top'
        });
      });

      setMapLoaded(true);
    };

    loadLeaflet();
    
    return () => {
      // Cleanup map instance on unmount
      if (mapRef.current && (mapRef.current as any)._leaflet_id) {
        const L = (window as any).L;
        if (L) {
          // This prevents the "Map container is already initialized" error
          mapRef.current.innerHTML = '';
          (mapRef.current as any)._leaflet_id = null;
        }
      }
    };
  }, [contacts]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 h-[calc(100vh-6rem)] flex flex-col">
      <div className="space-y-1.5 shrink-0">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <MapIcon className="w-8 h-8 text-primary" />
          Network Map
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Live geographic distribution powered by open-source tile layers.</p>
      </div>

      <div className="flex-1 rounded-3xl border border-border/60 bg-[#f8f9fa] relative overflow-hidden shadow-sm ring-1 ring-black/5">
        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 text-black">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-semibold">Loading Map Data...</p>
          </div>
        )}
        
        <div ref={mapRef} className="w-full h-full z-0" />
        
        {/* Floating Controls */}
        <div className="absolute bottom-8 left-8 z-20">
          <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl border shadow-xl max-w-sm text-black">
            <h3 className="font-bold text-base mb-1">Live Directory</h3>
            <p className="text-sm text-gray-500 mb-4">Showing {contacts.length} active contacts in this region.</p>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-md">
                <Crosshair className="w-4 h-4 mr-2" /> Locate Me
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl border shadow-xl flex flex-col gap-2 text-black">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#888888] border border-white"></div>
              <span className="text-xs font-bold">Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-black border border-white"></div>
              <span className="text-xs font-bold">VIP / Investor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
MAP

# 3. WhatsApp Style Groups (Multi-select creation & editing)
cat << 'GROUPS' > src/app/groups/page.tsx
"use client";
import { useState, useMemo } from 'react';
import { Layers, Plus, Users, Trash2, Edit2, X, Search, UserPlus, Check } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function GroupsPage() {
  const { groups, addGroup, updateGroup, deleteGroup, contacts, updateContact } = useStore();
  const [activeGroup, setActiveGroup] = useState<any>(null);
  
  // Modals state
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);
  
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [directorySearchQuery, setDirectorySearchQuery] = useState('');

  // Find contacts that belong to a group (by tag)
  const getContactsInGroup = (groupName: string) => {
    return contacts.filter((c: any) => c.tags?.includes(groupName));
  };

  // The members of the currently selected group
  const groupMembers = useMemo(() => {
    if (!activeGroup) return [];
    const members = getContactsInGroup(activeGroup.name);
    if (!memberSearchQuery.trim()) return members;
    return members.filter((m: any) => m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()));
  }, [activeGroup, contacts, memberSearchQuery]);

  // The search results for the directory
  const directoryResults = useMemo(() => {
    if (!directorySearchQuery.trim()) return contacts.slice(0, 50); // Show top 50
    return contacts.filter((c: any) => 
        c.name.toLowerCase().includes(directorySearchQuery.toLowerCase()) || 
        c.company.toLowerCase().includes(directorySearchQuery.toLowerCase())
    ).slice(0, 50);
  }, [contacts, directorySearchQuery]);

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
    addGroup(newGroup, selectedContactIds); // Store action handles applying tags
    setNewGroupName('');
    setSelectedContactIds([]);
    setShowNewGroup(false);
    setActiveGroup(newGroup);
  };

  const handleEditGroup = (e: any) => {
    e.preventDefault();
    if (!newGroupName.trim() || !activeGroup) return;
    
    updateGroup(activeGroup.id, newGroupName);
    setActiveGroup({ ...activeGroup, name: newGroupName });
    setShowEditGroup(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40 shrink-0">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Layers className="w-8 h-8 text-primary" />
            Groups & Cohorts
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Create lists and manage participants (WhatsApp style).</p>
        </div>
        <button 
          onClick={() => {
            setNewGroupName('');
            setSelectedContactIds([]);
            setDirectorySearchQuery('');
            setShowNewGroup(true);
          }}
          className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all bg-foreground text-background hover:bg-foreground/90 h-10 px-5 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Group
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
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${activeGroup?.id === group.id ? 'bg-primary/10 border-primary/20 border shadow-sm' : 'hover:bg-muted border border-transparent'}`}
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
              {/* Group Header */}
              <div className="p-6 border-b flex flex-col gap-4 bg-muted/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeGroup.color || 'bg-slate-100 text-slate-600'}`}>
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        {activeGroup.name}
                        <button 
                          onClick={() => {
                            setNewGroupName(activeGroup.name);
                            setShowEditGroup(true);
                          }}
                          className="p-1.5 text-muted-foreground hover:bg-background rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">{getContactsInGroup(activeGroup.name).length} participants</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setDirectorySearchQuery('');
                        setShowAddMember(true);
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" /> Add Participants
                    </button>
                    <button 
                      onClick={() => {
                        deleteGroup(activeGroup.id);
                        setActiveGroup(null);
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors border shadow-sm bg-background"
                      title="Delete Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Group Members List */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search within participants..." 
                      value={memberSearchQuery}
                      onChange={e => setMemberSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {groupMembers.map((contact: any) => (
                    <div key={contact.id} className="p-3 rounded-xl border bg-background flex items-center justify-between hover:border-primary/30 transition-colors group">
                      <div className="flex items-center gap-3">
                        <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} className="w-10 h-10 rounded-full bg-secondary" />
                        <div>
                          <div className="font-semibold text-sm">{contact.name}</div>
                          <div className="text-xs text-muted-foreground">{contact.role} at {contact.company}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleContactInGroup(contact)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:bg-rose-100 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {groupMembers.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">No participants in this group.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <Layers className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-semibold">Select a group to view and manage participants</p>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Style New Group Modal */}
      {showNewGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-xl p-6 rounded-2xl shadow-xl border animate-in zoom-in-95 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-xl font-bold">New Group</h2>
              <button onClick={() => setShowNewGroup(false)} className="text-muted-foreground hover:bg-muted p-2 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreateGroup} className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-4 shrink-0 mb-6">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Group Subject</label>
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
              </div>

              <div className="flex flex-col flex-1 overflow-hidden">
                <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
                  Add Participants ({selectedContactIds.length} selected)
                </label>
                
                <div className="relative mb-3 shrink-0">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search directory..." 
                    value={directorySearchQuery}
                    onChange={(e) => setDirectorySearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary/20" 
                  />
                </div>

                <div className="flex-1 overflow-y-auto border rounded-xl bg-background divide-y">
                  {directoryResults.map((contact: any) => {
                    const isSelected = selectedContactIds.includes(contact.id);
                    return (
                      <div 
                        key={contact.id} 
                        onClick={() => {
                          if (isSelected) {
                            setSelectedContactIds(selectedContactIds.filter(id => id !== contact.id));
                          } else {
                            setSelectedContactIds([...selectedContactIds, contact.id]);
                          }
                        }}
                        className={`p-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} className="w-8 h-8 rounded-full bg-secondary" />
                          <div className="font-semibold text-sm">{contact.name}</div>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-background'}`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t shrink-0">
                <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors">
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Group Info Modal */}
      {showEditGroup && activeGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-sm p-6 rounded-2xl shadow-xl border animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Edit Group Info</h2>
              <button onClick={() => setShowEditGroup(false)} className="text-muted-foreground hover:bg-muted p-2 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleEditGroup} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Group Subject</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full p-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Members Modal (Multi-select) */}
      {showAddMember && activeGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-lg p-6 rounded-2xl shadow-xl border animate-in zoom-in-95 flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="text-xl font-bold">Add Participants</h2>
              <button onClick={() => setShowAddMember(false)} className="text-muted-foreground hover:bg-muted p-2 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="relative mb-4 shrink-0">
              <Search className="w-5 h-5 absolute left-3 top-3 text-muted-foreground" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search directory..." 
                value={directorySearchQuery}
                onChange={(e) => setDirectorySearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 shadow-sm" 
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {directoryResults.map((contact: any) => {
                const isInGroup = contact.tags?.includes(activeGroup.name);
                return (
                  <div key={contact.id} className="p-3 rounded-xl border flex items-center justify-between bg-background">
                    <div className="flex items-center gap-3">
                      <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} className="w-10 h-10 rounded-full bg-secondary" />
                      <div>
                        <div className="font-semibold text-sm">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.role} at {contact.company}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleContactInGroup(contact)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isInGroup ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                    >
                      {isInGroup ? 'Added' : 'Add'}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t shrink-0">
              <button onClick={() => setShowAddMember(false)} className="w-full py-2.5 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-colors">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
GROUPS
