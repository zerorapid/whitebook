"use client";
import { useEffect, useRef, useState } from 'react';
import { Map as MapIcon, Crosshair, Database } from 'lucide-react';
import { useStore } from '@/lib/store';

// Helper to generate 40 Indian dummy contacts
const generateIndianContacts = () => {
  const cities = ['Mumbai, MH', 'Delhi, DL', 'Bangalore, KA', 'Hyderabad, TS', 'Chennai, TN', 'Kolkata, WB', 'Pune, MH', 'Ahmedabad, GJ', 'Jaipur, RJ', 'Surat, GJ'];
  const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Ananya', 'Diya', 'Suhana', 'Priya', 'Neha', 'Pooja', 'Rahul', 'Rohit', 'Sneha', 'Kavya'];
  const lastNames = ['Sharma', 'Verma', 'Patel', 'Reddy', 'Kumar', 'Singh', 'Gupta', 'Rao', 'Desai', 'Joshi', 'Mehta', 'Nair', 'Menon', 'Iyer', 'Bose'];
  const categories = ['Vendors', 'Business Partners', 'Brands', 'Influencers', 'Press Media', 'Celebrities', 'Others'];
  
  const contacts = [];
  for (let i = 0; i < 40; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const tag = categories[Math.floor(Math.random() * categories.length)];
    
    contacts.push({
      name: `${fn} ${ln}`,
      company: `${ln} Enterprises`,
      role: 'Director',
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.in`,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      location: city,
      tags: [tag]
    });
  }
  return contacts;
};

export default function MapPage() {
  const { contacts, addContact } = useStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const categories = [
    'Vendors', 'Business Partners', 'Brands', 'Influencers', 
    'Press Media', 'Celebrities', 'Others'
  ];

  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: contacts.filter((c: any) => c.tags?.includes(cat)).length
  }));

  const handleSeed = async () => {
    setIsSeeding(true);
    const newContacts = generateIndianContacts();
    for (const c of newContacts) {
      await addContact(c);
    }
    setIsSeeding(false);
  };

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
      
      if ((mapRef.current as any)._leaflet_id) {
        // Just clear markers if map already exists
        const map = (mapRef.current as any)._leaflet_map;
        if (map) {
          map.eachLayer((layer: any) => {
            if (layer instanceof L.CircleMarker) map.removeLayer(layer);
          });
        } else {
          return;
        }
      }

      let map = (mapRef.current as any)._leaflet_map;

      if (!map) {
        map = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
          dragging: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
        }).setView([22.5937, 78.9629], 5); // Center of India
        
        (mapRef.current as any)._leaflet_map = map;

        try {
          const response = await fetch('/india-simple.geojson');
          const geojsonData = await response.json();

          L.geoJSON(geojsonData, {
            style: {
              fillColor: '#18181b',  // Dark fill
              weight: 1,             
              color: '#3f3f46',      // Gray borders
              fillOpacity: 1
            }
          }).addTo(map);

        } catch (e) {
          console.error("Failed to load India GeoJSON", e);
        }
      }

      const indiaBounds = { n: 28, s: 12, w: 72, e: 85 };
      
      contacts.forEach((contact: any) => {
        // Generate pseudo-random coordinates based on string so they stay in same place
        const hash = contact.name.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
        const lat = indiaBounds.s + (hash % 100) / 100 * (indiaBounds.n - indiaBounds.s);
        const lng = indiaBounds.w + ((hash * 2) % 100) / 100 * (indiaBounds.e - indiaBounds.w);

        const circleMarker = L.circleMarker([lat, lng], {
          color: '#ffffff',
          weight: 1.5,
          fillColor: '#3b82f6', // Bright Blue
          fillOpacity: 1,
          radius: 5
        }).addTo(map);

        circleMarker.bindTooltip(`<b>${contact.name}</b><br/>${contact.location}`, {
          className: 'bg-background text-foreground border-border shadow-sm rounded-lg p-2 font-sans text-xs',
          direction: 'top'
        });
      });

      setMapLoaded(true);
    };

    loadLeaflet();
    
    return () => {
      // Don't fully destroy to avoid flickering, just let react unmount handle it
    };
  }, [contacts]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100dvh-11rem)] md:h-[calc(100vh-9rem)] flex flex-col">
      <div className="space-y-1.5 shrink-0 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <MapIcon className="w-8 h-8 text-primary" />
            Network Map
          </h1>
          <p className="text-muted-foreground text-sm font-medium">High-level overview of your network across India.</p>
        </div>
        <button 
          onClick={handleSeed}
          disabled={isSeeding}
          className="h-10 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
        >
          <Database className="w-4 h-4" />
          {isSeeding ? 'Seeding...' : 'Seed 40 Demo Contacts'}
        </button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-1 rounded-3xl border border-border/60 bg-muted/20 relative overflow-hidden shadow-sm">
          {!mapLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-semibold">Loading Map Data...</p>
            </div>
          )}
          
          <div ref={mapRef} className="w-full h-full z-0 bg-transparent" style={{ background: 'transparent' }} />
          
          <div className="absolute bottom-6 left-6 z-20">
            <div className="bg-background/95 backdrop-blur-xl p-4 rounded-2xl border border-border/50 shadow-lg">
              <h3 className="font-bold text-sm mb-0.5">Live Directory</h3>
              <p className="text-xs text-muted-foreground mb-3">{contacts.length} active contacts</p>
              <button className="w-full flex items-center justify-center py-2 bg-secondary text-secondary-foreground rounded-xl text-xs font-bold hover:bg-secondary/80 transition-colors">
                <Crosshair className="w-3.5 h-3.5 mr-2" /> Recenter
              </button>
            </div>
          </div>
        </div>

        {/* Right side stats panel */}
        <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto pr-2">
          <div className="bg-card border border-border/60 rounded-3xl p-5 shadow-sm">
            <h2 className="font-bold text-sm tracking-tight mb-4 uppercase text-muted-foreground">Network Distribution</h2>
            <div className="space-y-3">
              {categoryCounts.map(cat => (
                <div key={cat.name} className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{cat.name}</span>
                  <span className="text-sm font-bold bg-muted px-2 py-0.5 rounded-lg text-muted-foreground">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
