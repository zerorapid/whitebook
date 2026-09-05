const fs = require('fs');
let code = fs.readFileSync('src/lib/store.tsx', 'utf8');

// Replace the loadData useEffect to include LocalStorage & Realtime
const newEffect = `
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
`;

code = code.replace(/useEffect\(\(\) => \{\n    async function loadData\(\) \{[\s\S]*?loadData\(\);\n  \}, \[\]\);/, newEffect);

fs.writeFileSync('src/lib/store.tsx', code);
