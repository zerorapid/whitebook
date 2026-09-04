"use client";
import { useEffect, useRef, useState } from 'react';
import { Map as MapIcon, Crosshair } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function MapPage() {
  const { contacts } = useStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Inject Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Inject Leaflet JS
    const loadLeaflet = () => {
      if ((window as any).L) {
        initMap();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !(window as any).L) return;

      const L = (window as any).L;
      
      // Clean up previous map instance if it exists
      if ((mapRef.current as any)._leaflet_id) {
        return; 
      }

      const map = L.map(mapRef.current, {
        zoomControl: false, // We'll disable default zoom controls for a cleaner look
        attributionControl: false
      }).setView([40.7128, -74.0060], 13); // NYC Center

      // CartoDB Positron: Beautiful, completely free Black & White line-art map (No API key needed!)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add markers
      contacts.forEach((contact: any) => {
        const latOffset = (Math.random() - 0.5) * 0.05;
        const lngOffset = (Math.random() - 0.5) * 0.05;
        const isVIP = contact.tags?.includes('VIP');

        const circleMarker = L.circleMarker([40.7128 + latOffset, -74.0060 + lngOffset], {
          color: '#ffffff',
          weight: 2,
          fillColor: isVIP ? '#000000' : '#888888',
          fillOpacity: 1,
          radius: 8
        }).addTo(map);

        circleMarker.bindTooltip(`<b>${contact.name}</b><br/>${contact.company}`, {
          className: 'bg-white text-black border shadow-sm rounded-lg p-2 font-sans text-xs',
          direction: 'top'
        });
      });

      setMapLoaded(true);
    };

    loadLeaflet();
    
    return () => {
      // Cleanup map instance on unmount
      if (mapRef.current && (mapRef.current as any)._leaflet_id) {
        const L = (window as any).L;
        if (L) {
          // This prevents the "Map container is already initialized" error
          mapRef.current.innerHTML = '';
          (mapRef.current as any)._leaflet_id = null;
        }
      }
    };
  }, [contacts]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 h-[calc(100vh-6rem)] flex flex-col">
      <div className="space-y-1.5 shrink-0">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <MapIcon className="w-8 h-8 text-primary" />
          Network Map
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Live geographic distribution powered by open-source tile layers.</p>
      </div>

      <div className="flex-1 rounded-3xl border border-border/60 bg-[#f8f9fa] relative overflow-hidden shadow-sm ring-1 ring-black/5">
        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 text-black">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-semibold">Loading Map Data...</p>
          </div>
        )}
        
        <div ref={mapRef} className="w-full h-full z-0" />
        
        {/* Floating Controls */}
        <div className="absolute bottom-8 left-8 z-20">
          <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl border shadow-xl max-w-sm text-black">
            <h3 className="font-bold text-base mb-1">Live Directory</h3>
            <p className="text-sm text-gray-500 mb-4">Showing {contacts.length} active contacts in this region.</p>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-md">
                <Crosshair className="w-4 h-4 mr-2" /> Locate Me
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl border shadow-xl flex flex-col gap-2 text-black">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#888888] border border-white"></div>
              <span className="text-xs font-bold">Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-black border border-white"></div>
              <span className="text-xs font-bold">VIP / Investor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
