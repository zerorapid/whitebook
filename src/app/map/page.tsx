"use client";
import { useEffect, useRef, useState } from 'react';
import { Map as MapIcon, Crosshair } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function MapPage() {
  const { contacts } = useStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Snazzy Maps JSON - "Uber Dark Mode" Aesthetic
  const uberMapStyle = [
    { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
    { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
    { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
    { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
    { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
    { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
    { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
    { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
    { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
  ];

  useEffect(() => {
    // Inject Google Maps Script
    const loadGoogleMaps = () => {
      if (window.google?.maps) {
        initMap();
        return;
      }
      const script = document.createElement('script');
      // Using no API key for now (shows developer watermark, but supports custom Snazzy styling perfectly)
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
        styles: uberMapStyle,
        disableDefaultUI: true, // Removes default Google controls for that clean Uber look
        zoomControl: false,
      });

      // Add custom "Uber-style" sleek markers for contacts
      contacts.forEach((contact: any, i: number) => {
        // Spread contacts slightly around NYC for demonstration
        const latOffset = (Math.random() - 0.5) * 0.05;
        const lngOffset = (Math.random() - 0.5) * 0.05;
        
        new window.google.maps.Marker({
          position: { lat: 40.7128 + latOffset, lng: -74.0060 + lngOffset },
          map,
          title: contact.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: contact.tags.includes('VIP') ? '#f59e0b' : '#3b82f6', // Amber for VIP, Blue for regular
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
        <p className="text-muted-foreground text-sm font-medium">Live geographic distribution powered by Google Maps (Uber Style).</p>
      </div>

      <div className="flex-1 rounded-3xl border bg-[#17263c] relative overflow-hidden shadow-xl ring-1 ring-white/10">
        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#17263c] z-10 text-white">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-semibold">Loading Map Data...</p>
          </div>
        )}
        
        {/* The Google Map Container */}
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Floating Uber-style Controls */}
        <div className="absolute bottom-8 left-8 z-20">
          <div className="bg-background/90 backdrop-blur-xl p-5 rounded-2xl border shadow-2xl max-w-sm">
            <h3 className="font-bold text-base mb-1">Live Directory</h3>
            <p className="text-sm text-muted-foreground mb-4">Showing {contacts.length} active contacts in this region.</p>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center py-2.5 bg-foreground text-background rounded-xl text-sm font-bold hover:bg-foreground/90 transition-colors shadow-md">
                <Crosshair className="w-4 h-4 mr-2" /> Locate Me
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-background/90 backdrop-blur-xl px-4 py-3 rounded-2xl border shadow-xl flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
              <span className="text-xs font-semibold">Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 border border-white"></div>
              <span className="text-xs font-semibold">VIP / Investor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
