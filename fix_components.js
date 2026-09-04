const fs = require('fs');

// 1. Fix ClientShell.tsx
let shellContent = fs.readFileSync('src/components/ClientShell.tsx', 'utf8');

if (!shellContent.includes('AuthGuard')) {
  shellContent = shellContent.replace(
    "import { useState } from 'react';",
    "import { useState } from 'react';\nimport { usePathname } from 'next/navigation';\nimport AuthGuard from './AuthGuard';"
  );

  shellContent = shellContent.replace(
    "export default function ClientShell({ children }: { children: React.ReactNode }) {",
    "export default function ClientShell({ children }: { children: React.ReactNode }) {\n  const pathname = usePathname();"
  );

  shellContent = shellContent.replace(
    'return (\n    <div className="flex h-screen overflow-hidden bg-muted/40">',
    'return (\n    <AuthGuard>\n      {pathname === "/login" ? (\n        children\n      ) : (\n        <div className="flex h-screen overflow-hidden bg-muted/40">'
  );

  shellContent = shellContent.replace(
    '</main>\n      </div>\n    </div>\n  );',
    '</main>\n      </div>\n    </div>\n      )}\n    </AuthGuard>\n  );'
  );
  fs.writeFileSync('src/components/ClientShell.tsx', shellContent);
}

// 2. Fix Store.tsx
let storeContent = fs.readFileSync('src/lib/store.tsx', 'utf8');
if (!storeContent.includes('session.user.id')) {
  storeContent = storeContent.replace(
    'const payload = { ...c };',
    `const payload = { ...c };
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) payload.user_id = session.user.id;`
  );
  fs.writeFileSync('src/lib/store.tsx', storeContent);
}

// 3. Fix Sidebar.tsx
let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
if (!sidebarContent.includes('handleLogout')) {
  sidebarContent = sidebarContent.replace(
    "import { usePathname } from 'next/navigation';",
    "import { usePathname, useRouter } from 'next/navigation';\nimport { supabase } from '@/lib/supabase';"
  );

  sidebarContent = sidebarContent.replace(
    "const pathname = usePathname();",
    "const pathname = usePathname();\n  const router = useRouter();\n  const handleLogout = async () => {\n    await supabase.auth.signOut();\n    router.push('/login');\n  };"
  );

  sidebarContent = sidebarContent.replace(
    '</div>\n    </div>\n  );',
    '</div>\n      \n      <div className="px-6 pb-6">\n        <button onClick={handleLogout} className="w-full py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg text-sm font-medium transition-colors">\n          Log Out\n        </button>\n      </div>\n    </div>\n  );'
  );
  fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);
}
