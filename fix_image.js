const fs = require('fs');

const replaceInFile = (file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Pattern to look for: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`
    // And replace with: contact.avatar || `...`
    const searchString = "`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`";
    const replaceString = "contact.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`";
    
    content = content.split(searchString).join(replaceString);
    fs.writeFileSync(file, content);
  }
};

['src/app/contacts/page.tsx', 'src/app/contacts/[id]/page.tsx', 'src/app/groups/page.tsx'].forEach(replaceInFile);
