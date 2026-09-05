const fs = require('fs');
let code = fs.readFileSync('src/app/mcp/page.tsx', 'utf8');

// The shell escaped the backticks in className, let's fix the class string
code = code.replace(/className=\{\\\`px-5 py-2\.5/g, 'className={`px-5 py-2.5');
code = code.replace(/shadow-sm'\\n\s*\}\\\`\}/g, "shadow-sm'\n                  }`}");
code = code.replace(/shadow-sm'\\n                  }\\`}/g, "shadow-sm'\n                  }`}");
// Just generic fix for backslash-escaped backticks
code = code.replace(/\\`/g, '`');

fs.writeFileSync('src/app/mcp/page.tsx', code);
