const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');
code = code.replace(
  '<div className="space-y-8 pb-12 animate-in fade-in duration-700">',
  '<div className="space-y-8 pb-12 animate-in fade-in duration-700 max-w-7xl mx-auto w-full">'
);
fs.writeFileSync('src/app/page.tsx', code);
