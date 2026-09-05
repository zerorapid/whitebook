const fs = require('fs');
let code = fs.readFileSync('src/app/card/page.tsx', 'utf8');

// Replace the large Website and Linkedin boxes with a compact grid block, 
// matching the user's screenshot exactly.

const updatedContactLinks = `
          {/* Contact Links */}
          <div className="mt-8 space-y-3">
            {phone && (
              <a href={\`tel:\${phone}\`} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-all bg-white hover:bg-gray-50">
                <Phone className="w-5 h-5 text-gray-800 shrink-0" />
                <span className="font-semibold text-gray-900">{phone}</span>
              </a>
            )}
            {email && (
              <a href={\`mailto:\${email}\`} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-all bg-white hover:bg-gray-50">
                <Mail className="w-5 h-5 text-gray-800 shrink-0" />
                <span className="font-semibold text-gray-900 truncate">{email}</span>
              </a>
            )}
            {website && (
              <a href={\`https://\${website.replace(/^https?:\\/\\//, '')}\`} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-all bg-white hover:bg-gray-50">
                <Globe className="w-5 h-5 text-gray-800 shrink-0" />
                <span className="font-semibold text-gray-900 truncate">{website}</span>
              </a>
            )}
          </div>

          {/* Social & QR Grid (Matching Screenshot) */}
          <div className="mt-6 p-4 border border-gray-100 rounded-2xl bg-[#fafafa] flex gap-4">
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2">
              <a href="#" className="flex items-center justify-center py-2.5 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <Github className="w-5 h-5 text-gray-800" />
              </a>
              <a href={linkedin || "#"} target="_blank" rel="noreferrer" className="flex items-center justify-center py-2.5 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <Linkedin className="w-5 h-5 text-gray-800" />
              </a>
              <a href="#" className="flex items-center justify-center py-2.5 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <Twitter className="w-5 h-5 text-gray-800" />
              </a>
              <a href={\`https://\${website.replace(/^https?:\\/\\//, '')}\`} target="_blank" rel="noreferrer" className="flex items-center justify-center py-2.5 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <Globe className="w-5 h-5 text-gray-800" />
              </a>
            </div>
            <div className="w-[88px] shrink-0 border border-gray-200 bg-white rounded-xl p-2 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors">
              <div className="w-full aspect-square bg-black rounded-lg flex items-center justify-center text-white mb-1">
                <Scan className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-semibold text-gray-500 whitespace-nowrap">Scan vCard</span>
            </div>
          </div>
`;

code = code.replace(/\{\/\* Contact Links \*\/\}[\s\S]*?\{\/\* Bottom Actions \*\/\}/, updatedContactLinks + '\n          {/* Bottom Actions */}');

fs.writeFileSync('src/app/card/page.tsx', code);
