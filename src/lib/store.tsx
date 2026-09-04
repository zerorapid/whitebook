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
