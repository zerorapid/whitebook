const fs = require('fs');
let code = fs.readFileSync('src/app/groups/page.tsx', 'utf8');

code = code.replace(
  '<div className="space-y-8 pb-12 animate-in fade-in duration-700 h-[calc(100vh-6rem)] flex flex-col">',
  '<div className="space-y-8 pb-12 animate-in fade-in duration-700 h-[calc(100vh-6rem)] flex flex-col max-w-7xl mx-auto w-full">'
);

fs.writeFileSync('src/app/groups/page.tsx', code);
