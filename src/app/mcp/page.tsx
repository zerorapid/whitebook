"use client";
import { Plug, Server, Database, Code, Globe, Lock, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

export default function MCPPage() {
  const [connected, setConnected] = useState<string[]>(['Google Calendar MCP', 'Local File System']);

  const toggle = (name: string) => {
    setConnected(p => p.includes(name) ? p.filter(n => n !== name) : [...p, name]);
  };

  const platforms = [
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
  ];

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
        <button className="shrink-0 px-6 py-3 bg-background border-2 border-primary/20 text-primary font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
          + Add Connection URL
        </button>
      </div>
    </div>
  );
}
