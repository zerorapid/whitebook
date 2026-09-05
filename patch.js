const fs = require('fs');
let code = fs.readFileSync('src/app/settings/page.tsx', 'utf8');

code = code.replace(
  `const [profile, setProfile] = useState({ name: 'Executive User', email: 'executive@example.com' });`,
  `const [profile, setProfile] = useState({ name: 'Srikanth', role: 'Event Organizer', company: 'Whitebook Events', email: 'srikanth@whitebook.app', phone: '+919876543210', linkedin: 'https://linkedin.com/in/srikanth' });`
);

const formHtml = `                <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
                  <div className="relative group shrink-0 flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-primary border-4 border-background shadow-sm overflow-hidden">
                      {profile.name.charAt(0) || 'U'}
                    </div>
                    <button className="text-xs font-bold bg-secondary text-secondary-foreground px-3 py-1 rounded-full shadow-sm hover:opacity-90">Change Avatar</button>
                  </div>
                  
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold mb-1.5">Full Name</label>
                      <input 
                        type="text" 
                        value={profile.name}
                        onChange={e => setProfile({...profile, name: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5">Email Address</label>
                      <input 
                        type="email" 
                        value={profile.email}
                        onChange={e => setProfile({...profile, email: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5">Role</label>
                      <input 
                        type="text" 
                        value={profile.role}
                        onChange={e => setProfile({...profile, role: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5">Company</label>
                      <input 
                        type="text" 
                        value={profile.company}
                        onChange={e => setProfile({...profile, company: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5">Phone Number</label>
                      <input 
                        type="tel" 
                        value={profile.phone}
                        onChange={e => setProfile({...profile, phone: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5">LinkedIn URL</label>
                      <input 
                        type="url" 
                        value={profile.linkedin}
                        onChange={e => setProfile({...profile, linkedin: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>`;

const qrHtml = `
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-1 text-center sm:text-left space-y-3">
                  <h2 className="text-2xl font-extrabold tracking-tight text-primary">Your Virtual Visiting Card</h2>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    Scan this QR code with any smartphone camera to instantly save your profile directly to their contacts. No app required for them.
                  </p>
                  <div className="pt-2">
                    <button className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm">
                      Share Profile Link
                    </button>
                  </div>
                </div>
                <div className="shrink-0 p-3 bg-white rounded-2xl shadow-md border">
                  <img 
                    src={\`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=\${encodeURIComponent(\`BEGIN:VCARD\\nVERSION:3.0\\nFN:\${profile.name}\\nORG:\${profile.company}\\nTITLE:\${profile.role}\\nTEL:\${profile.phone}\\nEMAIL:\${profile.email}\\nURL:\${profile.linkedin}\\nEND:VCARD\`)}\`} 
                    alt="Virtual Visiting Card QR Code"
                    className="w-40 h-40"
                  />
                  <div className="text-[10px] font-black text-center mt-2 uppercase tracking-widest text-muted-foreground">Whitebook</div>
                </div>
              </div>
`;

// Replace the old profile form with the new one
code = code.replace(/<div className="flex flex-col sm:flex-row gap-8 items-start mb-8">[\s\S]*?<div className="flex-1 w-full space-y-5">[\s\S]*?<\/div>\s*<\/div>/, formHtml);

// Add the QR code section just before the SECURITY TAB
code = code.replace('{/* SECURITY TAB */}', qrHtml + '\n\n          {/* SECURITY TAB */}');

fs.writeFileSync('src/app/settings/page.tsx', code);
