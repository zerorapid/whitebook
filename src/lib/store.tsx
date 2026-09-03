"use client";
import React, { createContext, useContext, useState } from 'react';
import { contacts as initialContacts, groups as initialGroups, events as initialEvents } from './data';

type TaskStatus = 'todo' | 'in-progress' | 'done';

const StoreContext = createContext<any>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [groups, setGroups] = useState(initialGroups);
  const [events, setEvents] = useState(initialEvents);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Send follow-up email to investors', due: 'Today, 2:00 PM', status: 'todo', tag: 'High Priority', priority: 'high' },
    { id: 2, title: 'Schedule Q3 review with Marcus', due: 'Tomorrow', status: 'todo', tag: 'Meeting', priority: 'medium' },
    { id: 3, title: 'Draft partnership proposal', due: 'Wed, 4:00 PM', status: 'in-progress', tag: 'Project', priority: 'high' },
    { id: 4, title: 'Update CRM with new conference leads', due: 'Friday', status: 'in-progress', tag: 'Admin', priority: 'low' },
    { id: 5, title: 'Prepare slide deck for pitch', due: 'Last Week', status: 'done', tag: 'Project', priority: 'high' },
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: 'High Priority Task Due Soon', description: 'Due in 2 hours.', time: '2 hours ago', read: false },
    { id: 2, type: 'message', title: 'New message', description: 'Can we jump on a quick call?', time: '4 hours ago', read: false },
    { id: 3, type: 'event', title: 'Upcoming Meeting', description: 'Q1 Review in 30 mins.', time: '5 hours ago', read: true },
  ]);

  return (
    <StoreContext.Provider value={{
      contacts,
      addContact: (c: any) => setContacts([...contacts, c]),
      deleteContact: (id: number) => setContacts(contacts.filter((c: any) => c.id !== id)),
      
      groups,
      deleteGroup: (id: number) => setGroups(groups.filter((g: any) => g.id !== id)),

      events,
      addEvent: (e: any) => setEvents([...events, e]),

      tasks,
      updateTaskStatus: (id: number, status: TaskStatus) => setTasks(tasks.map(t => t.id === id ? { ...t, status } : t)),
      addTask: (t: any) => setTasks([...tasks, t]),
      deleteTask: (id: number) => setTasks(tasks.filter(t => t.id !== id)),

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
