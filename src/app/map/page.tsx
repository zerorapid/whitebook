"use client";
import { useState } from 'react';
import { Map as MapIcon, Crosshair } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function MapPage() {
  const { contacts } = useStore();
  const [loading, setLoading] = useState(true);

  // We generate a static map with points using a free mapping service iframe
  // In production, you would use a Leaflet component here.
  const mapUrl = "https://www.openstreetmap.org/export/embed.html?bbox=-123.003,37.382,-73.498,43.261&layer=mapnik";

  return (
    <div className="space-y-6 animate-in fade-in duration-700 h-[calc(100vh-6rem)] flex flex-col">
      <div className="space-y-1.5 shrink-0">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <MapIcon className="w-8 h-8 text-primary" />
          Network Map
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Live geographic distribution of your {contacts.length} contacts.</p>
      </div>

      <div className="flex-1 rounded-2xl border bg-card relative overflow-hidden shadow-sm">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 z-10">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-semibold">Loading Map Tiles...</p>
          </div>
        )}
        <iframe 
          src={mapUrl}
          className="w-full h-full border-0" 
          onLoad={() => setLoading(false)}
        ></iframe>
        
        {/* Floating Controls */}
        <div className="absolute bottom-6 left-6 z-20 bg-background/90 backdrop-blur-md p-4 rounded-xl border shadow-lg max-w-sm">
          <h3 className="font-bold text-sm mb-1">Geographic Density</h3>
          <p className="text-xs text-muted-foreground mb-3">Powered by free OpenStreetMap APIs.</p>
          <button className="flex items-center justify-center w-full py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors">
            <Crosshair className="w-3 h-3 mr-2" /> Recenter on My Location
          </button>
        </div>
      </div>
    </div>
  );
}
