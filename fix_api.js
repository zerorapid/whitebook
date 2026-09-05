const fs = require('fs');
let code = fs.readFileSync('src/app/api/vcard/route.ts', 'utf8');

code = code.replace(/\\`BEGIN:VCARD/g, '`BEGIN:VCARD');
code = code.replace(/\\$\{/g, '${');
code = code.replace(/END:VCARD\\`/g, 'END:VCARD`');
code = code.replace(/\\`/g, '`');

fs.writeFileSync('src/app/api/vcard/route.ts', code);
