"use client";
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Camera, X, Mic, Loader2, Wrench, CheckCircle2, XCircle, FileCode2 } from 'lucide-react';
import { useStore } from '@/lib/store';


import { MiniContactCard } from '@/components/MiniContactCard';

type Message = { role: 'ai' | 'user'; text: string; image?: string };

export default function AssistantPage() {
  const { contacts } = useStore();
  const [messages, setMessages] = useState<Message[]>([{ 
    role: 'ai', 
    text: "Hello! I am Dude. I can analyze your network, find duplicates, or help you recall who works where. You can also tap the camera icon to scan a business card and ask me to save it!" 
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedImage]);

  const renderMessageContent = (text: string) => {
    const contactsMatch = text.match(/<CONTACTS>(\[.*?\])<\/CONTACTS>/);
    let cleanText = text;
    let contactIds: any[] = [];
    
    if (contactsMatch) {
      cleanText = text.replace(contactsMatch[0], '').trim();
      try { contactIds = JSON.parse(contactsMatch[1]); } catch(e) {}
    }

    const toolMatch = cleanText.match(/<TOOL>(.*?)<\/TOOL>/);
    let toolName = null;
    if (toolMatch) {
      toolName = toolMatch[1];
      cleanText = cleanText.replace(toolMatch[0], '').trim();
    }

    const approvalMatch = cleanText.match(/<APPROVAL title="(.*?)">([\s\S]*?)<\/APPROVAL>/);
    let approvalTitle = null;
    let approvalBody = null;
    if (approvalMatch) {
      approvalTitle = approvalMatch[1];
      approvalBody = approvalMatch[2];
      cleanText = cleanText.replace(approvalMatch[0], '').trim();
    }

    const segments = cleanText.split(/(```[\s\S]*?```)/g);

    return (
      <div className="flex flex-col w-full space-y-4">
        
        {toolName && (
          <div className="flex items-center gap-2 text-[11px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-full w-fit animate-in fade-in zoom-in duration-300">
            <Wrench className="w-3 h-3" />
            {toolName}
          </div>
        )}

        <div className="space-y-3">
          {segments.map((segment, idx) => {
            if (segment.startsWith('```')) {
              const lines = segment.replace(/^```\w*\n|\n```$/g, '').split('\n');
              return (
                <div key={idx} className="my-2 rounded-xl bg-[#1E1E1E] border border-white/10 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border-b border-white/5 text-white/50 text-xs font-mono font-bold">
                    <FileCode2 className="w-3.5 h-3.5" /> code snippet
                  </div>
                  <div className="p-4 overflow-x-auto text-xs font-mono text-emerald-400">
                    {lines.map((l, i) => <div key={i}>{l}</div>)}
                  </div>
                </div>
              );
            } else if (segment.trim().length > 0) {
              return segment.split('\n').map((line, j) => (
                <p key={j} className="leading-relaxed">{line}</p>
              ));
            }
            return null;
          })}
        </div>

        {approvalTitle && (
          <div className="mt-2 bg-background border border-border/60 rounded-2xl p-4 shadow-sm relative overflow-hidden group animate-in slide-in-from-bottom-2">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            <h4 className="font-bold text-sm mb-1">{approvalTitle}</h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{approvalBody}</p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert("Action Approved!")}
                className="flex-1 bg-primary text-primary-foreground text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
              </button>
              <button 
                onClick={() => alert("Action Rejected")}
                className="flex-1 bg-muted text-muted-foreground text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-muted/80 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            </div>
          </div>
        )}

        {contactIds.length > 0 && (
          <div className="pt-2">
            <p className="text-[10px] font-bold text-primary/70 uppercase tracking-wider mb-2">Attached Context</p>
            <div className="flex flex-col gap-2">
              {contactIds.map(id => {
                const c = contacts.find(c => c.id === id);
                if (!c) return null;
                return (
                  <div key={id} className="flex items-center gap-3 bg-card border border-border/40 rounded-xl p-2.5 shadow-sm hover:shadow-md cursor-pointer transition-all">
                    <img src={c.avatar} className="w-8 h-8 rounded-full bg-secondary" />
                    <div>
                      <div className="text-sm font-semibold leading-none">{c.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{c.company}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userText = input.trim();
    const imageToSend = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { role: 'user', text: userText, image: imageToSend || undefined }]);
    setIsLoading(true);

    try {
      let finalPrompt = userText;

      if (imageToSend) {
        setMessages(prev => [...prev, { role: 'ai', text: "*Dude is scanning your business card...*" }]);
        const scanRes = await fetch('/api/scanner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: imageToSend })
        });
        
        const scanData = await scanRes.json();
        
        if (scanRes.ok && scanData) {
          setMessages(prev => prev.slice(0, -1));
          finalPrompt = `I just scanned a business card. Here is the extracted data in JSON format: ${JSON.stringify(scanData)}. 
The user also added this message: "${userText}". 
Please acknowledge the card details, summarize who they are, and ask if I should add them to the CRM. Your name is Dude.`;
        } else {
          setMessages(prev => prev.slice(0, -1));
          throw new Error("Dude failed to read the business card.");
        }
      }

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt, contacts })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: `Error: ${data.error}` }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'ai', text: err.message || "Dude is offline." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-11rem)] md:h-[calc(100vh-9rem)] max-w-4xl mx-auto bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm animate-in fade-in duration-500">
      
      <div className="p-4 md:p-6 border-b border-border/40 flex items-center gap-4 bg-muted/10">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-md">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Dude</h1>
          <p className="text-sm text-muted-foreground font-medium">Your Invisible Assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-secondary' : 'bg-primary text-primary-foreground'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-muted-foreground" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`max-w-[80%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.image && (
                <div className="p-1.5 bg-secondary rounded-2xl rounded-tr-none border shadow-sm">
                  <img src={msg.image} alt="Scanned Card" className="max-w-[200px] md:max-w-[250px] rounded-xl object-cover" />
                </div>
              )}
              {msg.text && (
                <div className={`rounded-2xl p-4 text-sm shadow-sm ${msg.role === 'user' ? (msg.image ? 'bg-secondary text-foreground rounded-tr-none mt-1' : 'bg-secondary text-foreground rounded-tr-none') : 'bg-primary/10 border border-primary/20 text-foreground rounded-tl-none w-full'}`}>
                  {msg.role === 'ai' ? renderMessageContent(msg.text) : (
                    msg.text.split('\n').map((line, j) => (
                      <p key={j} className={j > 0 ? 'mt-2' : ''}>{line}</p>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 rounded-tl-none flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4 bg-secondary/30 border-t flex flex-col items-center">
        {selectedImage && (
          <div className="w-full max-w-3xl mb-3 relative animate-in slide-in-from-bottom-2">
            <div className="inline-block relative">
              <img src={selectedImage} alt="Preview" className="h-20 rounded-lg border shadow-sm object-cover" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:scale-110 transition-transform"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSend} className="relative flex items-center w-full max-w-3xl">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleImageUpload}
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute left-2 w-10 h-10 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full flex items-center justify-center transition-all z-10"
            title="Scan Business Card"
          >
            <Camera className="w-5 h-5" />
          </button>

          <button 
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`absolute left-12 w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse shadow-md' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Voice Note"
          >
            {isTranscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isRecording || isTranscribing}
            placeholder={
              isRecording ? "Listening..." : 
              isTranscribing ? "Transcribing..." : 
              "Ask Dude, take a voice note, or scan a card..."
            }
            className="w-full bg-background border rounded-full py-4 pl-24 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:opacity-70 disabled:bg-muted/50"
          />
          <button 
            type="submit" 
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="absolute right-2 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-all z-10"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
