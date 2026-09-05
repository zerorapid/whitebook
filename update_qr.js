const fs = require('fs');
let code = fs.readFileSync('src/app/settings/page.tsx', 'utf8');

const replacement = `
  const getCardUrl = () => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams({
      n: profile.name,
      r: profile.role,
      c: profile.company,
      p: profile.phone,
      e: profile.email,
      l: profile.linkedin
    });
    return \`\${window.location.origin}/card?\${params.toString()}\`;
  };

`;

code = code.replace("const handleSave = () => {", replacement + "  const handleSave = () => {");

code = code.replace(
  /src=\{\`https:\/\/api\.qrserver\.com\/v1\/create-qr-code\/\?size=180x180&data=\$\{encodeURIComponent\([\s\S]*?BEGIN:VCARD[\s\S]*?END:VCARD\`\)\}\`\}/, 
  `src={\`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=\${encodeURIComponent(getCardUrl())}\`}`
);

fs.writeFileSync('src/app/settings/page.tsx', code);
