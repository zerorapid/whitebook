"use client";
import { useEffect, useRef, useState } from 'react';
import { Map as MapIcon, Crosshair } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function MapPage() {
  const { contacts } = useStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Pure Black & White minimalist vector style (matching the reference UI)
  const bAndWStyle = [
    { "featureType": "all", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "visibility": "off" }] },
    { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
    
    // Stark black lines for major highways
    { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "weight": 2.5 }] },
    
    // Dark grey lines for arterial roads
    { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "color": "#333333" }, { "weight": 1.5 }] },
    
    // Light grey lines for local roads
    { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{ "color": "#888888" }, { "weight": 1.0 }] }
  ];

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google?.maps) {
        initMap();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.body.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.google?.maps) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 }, // NYC Center
        zoom: 13,
        styles: bAndWStyle,
        disableDefaultUI: true, // Clean look
        zoomControl: false,
        backgroundColor: '#ffffff'
      });

      contacts.forEach((contact: any, i: number) => {
        const latOffset = (Math.random() - 0.5) * 0.05;
        const lngOffset = (Math.random() - 0.5) * 0.05;
        
        new window.google.maps.Marker({
          position: { lat: 40.7128 + latOffset, lng: -74.0060 + lngOffset },
          map,
          title: contact.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: contact.tags.includes('VIP') ? '#000000' : '#888888', // Black & Grey dots to match the aesthetic
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });
      });

      setMapLoaded(true);
    };

    loadGoogleMaps();
  }, [contacts]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 h-[calc(100vh-6rem)] flex flex-col">
      <div className="space-y-1.5 shrink-0">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <MapIcon className="w-8 h-8 text-primary" />
          Network Map
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Live geographic distribution mapped in stark contrast.</p>
      </div>

      <div className="flex-1 rounded-3xl border border-border/60 bg-white relative overflow-hidden shadow-sm ring-1 ring-black/5">
        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 text-black">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-semibold">Loading Map Data...</p>
          </div>
        )}
        
        <div ref={mapRef} className="w-full h-full bg-white" />
        
        {/* Floating Controls */}
        <div className="absolute bottom-8 left-8 z-20">
          <div className="bg-white/90 backdrop-blur-xl p-5 rounded-2xl border shadow-xl max-w-sm text-black">
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
          <div className="bg-white/90 backdrop-blur-xl px-4 py-3 rounded-2xl border shadow-xl flex flex-col gap-2 text-black">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400 border border-white"></div>
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
