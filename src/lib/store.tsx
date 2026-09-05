"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
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

  const [contacts, setContacts] = useState<any[]>(enhancedContacts);
  const [groups, setGroups] = useState<any[]>(initialGroups);
  const [isStoreReady, setIsStoreReady] = useState(false);

  
  useEffect(() => {
    async function loadData() {
      // 1. Instant Offline Load from PWA Cache (LocalStorage)
      if (typeof window !== 'undefined') {
        const cachedContacts = localStorage.getItem('wb_contacts');
        const cachedGroups = localStorage.getItem('wb_groups');
        if (cachedContacts) setContacts(JSON.parse(cachedContacts));
        if (cachedGroups) setGroups(JSON.parse(cachedGroups));
      }

      try {
        // 2. Fetch fresh from Supabase
        const { data: contactsData, error: contactsError } = await supabase.from('contacts').select('*');
        if (!contactsError && contactsData) {
          const mergedContacts = [
            ...contactsData,
            ...enhancedContacts.map((c: any) => ({ ...c, id: (typeof c.id === 'number' ? c.id + 100000 : c.id + '_dummy') }))
          ];
          setContacts(mergedContacts);
          if (typeof window !== 'undefined') localStorage.setItem('wb_contacts', JSON.stringify(mergedContacts));
        }
        
        const { data: groupsData, error: groupsError } = await supabase.from('groups').select('*');
        if (!groupsError && groupsData) {
          const mergedGroups = [
            ...groupsData,
            ...initialGroups.map((g: any) => ({ ...g, id: (typeof g.id === 'number' ? g.id + 100000 : g.id + '_dummy') }))
          ];
          setGroups(mergedGroups);
          if (typeof window !== 'undefined') localStorage.setItem('wb_groups', JSON.stringify(mergedGroups));
        }
      } catch (err) {
        console.error('Supabase load error:', err);
      } finally {
        setIsStoreReady(true);
      }
    }
    loadData();

    // 3. Setup Supabase Realtime Subscription for Cross-Tab / Cross-Device Sync
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, (payload) => {
        // On any remote change, simply reload data to ensure 100% sync
        // Optimistic UI handles local changes instantly, this catches remote ones
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, (payload) => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 4. Auto-save to LocalStorage whenever state changes (for optimistic UI offline resilience)
  useEffect(() => {
    if (isStoreReady && typeof window !== 'undefined') {
      localStorage.setItem('wb_contacts', JSON.stringify(contacts));
      localStorage.setItem('wb_groups', JSON.stringify(groups));
    }
  }, [contacts, groups, isStoreReady]);


  
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
      addContact: async (c: any) => {
        setContacts([...contacts, c]); // Optimistic UI
        
        // Only include fields that exist in the Supabase schema
        const payload: any = {
          name: c.name,
          company: c.company,
          role: c.role,
          email: c.email,
          phone: c.phone,
          location: c.location,
          avatar: c.avatar,
          last_contact: c.last_contact,
          notes: c.notes,
          tags: c.tags || [],
          linkedin: c.linkedin,
          twitter: c.twitter,
          instagram: c.instagram,
          business_card_image: c.business_card_image
        };
        
        // Remove undefined fields
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) payload.user_id = session.user.id;
        
        await supabase.from('contacts').insert([payload]);
      },
      updateContact: async (id: any, data: any) => {
        setContacts(contacts.map((c: any) => c.id === id ? { ...c, ...data } : c));
        
        const payload = { ...data };
        delete payload.id;
        delete payload.user_id;
        delete payload.created_at;
        delete payload.birthday;
        delete payload.followUp;
        delete payload.locationCoords;
        delete payload.added;
        
        await supabase.from('contacts').update(payload).eq('id', id);
      },
      deleteContact: async (id: any) => {
        setContacts(contacts.filter((c: any) => c.id !== id));
        await supabase.from('contacts').delete().eq('id', id);
      },
      
      groups,
      addGroup: async (g: any, initialContactIds: number[] = []) => {
        setGroups([...groups, g]);
        
        // Only include fields that exist in Supabase schema
        const payload: any = {
          name: g.name,
          description: g.description,
          tags: g.tags || [],
          members: g.members || []
        };
        
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) payload.user_id = session.user.id;
        
        await supabase.from('groups').insert([payload]);

        // Instantly add these contacts to the group
        if (initialContactIds.length > 0) {
          setContacts(contacts.map((c: any) => {
            if (initialContactIds.includes(c.id)) {
              const newTags = c.tags ? [...c.tags, g.name] : [g.name];
              const uniqueTags = Array.from(new Set(newTags));
              
              // Sync contact tags to supabase in the background
              supabase.from('contacts').update({ tags: uniqueTags }).eq('id', c.id).then();
              
              return { ...c, tags: uniqueTags };
            }
            return c;
          }));
        }
      },
      updateGroup: async (id: number, newName: string) => {
        const groupToEdit = groups.find((g: any) => g.id === id);
        if (!groupToEdit) return;
        
        const oldName = groupToEdit.name;
        
        // Update group name locally and remotely
        setGroups(groups.map((g: any) => g.id === id ? { ...g, name: newName } : g));
        await supabase.from('groups').update({ name: newName }).eq('id', id);
        
        // Cascade tag change to all members
        setContacts(contacts.map((c: any) => {
          if (c.tags?.includes(oldName)) {
            const newTags = c.tags.map((t: string) => t === oldName ? newName : t);
            
            // Sync tag cascade to supabase
            supabase.from('contacts').update({ tags: newTags }).eq('id', c.id).then();
            
            return { ...c, tags: newTags };
          }
          return c;
        }));
      },
      deleteGroup: async (id: number) => {
        const groupToDelete = groups.find((g: any) => g.id === id);
        setGroups(groups.filter((g: any) => g.id !== id));
        
        // Delete from Supabase
        await supabase.from('groups').delete().eq('id', id);

        // Remove the tag from all contacts
        if (groupToDelete) {
          setContacts(contacts.map((c: any) => {
            if (c.tags?.includes(groupToDelete.name)) {
              const newTags = c.tags.filter((t: string) => t !== groupToDelete.name);
              
              // Sync tag removal to supabase
              supabase.from('contacts').update({ tags: newTags }).eq('id', c.id).then();
              
              return { ...c, tags: newTags };
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
      deleteNotification: (id: number) => setNotifications(notifications.filter(n => n.id !== id)), isStoreReady,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
