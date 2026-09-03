"use client";
import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Plus, Filter, MoreHorizontal, 
  Mail, Phone, Building2, MapPin, Check, Star, ArrowUpRight
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function ContactsDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const { contacts } = useStore();

  const filteredContacts = contacts.filter((c: any) => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Directory</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage and search your professional network.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-5">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <Link href="/contacts" className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all bg-foreground text-background hover:bg-foreground/90 hover:scale-105 active:scale-95 h-10 px-5 shadow-lg shadow-black/5">
            <Plus className="w-4 h-4 mr-2" />
            New Contact
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto md:mx-0 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search className="h-5 w-5" />
        </div>
        <input 
          type="text" 
          placeholder="Search by name, role, or company..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-11 pr-4 py-3.5 bg-card border border-border rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
        />
      </div>

      {/* Grid Layout - Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact: any, idx: number) => (
          <div 
            key={contact.id} 
            className="group relative bg-card rounded-2xl border border-border/60 hover:border-border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* VIP Star */}
            {contact.tags.includes('VIP') && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            )}
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <img 
                  src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} 
                  alt={contact.name} 
                  className="w-20 h-20 rounded-full bg-secondary border-4 border-background shadow-sm" 
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full"></div>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground tracking-tight">{contact.name}</h3>
                <p className="text-sm font-medium text-primary">{contact.role}</p>
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground mt-1">
                  <Building2 className="w-3.5 h-3.5" /> {contact.company}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/40 grid grid-cols-3 gap-2">
              <a href={`mailto:${contact.email}`} className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors group/btn">
                <Mail className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Email</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors group/btn">
                <Phone className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Call</span>
              </a>
              <Link href={`/contacts/${contact.id}`} className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors group/btn">
                <ArrowUpRight className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">View</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {filteredContacts.length === 0 && (
        <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-bold">No contacts found</h3>
          <p className="text-muted-foreground text-sm mt-1">Try adjusting your search terms or add a new contact.</p>
        </div>
      )}
    </div>
  );
}
