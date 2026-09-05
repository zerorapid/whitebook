const fs = require('fs');
let code = fs.readFileSync('src/app/mcp/page.tsx', 'utf8');

// Step 1: Make platforms dynamic
const initialPlatforms = `
  const [platforms, setPlatforms] = useState([
    { 
      name: "Google Calendar MCP", 
      icon: Globe, 
      desc: "Allow 'Dude' to check your schedule before suggesting meetings or follow-ups.", 
      type: "Official",
      status: "active" 
    },
    { 
      name: "Local File System", 
      icon: Server, 
      desc: "Connect a local directory so Dude can read your notes or parse raw exported contacts.", 
      type: "Local",
      status: "active"
    },
    { 
      name: "GitHub Repository MCP", 
      icon: Code, 
      desc: "Give Dude access to your codebases to map contributors directly to your contacts.", 
      type: "Community",
      status: "inactive"
    },
    { 
      name: "Slack Workspace MCP", 
      icon: Database, 
      desc: "Automatically sync Slack channel members into your Whitebook network.", 
      type: "Official",
      status: "inactive"
    }
  ]);
`;
code = code.replace(/const platforms = \[\s*\{\s*name: "Google Calendar MCP"[\s\S]*?\];/m, initialPlatforms);

// Step 2: Add onClick handler
const handleAddCustom = `
  const handleAddCustom = () => {
    const url = window.prompt("Enter your custom MCP Server URL (e.g., http://localhost:3000/sse):");
    if (url) {
      const serverName = "Custom: " + url.replace(/^https?:\\/\\//, '').split('/')[0];
      setPlatforms([...platforms, {
        name: serverName,
        icon: Database,
        desc: "Custom MCP Server connected via " + url,
        type: "Custom",
        status: "active"
      }]);
      setConnected([...connected, serverName]);
    }
  };
`;
code = code.replace(/const toggle = async/m, handleAddCustom + "\n  const toggle = async");

// Step 3: Attach onClick to the button
code = code.replace(
  /<button className="shrink-0 px-6 py-3 bg-background border-2 border-primary\/20 text-primary font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">\s*\+ Add Connection URL\s*<\/button>/m,
  `<button onClick={handleAddCustom} className="shrink-0 px-6 py-3 bg-background border-2 border-primary/20 text-primary font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all active:scale-95">\n          + Add Connection URL\n        </button>`
);

fs.writeFileSync('src/app/mcp/page.tsx', code);
