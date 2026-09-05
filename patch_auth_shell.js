const fs = require('fs');

// 1. Patch AuthGuard
let auth = fs.readFileSync('src/components/AuthGuard.tsx', 'utf8');
auth = auth.replace(/pathname !== '\/login'/g, `(pathname !== '/login' && !pathname.startsWith('/card'))`);
auth = auth.replace(/pathname === '\/login'/g, `pathname === '/login'`);
fs.writeFileSync('src/components/AuthGuard.tsx', auth);

// 2. Patch ClientShell
let shell = fs.readFileSync('src/components/ClientShell.tsx', 'utf8');
shell = shell.replace(`pathname === "/login" ? (`, `(pathname === "/login" || pathname.startsWith("/card")) ? (`);
fs.writeFileSync('src/components/ClientShell.tsx', shell);
