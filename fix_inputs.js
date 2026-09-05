const fs = require('fs');
let code = fs.readFileSync('src/app/settings/page.tsx', 'utf8');

code = code.replace(
  `const [profile, setProfile] = useState({ name: 'Executive User', email: 'executive@example.com' });`,
  `const [profile, setProfile] = useState({ name: 'Srikanth', email: 'srikanth@whitebook.app', role: 'Event Organizer', company: 'Whitebook Events', phone: '+919876543210' });`
);

const newInputs = `
                    <div>
                      <label className="block text-sm font-bold mb-1.5">Role / Job Title</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={profile.role}
                          onChange={e => setProfile({...profile, role: e.target.value})}
                          className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5">Company</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={profile.company}
                          onChange={e => setProfile({...profile, company: e.target.value})}
                          className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold mb-1.5">Phone Number</label>
                      <div className="relative">
                        <input 
                          type="tel" 
                          value={profile.phone}
                          onChange={e => setProfile({...profile, phone: e.target.value})}
                          className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                        />
                      </div>
                    </div>
`;

code = code.replace(/<div className="grid sm:grid-cols-2 gap-5">[\s\S]*?<\/div>\s*<\/div>\s*<div className="pt-4 border-t border-border\/40 flex justify-end">/, (match) => {
  return match.replace('</div>\n                  </div>\n                  <div className="pt-4 border-t', newInputs + '</div>\n                  </div>\n                  <div className="pt-4 border-t');
});

// Update the vCard string to include these new fields
code = code.replace(/FN:\$\{profile\.name\}\\nEMAIL:\$\{profile\.email\}/, `FN:\${profile.name}\\nORG:\${profile.company}\\nTITLE:\${profile.role}\\nTEL:\${profile.phone}\\nEMAIL:\${profile.email}`);

fs.writeFileSync('src/app/settings/page.tsx', code);
