const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace all instances of \` with `
code = code.replace(/\\`/g, '`');
// Replace all instances of \$ with $
code = code.replace(/\\\$/g, '$');

fs.writeFileSync('src/app/page.tsx', code);
