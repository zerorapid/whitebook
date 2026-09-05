const fs = require('fs');
let code = fs.readFileSync('src/app/contacts/page.tsx', 'utf8');

code = code.replace(
  '<div className="flex flex-col sm:flex-row gap-3">',
  '<div className="flex flex-col sm:flex-row justify-between gap-3">'
);

code = code.replace(
  '<div className="relative flex-1 max-w-2xl group">',
  '<div className="relative w-full sm:max-w-md md:max-w-2xl group">'
);

fs.writeFileSync('src/app/contacts/page.tsx', code);
