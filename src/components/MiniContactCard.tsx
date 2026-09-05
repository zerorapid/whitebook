"use client";
import Link from 'next/link';
import { ArrowUpRight, Building2, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WhatsApp = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export function MiniContactCard({ contact }: { contact: any }) {
  const router = useRouter();
  if (!contact) return null;
  
  return (
    <div 
      onClick={() => router.push(`/contacts/${contact.id}`)}
      className="flex items-center gap-3 p-3 bg-background border rounded-xl hover:border-primary/40 hover:shadow-sm transition-all group max-w-sm mt-2 cursor-pointer"
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
      
      {contact.phone && (
        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="p-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors" title="Call">
            <Phone className="w-3.5 h-3.5" />
          </a>
          <a href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="p-1.5 bg-[#25D366]/20 text-[#25D366] rounded-md hover:bg-[#25D366]/30 transition-colors" title="WhatsApp">
            <WhatsApp className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
      
      {!contact.phone && <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />}
    </div>
  );
}
