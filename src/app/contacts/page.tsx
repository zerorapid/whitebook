"use client";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, Plus, Filter, 
  Mail, Phone, Building2, Star, ArrowUpRight, Sparkles, MapPin, MoreHorizontal
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function ContactsDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const { contacts } = useStore();

  const filteredContacts = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') return contacts;
    const query = searchQuery.toLowerCase().trim();
    
    return contacts.filter((c: any) => {
      // Safely check properties
      const name = c.name?.toLowerCase() || '';
      const role = c.role?.toLowerCase() || '';
      const company = c.company?.toLowerCase() || '';
      const location = c.location?.toLowerCase() || '';
      
      const basicMatch = 
        name.includes(query) ||
        role.includes(query) ||
        company.includes(query) ||
        location.includes(query);

      let semanticMatch = false;
      
      const worksMatch = query.match(/(?:works at|at)\s+(.+)/);
      if (worksMatch && worksMatch[1]) {
        if (company.includes(worksMatch[1].trim())) semanticMatch = true;
      }
      
      const livesMatch = query.match(/(?:lives in|in)\s+(.+)/);
      if (livesMatch && livesMatch[1]) {
        if (location.includes(livesMatch[1].trim())) semanticMatch = true;
      }
      
      if (query.includes("vip") && c.tags?.includes("VIP")) {
        semanticMatch = true;
      }

      return basicMatch || semanticMatch;
    });
  }, [contacts, searchQuery]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Directory</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage and search your professional network.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/contacts/new" className="inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all bg-primary text-primary-foreground hover:opacity-90 active:scale-95 h-11 px-5 shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Contact
          </Link>
        </div>
      </div>

      <div className="relative max-w-2xl group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search className="h-5 w-5" />
        </div>
        <input 
          type="text" 
          placeholder="Try 'Works at Google' or 'Lives in New York'..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-11 pr-32 py-3.5 bg-card border border-border/60 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm outline-none"
        />
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-500/20">
            <Sparkles className="w-3 h-3" /> Smart Search
          </div>
        </div>
      </div>

      {/* SaaS Style Data Table */}
      <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b border-border/60">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Contact</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Role & Company</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Location</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Status</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredContacts.map((contact: any) => (
                <tr key={contact.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={contact.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} 
                        alt={contact.name} 
                        className="w-10 h-10 rounded-full bg-secondary border border-border/50" 
                      />
                      <div>
                        <div className="font-bold text-foreground text-sm">{contact.name}</div>
                        <div className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {contact.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground text-sm">{contact.role}</div>
                    <div className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3" /> {contact.company}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {contact.location || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {contact.tags?.includes('VIP') ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        <Star className="w-3 h-3 fill-current" /> VIP
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-secondary text-secondary-foreground border border-border/50">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={`mailto:${contact.email}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Email">
                        <Mail className="w-4 h-4" />
                      </a>
                      <a href={`tel:${contact.phone || ''}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Call">
                        <Phone className="w-4 h-4" />
                      </a>
                      <Link href={`/contacts/${contact.id}`} className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors" title="View Profile">
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                    {/* Fallback for mobile (always visible dots icon that could trigger a menu, but for now just points to profile) */}
                    <Link href={`/contacts/${contact.id}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors md:hidden ml-auto">
                      <MoreHorizontal className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
              
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-semibold">
                    No contacts found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
