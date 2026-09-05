import Link from 'next/link';
import { ArrowUpRight, Building2, MapPin } from 'lucide-react';

export function MiniContactCard({ contact }: { contact: any }) {
  if (!contact) return null;
  return (
    <Link 
      href={`/contacts/${contact.id}`} 
      className="flex items-center gap-3 p-3 bg-background border rounded-xl hover:border-primary/40 hover:shadow-sm transition-all group max-w-sm mt-2"
    >
      <img 
        src={contact.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} 
        alt={contact.name} 
        className="w-10 h-10 rounded-full bg-secondary border border-border/50 object-cover" 
      />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">{contact.name}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
          <span className="flex items-center gap-1 truncate"><Building2 className="w-3 h-3 shrink-0" /> {contact.company || 'Unknown'}</span>
        </div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </Link>
  );
}
