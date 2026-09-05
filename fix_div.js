const fs = require('fs');
let code = fs.readFileSync('src/app/contacts/page.tsx', 'utf8');
code = code.replace(/<\/div>\n\n      <\/div>\n\n      \{\/\* SaaS Style Data Table \*\/\}/, '</div>\n\n      {/* SaaS Style Data Table */}');
fs.writeFileSync('src/app/contacts/page.tsx', code);
