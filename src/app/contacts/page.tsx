"use client";
import { useState, Suspense } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Mail, Phone, MapPin, X } from 'lucide-react';
import { contacts } from '@/lib/data';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ContactsList() {
  const searchParams = useSearchParams();
  const groupFilter = searchParams.get('group');
  
  const [search, setSearch] = useState(groupFilter || '');
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.role.toLowerCase().includes(search.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground mt-1">Manage your network and relationships.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 shadow-sm gap-2"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setIsNewContactOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 shadow-sm gap-2"
          >
            <Plus className="w-4 h-4" /> New Contact
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search contacts by name, role, or tag..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
        <div className="divide-y divide-border">
          {filteredContacts.map(contact => (
            <div key={contact.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <img 
                  src={`https://api.dicebear.com/7.x/micah/svg?seed=${contact.name.replace(' ', '')}&backgroundColor=transparent`} 
                  alt={contact.name} 
                  className="w-12 h-12 rounded-full bg-blue-50 border border-border p-0.5 flex-shrink-0 shadow-sm" 
                />
                <div>
                  <Link href={`/contacts/${contact.id}`} className="font-semibold hover:text-primary hover:underline">{contact.name}</Link>
                  <div className="text-sm text-muted-foreground">{contact.role}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" /> {contact.location}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex gap-2">
                  {contact.tags.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setSearch(tag)}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={`mailto:${contact.email}`}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <Link 
                    href={`/contacts/${contact.id}`}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filteredContacts.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No contacts found matching "{search}".
            </div>
          )}
        </div>
      </div>

      {/* New Contact Modal */}
      {isNewContactOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground rounded-xl shadow-lg max-w-lg w-full border border-border animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="font-semibold text-lg">Add New Contact</h3>
              <button onClick={() => setIsNewContactOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input type="text" className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input type="text" className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input type="email" className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="jane@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <input type="text" className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="CEO" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <input type="text" className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Acme Corp" />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-2">
              <button onClick={() => setIsNewContactOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">Cancel</button>
              <button onClick={() => {  setIsNewContactOpen(false); }} className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Save Contact</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground rounded-xl shadow-lg max-w-sm w-full border border-border animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="font-semibold text-lg">Filter Contacts</h3>
              <button onClick={() => setIsFilterOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">By Group</label>
                <select className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option>All Groups</option>
                  <option>VIP Clients</option>
                  <option>Investors</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <select className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option>Recently Added</option>
                  <option>Name (A-Z)</option>
                  <option>Last Contacted</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-2">
              <button onClick={() => setIsFilterOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">Clear</button>
              <button onClick={() => setIsFilterOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading contacts...</div>}>
      <ContactsList />
    </Suspense>
  );
}
