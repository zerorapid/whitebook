const fs = require('fs');
let code = fs.readFileSync('src/app/mcp/page.tsx', 'utf8');

const badButton = code.match(/<button[\s\S]*?onClick=\{\(\) => toggle\(p\.name\)\}[\s\S]*?>/);
if (badButton) {
  const replacement = \`<button 
                  onClick={() => toggle(p.name)}
                  className={"px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 " + (
                    isConnected 
                      ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20' 
                      : 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
                  )}
                >\`;
  code = code.replace(badButton[0], replacement);
  fs.writeFileSync('src/app/mcp/page.tsx', code);
}
