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
