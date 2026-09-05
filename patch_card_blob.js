const fs = require('fs');
let code = fs.readFileSync('src/app/card/page.tsx', 'utf8');

const oldHandleSaveContact = `  const handleSaveContact = () => {
    // Generate vCard
    const vCard = \`BEGIN:VCARD
VERSION:3.0
FN:\${name}
ORG:\${company}
TITLE:\${role}
TEL:\${phone}
EMAIL:\${email}
URL:\${website}
END:VCARD\`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = \`\${name.replace(/\\s+/g, '_')}.vcf\`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };`;

const newHandleSaveContact = `  const handleSaveContact = () => {
    const params = new URLSearchParams(window.location.search);
    window.location.href = \`/api/vcard?\${params.toString()}\`;
  };`;

code = code.replace(oldHandleSaveContact, newHandleSaveContact);

// Make sure we didn't miss it due to regex matching, let's just replace the block generically
if (!code.includes("window.location.href = `/api/vcard?")) {
  code = code.replace(/const handleSaveContact = \(\) => \{[\s\S]*?document\.body\.removeChild\(link\);\s*\};/, newHandleSaveContact);
}

fs.writeFileSync('src/app/card/page.tsx', code);
