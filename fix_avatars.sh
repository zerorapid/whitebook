#!/bin/bash
set -e
cd /Users/Jayapalreddy/.gemini/antigravity/scratch/crm-os-next

# 1. Update New Contact Page with Avatar Picker and File Upload
cat << 'NEWCONTACT' > src/app/contacts/new/page.tsx
"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, RefreshCw, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

export default function NewContactPage() {
  const router = useRouter();
  const { addContact } = useStore();
  
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  
  // Avatar states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [avatarStyle, setAvatarStyle] = useState('micah');
  const [avatarSeedModifier, setAvatarSeedModifier] = useState('');

  const styles = [
    { id: 'micah', label: 'Default' },
    { id: 'notionists', label: 'Sketch' },
    { id: 'bottts', label: 'Robot' },
    { id: 'initials', label: 'Initials' }
  ];

  const currentSeed = encodeURIComponent((name || 'New Contact') + avatarSeedModifier);
  const generatedAvatarUrl = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${currentSeed}&backgroundColor=transparent`;
  const displayAvatar = customAvatar || generatedAvatarUrl;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const shuffleAvatar = (e: React.MouseEvent) => {
    e.preventDefault();
    setCustomAvatar(null); // Clear custom upload if shuffling
    setAvatarSeedModifier(Math.random().toString(36).substring(7));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addContact({
      id: Date.now(),
      name,
      company,
      role,
      email,
      phone,
      location,
      tags: ["New"],
      lastContact: "Never",
      avatar: displayAvatar
    });
    
    router.push('/contacts');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/contacts" className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Profile</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">Add a new connection to your directory.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Avatar Picker Section */}
        <div className="bg-card border rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="shrink-0 relative group">
            <div className="w-32 h-32 rounded-full bg-secondary border-4 border-background shadow-xl overflow-hidden flex items-center justify-center">
              <img src={displayAvatar} className="w-full h-full object-cover" alt="Avatar Preview" />
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
              title="Upload custom photo"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          
          <div className="flex-1 w-full space-y-4 text-center md:text-left">
            <div>
              <h3 className="font-bold text-lg">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">Upload a photo or choose a generative avatar.</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {styles.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setCustomAvatar(null); setAvatarStyle(s.id); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${avatarStyle === s.id && !customAvatar ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                >
                  {s.label}
                </button>
              ))}
              <button 
                type="button" 
                onClick={shuffleAvatar} 
                className="px-3 py-1.5 text-xs font-bold rounded-full border bg-background text-muted-foreground hover:bg-muted transition-all flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Shuffle
              </button>
            </div>
            {customAvatar && (
              <button 
                type="button"
                onClick={() => setCustomAvatar(null)}
                className="text-xs text-rose-500 font-semibold hover:underline"
              >
                Remove uploaded photo
              </button>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-card border rounded-3xl p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
              <input 
                required 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Jane Doe" 
                className="w-full p-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company</label>
              <input 
                type="text" 
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp" 
                className="w-full p-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Role / Title</label>
              <input 
                type="text" 
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. CEO" 
                className="w-full p-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane@example.com" 
                className="w-full p-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</label>
              <input 
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000" 
                className="w-full p-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</label>
              <input 
                type="text" 
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA" 
                className="w-full p-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground" 
              />
            </div>
          </div>
          
          <div className="pt-6 border-t border-border/50">
            <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              Create Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
NEWCONTACT

# 2. Update Image Tags Globally to respect `contact.avatar`
node -e "
const fs = require('fs');

const replaceInFile = (file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace standard dicebear hardcoded strings with a check for contact.avatar
    content = content.replace(
      /\`https:\/\/api\.dicebear\.com\/7\.x\/micah\/svg\?seed=\\\$\{encodeURIComponent\(contact\.name\)\}&backgroundColor=transparent\`/g,
      'contact.avatar || \\`https://api.dicebear.com/7.x/micah/svg?seed=\\${encodeURIComponent(contact.name)}&backgroundColor=transparent\\`'
    );
    fs.writeFileSync(file, content);
  }
};

['src/app/contacts/page.tsx', 'src/app/contacts/[id]/page.tsx', 'src/app/groups/page.tsx'].forEach(replaceInFile);
"
