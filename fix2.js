const fs = require('fs');
let code = fs.readFileSync('src/app/api/vcard/route.ts', 'utf8');
code = code.replace(/\\\$/g, '$').replace(/\\`/g, '\`');
fs.writeFileSync('src/app/api/vcard/route.ts', code);
