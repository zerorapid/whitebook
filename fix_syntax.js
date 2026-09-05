const fs = require('fs');
let code = fs.readFileSync('src/app/settings/page.tsx', 'utf8');

code = code.replace(/import \{ useRouter \} from 'next\/navigation';\nimport \{ useStore \} from '@\/lib\/store'; from 'next\/navigation';/, "import { useRouter } from 'next/navigation';\nimport { useStore } from '@/lib/store';");

fs.writeFileSync('src/app/settings/page.tsx', code);
