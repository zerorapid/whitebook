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

    const initMap = async () => {
      if (!mapRef.current || !(window as any).L) return;
      const L = (window as any).L;
      
      if ((mapRef.current as any)._leaflet_id) return; 

      // Create a static, non-interactive map container
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
      }).setView([22.5937, 78.9629], 5); // Center of India

      try {
        const response = await fetch('/india-simple.geojson');
        const geojsonData = await response.json();

        // Add the stylized India map (High contrast, just like the reference image)
        L.geoJSON(geojsonData, {
          style: {
            fillColor: '#2b2b2b',  // Dark grey/black fill
            weight: 1,             // Thin borders
            color: '#ffffff',      // White borders for states
            fillOpacity: 1
          }
        }).addTo(map);

      } catch (e) {
        console.error("Failed to load India GeoJSON", e);
      }

      // Add dummy markers across India for visual effect
      // In a real app, we'd use contact.locationCoords
      const indiaBounds = { n: 28, s: 12, w: 72, e: 85 };
      
      contacts.forEach((contact: any) => {
        // Generate random coordinates within India for demo purposes
        const lat = indiaBounds.s + Math.random() * (indiaBounds.n - indiaBounds.s);
        const lng = indiaBounds.w + Math.random() * (indiaBounds.e - indiaBounds.w);
        const isVIP = contact.tags?.includes('VIP');

        const circleMarker = L.circleMarker([lat, lng], {
          color: '#ffffff',
          weight: 1.5,
          fillColor: isVIP ? '#3b82f6' : '#f59e0b', // Blue for VIP, Amber for Standard to stand out against dark map
          fillOpacity: 1,
          radius: 6
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
      if (mapRef.current && (mapRef.current as any)._leaflet_id) {
        const L = (window as any).L;
        if (L) {
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
        <p className="text-muted-foreground text-sm font-medium">High-level overview of your network across India.</p>
      </div>

      <div className="flex-1 rounded-3xl border border-border/60 bg-gradient-to-b from-[#e5e5e5] to-[#f4f4f4] relative overflow-hidden shadow-sm ring-1 ring-black/5">
        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10 text-black">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-semibold">Generating Vector Map...</p>
          </div>
        )}
        
        {/* We use a specific light gray background for the map container itself to match the reference image's vignette */}
        <div ref={mapRef} className="w-full h-full z-0 bg-transparent" style={{ background: 'transparent' }} />
        
        <div className="absolute bottom-8 left-8 z-20">
          <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl border shadow-xl max-w-sm text-black">
            <h3 className="font-bold text-base mb-1">Live Directory</h3>
            <p className="text-sm text-gray-500 mb-4">Showing {contacts.length} active contacts nationwide.</p>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center py-2.5 bg-[#2b2b2b] text-white rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-md">
                <Crosshair className="w-4 h-4 mr-2" /> Recenter Map
              </button>
            </div>
          </div>
        </div>

        <div className="absolute top-8 right-8 z-20">
          <div className="bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl border shadow-xl flex flex-col gap-2 text-black">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f59e0b] border border-white"></div>
              <span className="text-xs font-bold">Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3b82f6] border border-white"></div>
              <span className="text-xs font-bold">VIP / Investor</span>
            </div>
          </div>
        </div>
        
        {/* Reference Image Title Overlay */}
        <div className="absolute bottom-8 right-8 z-10 pointer-events-none opacity-20">
          <h2 className="text-6xl font-serif tracking-widest text-black">INDIA</h2>
        </div>
      </div>
    </div>
  );
}
