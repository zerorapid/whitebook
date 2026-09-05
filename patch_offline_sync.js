const fs = require('fs');
let code = fs.readFileSync('src/lib/store.tsx', 'utf8');

const syncQueueLogic = `
    // 3. Process Offline Queue
    const processQueue = async () => {
      const queue = localStorage.getItem('wb_offline_queue');
      if (queue) {
        const items = JSON.parse(queue);
        if (items.length > 0) {
          console.log('Processing offline queue:', items.length, 'items');
          for (const item of items) {
            if (item.action === 'INSERT_CONTACT') {
              await supabase.from('contacts').insert([item.payload]);
            } else if (item.action === 'UPDATE_CONTACT') {
              await supabase.from('contacts').update(item.payload).eq('id', item.id);
            }
          }
          localStorage.removeItem('wb_offline_queue');
          // Reload data after syncing queue
          const { data } = await supabase.from('contacts').select('*');
          if (data) {
             const merged = [...data, ...enhancedContacts.map((c: any) => ({ ...c, id: (typeof c.id === 'number' ? c.id + 100000 : c.id + '_dummy') }))];
             setContacts(merged);
             localStorage.setItem('wb_contacts', JSON.stringify(merged));
          }
        }
      }
    };
    processQueue();
`;

// Insert the sync logic after Supabase fetch succeeds in loadData
code = code.replace(
  "setIsStoreReady(true);\n      }",
  "setIsStoreReady(true);\n        processQueue().catch(e => console.error('Queue sync failed:', e));\n      }"
);


// Replace addContact to handle failures and queue
const newAddContact = `addContact: async (c: any) => {
        // Optimistic UI with temporary ID if missing
        const newContact = { ...c, id: c.id || Date.now() };
        setContacts([...contacts, newContact]); 
        
        const payload: any = {
          name: c.name, company: c.company, role: c.role, email: c.email,
          phone: c.phone, location: c.location, avatar: c.avatar,
          last_contact: c.last_contact, notes: c.notes, tags: c.tags || [],
          linkedin: c.linkedin, twitter: c.twitter, instagram: c.instagram,
          business_card_image: c.business_card_image
        };
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) payload.user_id = session.user.id;
          
          const { error } = await supabase.from('contacts').insert([payload]);
          if (error) throw error;
        } catch (err) {
          console.log("Offline or failed insert. Queueing for sync.");
          const queue = JSON.parse(localStorage.getItem('wb_offline_queue') || '[]');
          queue.push({ action: 'INSERT_CONTACT', payload });
          localStorage.setItem('wb_offline_queue', JSON.stringify(queue));
        }
      },`;

code = code.replace(/addContact: async \(c: any\) => \{[\s\S]*?await supabase\.from\('contacts'\)\.insert\(\[payload\]\);\n      \},/, newAddContact);

// Handle updateContact queueing
const newUpdateContact = `updateContact: async (id: any, data: any) => {
        setContacts(contacts.map((c: any) => c.id === id ? { ...c, ...data } : c));
        
        const payload = { ...data };
        ['id', 'user_id', 'created_at', 'birthday', 'followUp', 'locationCoords', 'added'].forEach(k => delete payload[k]);
        
        try {
          const { error } = await supabase.from('contacts').update(payload).eq('id', id);
          if (error) throw error;
        } catch (err) {
          const queue = JSON.parse(localStorage.getItem('wb_offline_queue') || '[]');
          queue.push({ action: 'UPDATE_CONTACT', id, payload });
          localStorage.setItem('wb_offline_queue', JSON.stringify(queue));
        }
      },`;

code = code.replace(/updateContact: async \(id: any, data: any\) => \{[\s\S]*?await supabase\.from\('contacts'\)\.update\(payload\)\.eq\('id', id\);\n      \},/, newUpdateContact);

fs.writeFileSync('src/lib/store.tsx', code);
