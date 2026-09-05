const fs = require('fs');
let code = fs.readFileSync('src/app/login/page.tsx', 'utf8');

code = code.replace(`
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">White Book</h1>
          <p className="text-white/50 mt-2 text-sm">Secure Private Network Directory</p>
        </div>`, '');

fs.writeFileSync('src/app/login/page.tsx', code);
