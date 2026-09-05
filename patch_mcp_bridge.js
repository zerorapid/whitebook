const fs = require('fs');
let code = fs.readFileSync('src/app/mcp/page.tsx', 'utf8');

// Add states for modal
if (!code.includes("showModal")) {
  code = code.replace(
    "const [connected, setConnected] = useState<string[]>(['Google Calendar MCP', 'Local File System']);",
    `const [connected, setConnected] = useState<string[]>(['Google Calendar MCP']);
  const [showModal, setShowModal] = useState(false);
  const [isPolling, setIsPolling] = useState(false);`
  );
}

// Modify the toggle function to handle Local File System specifically
const newToggle = `  const toggle = async (name: string) => {
    if (name === 'Local File System') {
      if (connected.includes(name)) {
        setConnected(p => p.filter(n => n !== name));
      } else {
        setShowModal(true);
        startPolling(name);
      }
      return;
    }
    setConnected(p => p.includes(name) ? p.filter(n => n !== name) : [...p, name]);
  };

  const startPolling = (name: string) => {
    setIsPolling(true);
    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:8181/ping');
        if (res.ok) {
          clearInterval(interval);
          setIsPolling(false);
          setShowModal(false);
          setConnected(p => [...p, name]);
          // Dispatch event or save to local storage so Dude knows it's available
          localStorage.setItem('mcp_bridge_active', 'true');
        }
      } catch (e) {
        // bridge not running yet
      }
    }, 2000);
    
    // Cleanup after 2 minutes
    setTimeout(() => {
      clearInterval(interval);
      setIsPolling(false);
    }, 120000);
  };`;

code = code.replace(/const toggle = \(name: string\) => \{[\s\S]*?\};\n/, newToggle + "\n");

// Add Modal UI at the bottom before final closing div
const modalUI = `
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border/60 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => { setShowModal(false); setIsPolling(false); }} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground">
              ✕
            </button>
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Server className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-center tracking-tight mb-2">Connect Local Bridge</h2>
            <p className="text-muted-foreground text-center text-sm mb-8 leading-relaxed">
              To allow Whitebook to securely access your local files and MCP servers, run this lightweight bridge script in your terminal.
            </p>
            
            <div className="bg-black text-emerald-400 p-4 rounded-xl font-mono text-sm flex justify-between items-center overflow-x-auto shadow-inner border border-gray-800">
              <code className="whitespace-nowrap mr-4">npx ts-node https://whitebook.app/bridge.js</code>
              <button 
                onClick={() => navigator.clipboard.writeText('curl -sL https://whitebook.app/bridge.js | node')} 
                className="shrink-0 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              >
                Copy
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-3 text-sm font-semibold text-primary">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Waiting for connection on localhost:8181...
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(/<\/div>\n  \);\n\}/, modalUI + "\n    </div>\n  );\n}");

fs.writeFileSync('src/app/mcp/page.tsx', code);
