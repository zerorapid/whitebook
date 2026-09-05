const fs = require('fs');
let code = fs.readFileSync('src/app/settings/page.tsx', 'utf8');

if (!code.includes("import { useStore }")) {
  code = code.replace("import { useRouter }", "import { useRouter } from 'next/navigation';\nimport { useStore } from '@/lib/store';");
}

code = code.replace("const router = useRouter();", `const router = useRouter();\n  const { contacts, addContact } = useStore();`);

const importExportCode = `
  const handleExport = () => {
    if (!contacts || contacts.length === 0) return alert('No contacts to export.');
    
    const headers = ['Name', 'Role', 'Company', 'Phone', 'Email', 'Location', 'Tags', 'Notes'];
    const rows = contacts.map(c => [
      c.name || '',
      c.role || '',
      c.company || '',
      c.phone || '',
      c.email || '',
      c.location || '',
      (c.tags || []).join('; '),
      c.notes || ''
    ].map(v => \`"\${v.toString().replace(/"/g, '""')}"\`).join(','));
    
    const csvContent = [headers.join(','), ...rows].join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = \`whitebook_contacts_\${new Date().toISOString().split('T')[0]}.csv\`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
          alert('File is empty or invalid.');
          return;
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
        let importCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          const parsedVals: string[] = [];
          let inQuotes = false;
          let currentVal = '';
          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"' && line[j+1] === '"') { currentVal += '"'; j++; }
            else if (char === '"') { inQuotes = !inQuotes; }
            else if (char === ',' && !inQuotes) { parsedVals.push(currentVal); currentVal = ''; }
            else { currentVal += char; }
          }
          parsedVals.push(currentVal);

          const contact: any = {};
          headers.forEach((h, idx) => {
            const val = parsedVals[idx]?.trim().replace(/^"|"$/g, '') || '';
            if (h.includes('name')) contact.name = val;
            else if (h.includes('phone') || h.includes('tel')) contact.phone = val;
            else if (h.includes('email')) contact.email = val;
            else if (h.includes('company') || h.includes('org')) contact.company = val;
            else if (h.includes('role') || h.includes('title')) contact.role = val;
            else if (h.includes('loc')) contact.location = val;
            else if (h.includes('tag')) contact.tags = val.split(';').map((t: string) => t.trim()).filter(Boolean);
            else if (h.includes('note')) contact.notes = val;
          });

          if (contact.name) {
            contact.id = Date.now() + Math.random();
            contact.avatar = \`https://api.dicebear.com/7.x/micah/svg?seed=\${encodeURIComponent(contact.name)}&backgroundColor=transparent\`;
            await addContact(contact);
            importCount++;
          }
        }
        alert(\`Successfully imported \${importCount} contacts!\`);
      } catch (err) {
        console.error(err);
        alert('Failed to import contacts. Please check the CSV format.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };
`;

code = code.replace("  const getCardUrl = () => {", importExportCode + "\n  const getCardUrl = () => {");

// Hook up export button
code = code.replace(
  /<button className="w-full flex items-center justify-center gap-2 h-10 bg-secondary text-secondary-foreground hover:bg-secondary\/80 rounded-xl text-sm font-bold transition-all group-hover:bg-primary group-hover:text-primary-foreground">\s*<Download className="w-4 h-4" \/> Export to CSV\s*<\/button>/g,
  `<button onClick={handleExport} className="w-full flex items-center justify-center gap-2 h-10 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-sm font-bold transition-all group-hover:bg-primary group-hover:text-primary-foreground"><Download className="w-4 h-4" /> Export to CSV</button>`
);

// Hook up import button
code = code.replace(
  /<button className="w-full flex items-center justify-center gap-2 h-10 bg-secondary text-secondary-foreground hover:bg-secondary\/80 rounded-xl text-sm font-bold transition-all group-hover:bg-primary group-hover:text-primary-foreground">\s*<Upload className="w-4 h-4" \/> Import from CSV\s*<\/button>/g,
  `<label className="w-full flex items-center justify-center gap-2 h-10 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-sm font-bold transition-all group-hover:bg-primary group-hover:text-primary-foreground cursor-pointer">
    <Upload className="w-4 h-4" /> Import from CSV
    <input type="file" accept=".csv" className="hidden" onChange={handleImport} disabled={isLoading} />
  </label>`
);

fs.writeFileSync('src/app/settings/page.tsx', code);
