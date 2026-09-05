const fs = require('fs');
let code = fs.readFileSync('src/app/contacts/page.tsx', 'utf8');

// 1. Add max-w-7xl mx-auto to the outer container
code = code.replace(
  '<div className="space-y-8 pb-12 animate-in fade-in duration-500">',
  '<div className="space-y-8 pb-12 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">'
);

// 2. Make the search bar flex-1 instead of max-w-2xl so it eats the white space gracefully
code = code.replace(
  '<div className="relative w-full sm:max-w-md md:max-w-2xl group">',
  '<div className="relative flex-1 group">'
);

fs.writeFileSync('src/app/contacts/page.tsx', code);
