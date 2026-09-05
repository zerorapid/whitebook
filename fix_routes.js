const fs = require('fs');
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
sidebar = sidebar.replace("{ name: 'Sync & Integrations', href: '/integrations', icon: RefreshCw },", "{ name: 'MCP Hub', href: '/mcp', icon: RefreshCw },");
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);

let menu = fs.readFileSync('src/app/menu/page.tsx', 'utf8');
menu = menu.replace("{ name: 'Integrations', href: '/integrations', icon: RefreshCw, desc: 'Sync with other platforms' },", "{ name: 'MCP Servers', href: '/mcp', icon: RefreshCw, badge: 'NEW', desc: 'Connect AI Context Servers' },");
menu = menu.replace(/BlackBook/g, "Whitebook");
fs.writeFileSync('src/app/menu/page.tsx', menu);
