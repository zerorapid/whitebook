"use client";
import { Map as MapIcon, MapPin } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function MapPage() {
  const { contacts } = useStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-700 h-[calc(100vh-6rem)] flex flex-col">
      <div className="space-y-1.5 shrink-0">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <MapIcon className="w-8 h-8 text-primary" />
          Network Map
        </h1>
        <p className="text-muted-foreground text-sm font-medium">See home and work locations of your contacts on a map.</p>
      </div>

      <div className="flex-1 rounded-2xl border-2 border-border/60 bg-muted/10 relative overflow-hidden flex items-center justify-center">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        {/* Mock Pins */}
        <div className="absolute top-1/4 left-1/3 text-rose-500 animate-bounce"><MapPin className="w-8 h-8 fill-rose-100" /></div>
        <div className="absolute top-1/2 left-1/2 text-blue-500"><MapPin className="w-8 h-8 fill-blue-100" /></div>
        <div className="absolute bottom-1/3 right-1/4 text-emerald-500"><MapPin className="w-8 h-8 fill-emerald-100" /></div>

        <div className="z-10 bg-background/80 backdrop-blur-md p-6 rounded-2xl border shadow-lg text-center max-w-sm">
          <MapIcon className="w-10 h-10 mx-auto text-primary mb-3" />
          <h3 className="font-bold text-lg mb-2">Map Integration Required</h3>
          <p className="text-sm text-muted-foreground">Connect a Google Maps or Mapbox API key in Settings to view live location clustering for {contacts.length} contacts.</p>
        </div>
      </div>
    </div>
  );
}
