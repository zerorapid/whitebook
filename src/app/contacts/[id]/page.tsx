"use client";
import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Mail, MapPin, Briefcase, Calendar, Building2, 
  Globe, Users, Phone, Edit2, MoreHorizontal, Archive, 
  Trash2, X, FileText, Camera, Paperclip, Clock, CalendarClock, Download,
  Linkedin, Twitter, Instagram
} from 'lucide-react';
import { notFound } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function ContactDetail({ params }: { params: { id: string } }) {
  const { contacts, updateContact } = useStore();
  const contact = contacts.find((c: any) => c.id === parseInt(params.id));
  
  const [activeTab, setActiveTab] = useState('notes');
  const [newNote, setNewNote] = useState('');

  
  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    const updatedNotes = (contact.notes ? contact.notes + '\n\n' : '') + newNote;
    updateContact(contact.id, { notes: updatedNotes });
    setNewNote('');
  };

  if (!contact) return notFound();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link href="/contacts" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Link>
        <div className="flex items-center gap-2">
          <button className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
          <button className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Header Profile */}
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-4">
            <div className="relative">
              <img 
                src={contact.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} 
                alt={contact.name} 
                className="w-24 h-24 rounded-full bg-background border-4 border-background shadow-md" 
              />
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-background rounded-full"></div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full shadow-sm hover:bg-primary/90 transition-all">
                Send Message
              </button>
              <button className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full shadow-sm hover:bg-secondary/80 transition-all">
                Schedule Meeting
              </button>
            </div>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              {contact.name}
              {contact.tags.includes('VIP') && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">VIP</span>}
            </h1>
            <p className="text-lg font-medium text-muted-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> {contact.role} at <span className="text-foreground font-semibold">{contact.company}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 text-primary" /> <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">{contact.email}</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" /> {contact.location}
            </div>
            {contact.birthday && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" /> Birthday: {contact.birthday}
              </div>
            )}
            {contact.followUp && (
              <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-md">
                <CalendarClock className="w-4 h-4" /> Follow-up: {contact.followUp}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Custom Tabs */}
          <div className="flex border-b border-border/60 gap-6">
            <button 
              onClick={() => setActiveTab('notes')}
              className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'notes' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Notes & Memory
              {activeTab === 'notes' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'docs' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Documents & Files
              {activeTab === 'docs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('activity')}
              className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'activity' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Activity Feed
              {activeTab === 'activity' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'notes' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-card rounded-2xl border shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4">Add a Note</h3>
                <textarea 
                  className="w-full h-24 p-3 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="Write a one-liner to remember this interaction..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-3">
                  <button onClick={handleSaveNote} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                    Save Note
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-card p-5 rounded-2xl border shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-sm">Meeting Context</div>
                    <div className="text-xs text-muted-foreground font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Oct 15, 2025</div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{contact.notes || "Met at the annual conference. Expressed interest in our new product line."}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="rounded-3xl border-2 border-dashed border-border/60 bg-card/50 p-10 text-center hover:bg-muted/30 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-background border shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Paperclip className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold">Upload a Document</p>
                <p className="text-xs text-muted-foreground mt-1">Contracts, NDAs, or Proposals (PDF, DOCX)</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                    <div>
                      <div className="font-semibold text-sm">Signed_NDA_2025.pdf</div>
                      <div className="text-xs text-muted-foreground font-medium">Added 2 weeks ago • 2.4 MB</div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors"><Download className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center justify-between p-4 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                    <div>
                      <div className="font-semibold text-sm">Q3_Proposal.docx</div>
                      <div className="text-xs text-muted-foreground font-medium">Added 1 month ago • 1.1 MB</div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors"><Download className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-card rounded-2xl border shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="relative border-l border-muted-foreground/20 ml-3 space-y-8 py-2">
                <div className="relative pl-6">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background"></div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">Today, 10:45 AM</div>
                  <div className="text-sm font-semibold">AI Assistant enriched profile</div>
                  <div className="text-sm text-muted-foreground mt-1">Automatically updated job title from LinkedIn.</div>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">Oct 12, 2025</div>
                  <div className="text-sm font-semibold">Sent Follow-up Email</div>
                  <div className="text-sm text-muted-foreground mt-1">Synced via Gmail integration.</div>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-background"></div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">Oct 1, 2025</div>
                  <div className="text-sm font-semibold">Contact Created</div>
                  <div className="text-sm text-muted-foreground mt-1">Imported from iOS Contacts.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border shadow-sm p-6">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Social Profiles</h3>
            <div className="flex gap-3">
              <a 
                href={contact.linkedin || '#'} 
                target={contact.linkedin ? "_blank" : "_self"}
                className={`p-2.5 rounded-xl transition-colors flex items-center justify-center ${contact.linkedin ? 'bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20' : 'bg-muted text-muted-foreground/40 cursor-not-allowed grayscale'}`}
              >
                 <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href={contact.twitter || '#'} 
                target={contact.twitter ? "_blank" : "_self"}
                className={`p-2.5 rounded-xl transition-colors flex items-center justify-center ${contact.twitter ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white hover:bg-black/10 dark:hover:bg-white/20' : 'bg-muted text-muted-foreground/40 cursor-not-allowed grayscale'}`}
              >
                 <Twitter className="w-5 h-5" />
              </a>
              <a 
                href={contact.instagram || '#'} 
                target={contact.instagram ? "_blank" : "_self"}
                className={`p-2.5 rounded-xl transition-colors flex items-center justify-center ${contact.instagram ? 'bg-[#e1306c]/10 text-[#e1306c] hover:bg-[#e1306c]/20' : 'bg-muted text-muted-foreground/40 cursor-not-allowed grayscale'}`}
              >
                 <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {contact.business_card_image && (
            <div className="bg-card rounded-2xl border shadow-sm p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Physical Card</h3>
              <a href={contact.business_card_image} target="_blank" rel="noreferrer" className="block rounded-xl overflow-hidden border shadow-sm hover:opacity-90 transition-opacity">
                 <img src={contact.business_card_image} alt="Visiting Card" className="w-full object-cover" />
              </a>
            </div>
          )}

          <div className="bg-card rounded-2xl border shadow-sm p-6">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Tags & Cohorts</h3>
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-muted text-foreground text-xs font-semibold rounded-full">
                  {tag}
                </span>
              ))}
              <button className="px-3 py-1 border border-dashed border-muted-foreground/40 text-muted-foreground text-xs font-semibold rounded-full hover:bg-muted transition-colors">
                + Add Tag
              </button>
            </div>
          </div>
          
          <div className="bg-card rounded-2xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Reminders</h3>
              <button className="text-xs font-semibold text-primary hover:underline">Add New</button>
            </div>
            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex items-start gap-3">
              <CalendarClock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-amber-900">Follow-up Call</div>
                <div className="text-xs font-medium text-amber-700/70 mt-0.5">Due Tomorrow • Calendar Synced</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
