"use client";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, Plus, Filter, ArrowDownUp, Tag,
  Mail, Phone, Building2, Star, ArrowUpRight, Sparkles, MapPin, MoreHorizontal
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { ContactModal } from '@/components/ContactModal';

export default function ContactsDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const { contacts } = useStore();

  const formatLocationShortcut = (loc: string) => {
    if (!loc) return '-';
    let cleanLoc = loc.replace(/,\s*(USA|United States|India|UK|United Kingdom)$/i, '');
    cleanLoc = cleanLoc.replace(/\b([A-Z]{2})\s+\d{5}(?:-\d{4})?\b/gi, '$1');
    const parts = cleanLoc.split(',').map(s => s.trim());
    if (parts.length >= 3) {
      return parts[parts.length - 2] + ', ' + parts[parts.length - 1];
    }
    const stateMap: Record<string, string> = {
      "california": "CA", "new york": "NY", "texas": "TX", "florida": "FL",
      "washington": "WA", "illinois": "IL", "pennsylvania": "PA", "georgia": "GA",
      "tamil nadu": "TN", "delhi": "DL", "maharashtra": "MH", "karnataka": "KA"
    };
    if (parts.length === 2) {
      const state = parts[1].toLowerCase();
      if (stateMap[state]) {
        return parts[0] + ', ' + stateMap[state];
      }
    }
    return cleanLoc;
  };

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
    <div className="space-y-8 pb-12 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
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

      
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative flex-1 group">
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
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-3.5 bg-card border border-border/60 rounded-xl text-sm font-bold shadow-sm hover:bg-muted transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-3.5 bg-card border border-border/60 rounded-xl text-sm font-bold shadow-sm hover:bg-muted transition-colors whitespace-nowrap">
            <ArrowDownUp className="w-4 h-4 text-muted-foreground" />
            Sort By
          </button>
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
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Labels</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredContacts.map((contact: any) => (
                <tr 
                  key={contact.id} 
                  onClick={() => setSelectedContact(contact)}
                  className="hover:bg-muted/20 transition-colors group cursor-pointer"
                >
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
                      {formatLocationShortcut(contact.location)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {contact.tags && contact.tags.length > 0 ? (
                        contact.tags.map((tag: string, idx: number) => {
                          const isVIP = tag.toUpperCase() === 'VIP';
                          return (
                            <span 
                              key={idx} 
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                isVIP 
                                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
                                  : 'bg-primary/5 text-primary border-primary/10'
                              }`}
                            >
                              {isVIP && <Star className="w-2.5 h-2.5 fill-current" />}
                              {!isVIP && <Tag className="w-2.5 h-2.5" />}
                              {tag}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No labels</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={`mailto:${contact.email}`} onClick={e => e.stopPropagation()} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Email">
                        <Mail className="w-4 h-4" />
                      </a>
                      <a href={`tel:${contact.phone || ''}`} onClick={e => e.stopPropagation()} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Call">
                        <Phone className="w-4 h-4" />
                      </a>
                      <Link href={`/contacts/${contact.id}`} onClick={e => e.stopPropagation()} className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors" title="View Profile">
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                    {/* Fallback for mobile */}
                    <button onClick={e => { e.stopPropagation(); setSelectedContact(contact); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors md:hidden ml-auto">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
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
      {selectedContact && (
        <ContactModal 
          contact={selectedContact} 
          onClose={() => setSelectedContact(null)} 
        />
      )}
    </div>
  );
}
