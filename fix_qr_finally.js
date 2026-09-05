const fs = require('fs');
let code = fs.readFileSync('src/app/settings/page.tsx', 'utf8');

const qrHtml = `
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-8 mt-6">
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
                    src={\`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=\${encodeURIComponent(\`BEGIN:VCARD\\nVERSION:3.0\\nFN:\${profile.name}\\nEMAIL:\${profile.email}\\nEND:VCARD\`)}\`} 
                    alt="Virtual Visiting Card QR Code"
                    className="w-40 h-40"
                  />
                  <div className="text-[10px] font-black text-center mt-2 uppercase tracking-widest text-muted-foreground">Whitebook</div>
                </div>
              </div>
`;

code = code.replace(/<Save className="w-4 h-4" \/> Save Changes<\/>}\s*<\/button>\s*<\/div>\s*<\/div>\s*<\/div>/, `<Save className="w-4 h-4" /> Save Changes</>}
                    </button>
                  </div>
                </div>
              </div>
` + qrHtml);

fs.writeFileSync('src/app/settings/page.tsx', code);
