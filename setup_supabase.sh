#!/bin/bash
set -e
cd /Users/Jayapalreddy/.gemini/antigravity/scratch/crm-os-next

echo "Installing Supabase JS Client..."
npm install @supabase/supabase-js

echo "Creating .env.local..."
cat << 'ENV' > .env.local
NEXT_PUBLIC_SUPABASE_URL=https://acqtvusjoridrnrelhni.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_su_FMY6EkyHIfDSkcmBzPA_kz8uYUis
ENV

echo "Creating src/lib/supabase.ts..."
cat << 'SUPABASE' > src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
SUPABASE

echo "Updating store.tsx..."
node -e "
const fs = require('fs');
let content = fs.readFileSync('src/lib/store.tsx', 'utf8');

// Import Supabase and useEffect
content = content.replace(
  'import React, { createContext, useContext, useState } from \'react\';',
  'import React, { createContext, useContext, useState, useEffect } from \'react\';\nimport { supabase } from \'./supabase\';'
);

// Add useEffect logic inside the provider
const useEffectLogic = \`
  useEffect(() => {
    async function loadData() {
      try {
        const { data: contactsData, error: contactsError } = await supabase.from('contacts').select('*');
        if (contactsData && contactsData.length > 0) {
          // Merge with enhanced contacts or replace entirely
          setContacts(contactsData);
        }
        
        const { data: groupsData, error: groupsError } = await supabase.from('groups').select('*');
        if (groupsData && groupsData.length > 0) {
          setGroups(groupsData);
        }
      } catch (err) {
        console.error('Supabase load error:', err);
      }
    }
    loadData();
  }, []);
\`;

content = content.replace(
  'const [contacts, setContacts] = useState(enhancedContacts);\\n  const [groups, setGroups] = useState(initialGroups);',
  'const [contacts, setContacts] = useState(enhancedContacts);\\n  const [groups, setGroups] = useState(initialGroups);\\n' + useEffectLogic
);

// Update addContact
content = content.replace(
  'addContact: (c: any) => setContacts([...contacts, c]),',
  \`addContact: async (c: any) => {
        setContacts([...contacts, c]); // Optimistic UI
        // We ensure we don't send local numeric IDs if Supabase uses UUIDs
        const payload = { ...c };
        if (typeof payload.id === 'number') delete payload.id;
        
        await supabase.from('contacts').insert([payload]);
      },\`
);

// Update updateContact
content = content.replace(
  'updateContact: (id: number, data: any) => setContacts(contacts.map((c: any) => c.id === id ? { ...c, ...data } : c)),',
  \`updateContact: async (id: any, data: any) => {
        setContacts(contacts.map((c: any) => c.id === id ? { ...c, ...data } : c));
        await supabase.from('contacts').update(data).eq('id', id);
      },\`
);

// Update deleteContact
content = content.replace(
  'deleteContact: (id: number) => setContacts(contacts.filter((c: any) => c.id !== id)),',
  \`deleteContact: async (id: any) => {
        setContacts(contacts.filter((c: any) => c.id !== id));
        await supabase.from('contacts').delete().eq('id', id);
      },\`
);

fs.writeFileSync('src/lib/store.tsx', content);
"

echo "Setup Complete!"
