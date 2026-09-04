#!/bin/bash
set -e
cd /Users/Jayapalreddy/.gemini/antigravity/scratch/crm-os-next

# 1. Fix Scanner Page 'Save Contact' Button
cat << 'SCANNER' > src/app/scanner/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scan, Camera, Upload, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function ScannerPage() {
  const router = useRouter();
  const { addContact } = useStore();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2000);
  };

  const handleSaveContact = () => {
    addContact({
      id: Date.now(),
      name: "Alexander Pierce",
      company: "Stark Industries",
      role: "Director",
      email: "alex@stark.com",
      phone: "+1 (555) 019-2834",
      location: "New York, NY",
      tags: ["Scanned"],
      lastContact: "Just now"
    });
    router.push('/contacts');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Scan className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Business Card Scanner</h1>
        <p className="text-muted-foreground text-sm font-medium">Snap a card and our AI will transcribe it into a structured contact in seconds.</p>
      </div>

      {!scanned ? (
        <div className="rounded-3xl border-2 border-dashed border-border/60 bg-card/50 p-12 text-center hover:bg-muted/30 transition-colors cursor-pointer group" onClick={handleScan}>
          {scanning ? (
            <div className="space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold text-primary animate-pulse">Extracting contact details via AI...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-background border shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform"><Camera className="w-5 h-5 text-muted-foreground" /></div>
                <div className="w-12 h-12 rounded-full bg-background border shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform"><Upload className="w-5 h-5 text-muted-foreground" /></div>
              </div>
              <div>
                <p className="text-base font-semibold">Click to capture or upload card</p>
                <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, and PDF</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-8 shadow-lg animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <h3 className="text-lg font-bold">Transcription Complete</h3>
          </div>
          <div className="space-y-4 bg-muted/30 p-4 rounded-xl border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Full Name</label>
                <div className="font-medium">Alexander Pierce</div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Company</label>
                <div className="font-medium">Stark Industries</div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email</label>
                <div className="font-medium text-primary">alex@stark.com</div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Phone</label>
                <div className="font-medium">+1 (555) 019-2834</div>
              </div>
            </div>
          </div>
          <button onClick={handleSaveContact} className="w-full mt-6 bg-primary text-primary-foreground h-11 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
            Save Contact <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
SCANNER

# 2. Fix Contact Profile "Save Note" Button
node -e "
const fs = require('fs');
let content = fs.readFileSync('src/app/contacts/[id]/page.tsx', 'utf8');

// Add the updateContact function from useStore
content = content.replace('const { contacts } = useStore();', 'const { contacts, updateContact } = useStore();');

// Add a handleSaveNote function
const saveNoteFunc = \`
  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    const updatedNotes = (contact.notes ? contact.notes + '\\n\\n' : '') + newNote;
    updateContact(contact.id, { notes: updatedNotes });
    setNewNote('');
  };
\`;
content = content.replace('if (!contact) return notFound();', saveNoteFunc + '\n  if (!contact) return notFound();');

// Attach the handleSaveNote function to the button
content = content.replace('<button className=\"px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors\">\\n                    Save Note', '<button onClick={handleSaveNote} className=\"px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors\">\\n                    Save Note');

fs.writeFileSync('src/app/contacts/[id]/page.tsx', content);
"
