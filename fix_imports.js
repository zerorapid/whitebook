const fs = require('fs');
let code = fs.readFileSync('src/app/contacts/page.tsx', 'utf8');

const oldImports = `import { 
  Search, Plus, Filter, 
  Mail, Phone, Building2, Star, ArrowUpRight, Sparkles, MapPin, MoreHorizontal
} from 'lucide-react';`;

const newImports = `import { 
  Search, Plus, Filter, ArrowDownUp, Tag,
  Mail, Phone, Building2, Star, ArrowUpRight, Sparkles, MapPin, MoreHorizontal
} from 'lucide-react';`;

code = code.replace(oldImports, newImports);
fs.writeFileSync('src/app/contacts/page.tsx', code);
