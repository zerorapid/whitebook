"use client";
import { Plug, Server, Database, Code, Globe, Lock, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

export default function MCPPage() {
  const [connected, setConnected] = useState<string[]>(['Google Calendar MCP']);
  const [showModal, setShowModal] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

    
  const handleAddCustom = () => {
    const url = window.prompt("Enter your custom MCP Server URL (e.g., http://localhost:3000/sse):");
    if (url) {
      const serverName = "Custom: " + url.replace(/^https?:\/\//, '').split('/')[0];
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

  const toggle = async (name: string) => {
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
  };

  
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


  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Plug className="w-8 h-8 text-primary" />
          Model Context Protocol
        </h1>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-2xl">
          Whitebook doesn't use traditional integrations. Instead, we use <strong>MCP (Model Context Protocol)</strong>. 
          Connect standardized context servers to give your AI Assistant ("Dude") direct, secure access to your digital life without writing custom API connections.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 pt-4">
        {platforms.map((p, i) => {
          const isConnected = connected.includes(p.name);
          return (
            <div key={i} className="bg-card border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                {isConnected ? (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-full uppercase tracking-wider">
                    <Circle className="w-3 h-3" /> Disconnected
                  </div>
                )}
              </div>
              
              <div>
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <p.icon className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="font-bold text-lg">{p.name}</h3>
                <span className="inline-block mt-1 mb-3 text-[10px] font-black uppercase tracking-widest text-primary/70 bg-primary/5 px-2 py-0.5 rounded">
                  {p.type} Server
                </span>
                
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {p.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Lock className="w-3.5 h-3.5" /> Local execution
                </span>
                <button 
                  onClick={() => toggle(p.name)}
                  className={"px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 " + (
                    isConnected 
                      ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20' 
                      : 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
                  )}
                >
                  {isConnected ? 'Disconnect' : 'Connect Server'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-3xl flex items-center justify-between gap-6 flex-col sm:flex-row">
        <div>
          <h3 className="font-bold text-lg mb-1">Add Custom MCP Server</h3>
          <p className="text-sm text-muted-foreground">Have a private database or internal tool? Run a custom MCP server script and paste the connection URL here.</p>
        </div>
        <button onClick={handleAddCustom} className="shrink-0 px-6 py-3 bg-background border-2 border-primary/20 text-primary font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all active:scale-95">
          + Add Connection URL
        </button>
      </div>
    
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

    </div>
  );
}
