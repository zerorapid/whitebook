const fs = require('fs');
let content = fs.readFileSync('src/app/contacts/[id]/page.tsx', 'utf8');

// The problematic lines contain literal newlines
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("const updatedNotes = (contact.notes ? contact.notes + '")) {
    lines[i] = "    const updatedNotes = (contact.notes ? contact.notes + '\\n\\n' : '') + newNote;";
    // Remove the next two lines which are empty and closing quote
    lines.splice(i + 1, 2);
    break;
  }
}

fs.writeFileSync('src/app/contacts/[id]/page.tsx', lines.join('\n'));
