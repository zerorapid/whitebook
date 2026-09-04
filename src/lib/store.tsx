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
