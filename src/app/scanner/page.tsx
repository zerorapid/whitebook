"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Image as ImageIcon, Loader2, ScanLine } from 'lucide-react';

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      await scanCard(base64);
    };
    reader.readAsDataURL(file);
  };

  const scanCard = async (base64: string) => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      });
      const data = await res.json();
      
      if (res.ok) {
        const params = new URLSearchParams();
        if (data.name) params.append('name', data.name);
        if (data.email) params.append('email', data.email);
        if (data.phone) params.append('phone', data.phone);
        if (data.company) params.append('company', data.company);
        if (data.role) params.append('role', data.role);
        
        router.push(`/contacts/new?${params.toString()}`);
      } else {
        alert('Failed to extract details: ' + data.error);
      }
    } catch (err) {
      alert('Network error while scanning.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="space-y-1.5 text-center">
        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <ScanLine className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Card Scanner</h1>
        <p className="text-muted-foreground text-sm font-medium">Extract details instantly using Llama-3 Vision AI.</p>
      </div>

      <div className="bg-card border rounded-3xl p-8 shadow-sm text-center">
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        {imagePreview ? (
          <div className="space-y-6">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border">
              <img src={imagePreview} alt="Card Preview" className="object-cover w-full h-full" />
              {isScanning && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p className="font-bold tracking-wider animate-pulse">EXTRACTING DATA...</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-12 space-y-6">
            <div className="flex justify-center gap-6">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-3xl bg-secondary flex flex-col items-center justify-center gap-3 hover:bg-secondary/80 transition-colors shadow-sm"
              >
                <Camera className="w-8 h-8 text-primary" />
                <span className="text-sm font-bold">Camera</span>
              </button>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-3xl bg-secondary flex flex-col items-center justify-center gap-3 hover:bg-secondary/80 transition-colors shadow-sm"
              >
                <ImageIcon className="w-8 h-8 text-primary" />
                <span className="text-sm font-bold">Gallery</span>
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Upload a photo of a business card.</p>
          </div>
        )}
      </div>
    </div>
  );
}
