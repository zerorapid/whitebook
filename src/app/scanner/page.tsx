"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Image as ImageIcon, Loader2, ScanLine, CheckCircle2, UserCheck, ArrowRight, RefreshCw, Sparkles, Building, Briefcase, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { useStore } from '@/lib/store';

interface ExtractedContact {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  notes?: string;
}

const CATEGORIES = [
  "Vendors",
  "Business Partners",
  "Brands",
  "Influencers",
  "Press Media",
  "Celebrities",
  "Others"
];

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedContact | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Business Partners");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { addContact } = useStore();

  // Compress & resize image to prevent Vercel 4.5MB payload limit and speed up AI OCR
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.85 quality (~150-250KB)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image for compression'));
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setExtractedData(null);
    setIsScanning(true);

    try {
      const compressedBase64 = await compressImage(file);
      setImagePreview(compressedBase64);
      await scanCard(compressedBase64);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Failed to read or compress image. Please try another photo.');
      setIsScanning(false);
    }
  };

  const scanCard = async (base64: string) => {
    try {
      const res = await fetch('/api/scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      });
      const data = await res.json();
      
      if (res.ok && data) {
        setExtractedData({
          name: data.name || '',
          role: data.role || '',
          company: data.company || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          website: data.website || '',
          notes: data.notes || '',
        });
      } else {
        setErrorMessage(data.error || 'Failed to extract details from the card.');
      }
    } catch (err) {
      setErrorMessage('Network connection error while communicating with AI service.');
    } finally {
      setIsScanning(false);
    }
  };

  // Instant save to Supabase contacts
  const handleSaveContact = async () => {
    if (!extractedData || !extractedData.name) {
      alert('Please enter a name for this contact.');
      return;
    }

    setIsSaving(true);
    try {
      // Auto-generate avatar seed based on name
      const seed = encodeURIComponent(extractedData.name);
      const avatarUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${seed}&backgroundColor=transparent`;

      await addContact({
        id: Date.now(),
        name: extractedData.name,
        company: extractedData.company,
        role: extractedData.role,
        email: extractedData.email,
        phone: extractedData.phone,
        location: extractedData.location,
        tags: [selectedCategory, "Scanned Card"],
        lastContact: "Just added",
        avatar: avatarUrl,
        notes: [
          extractedData.website ? `Website: ${extractedData.website}` : '',
          extractedData.notes ? `Card Tagline: ${extractedData.notes}` : ''
        ].filter(Boolean).join('\n')
      });

      router.push('/contacts');
    } catch (err) {
      console.error(err);
      alert('Error saving contact to database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenFullForm = () => {
    if (!extractedData) return;
    const params = new URLSearchParams();
    if (extractedData.name) params.append('name', extractedData.name);
    if (extractedData.company) params.append('company', extractedData.company);
    if (extractedData.role) params.append('role', extractedData.role);
    if (extractedData.email) params.append('email', extractedData.email);
    if (extractedData.phone) params.append('phone', extractedData.phone);
    if (extractedData.location) params.append('location', extractedData.location);
    if (selectedCategory) params.append('category', selectedCategory);
    router.push(`/contacts/new?${params.toString()}`);
  };

  const resetScanner = () => {
    setImagePreview(null);
    setExtractedData(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="space-y-2 text-center">
        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <ScanLine className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Card Scanner</h1>
        <p className="text-muted-foreground text-sm font-medium">Extract details and create contact profiles instantly using Vision AI.</p>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Main Upload / Camera View */}
      {!imagePreview && (
        <div className="bg-card border rounded-3xl p-8 shadow-sm text-center">
          <div className="py-10 space-y-6">
            <div className="flex justify-center gap-6">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-36 h-36 rounded-3xl bg-secondary flex flex-col items-center justify-center gap-3 hover:bg-secondary/80 transition-all shadow-sm group hover:scale-105"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-bold">Use Camera</span>
              </button>
              
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-36 h-36 rounded-3xl bg-secondary flex flex-col items-center justify-center gap-3 hover:bg-secondary/80 transition-all shadow-sm group hover:scale-105"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-bold">Upload Photo</span>
              </button>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Take a photo or upload an image of any physical or digital business card.</p>
          </div>
        </div>
      )}

      {/* Scanning In-Progress View */}
      {isScanning && (
        <div className="bg-card border rounded-3xl p-8 shadow-sm text-center space-y-6">
          <div className="relative w-full max-w-md mx-auto aspect-video rounded-2xl overflow-hidden border shadow-sm">
            {imagePreview && <img src={imagePreview} alt="Card Preview" className="object-cover w-full h-full filter brightness-75" />}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
              <Loader2 className="w-10 h-10 animate-spin mb-3 text-primary" />
              <p className="font-bold tracking-wider text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> EXTRACTING WITH VISION AI...
              </p>
              <p className="text-xs text-muted-foreground mt-1">Transcribing text, company, contact details</p>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {errorMessage && !isScanning && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-3xl p-6 text-center space-y-4">
          <p className="text-sm font-semibold">{errorMessage}</p>
          <button
            onClick={resetScanner}
            className="px-6 py-2.5 rounded-full bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Extracted Profile Result View */}
      {extractedData && !isScanning && (
        <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Details Extracted</h2>
                <p className="text-xs text-muted-foreground">Review or edit details before creating the profile</p>
              </div>
            </div>
            <button
              onClick={resetScanner}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
              title="Scan another card"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Form fields for quick review & in-place edit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={extractedData.name}
                onChange={(e) => setExtractedData({ ...extractedData, name: e.target.value })}
                placeholder="e.g. Ajay Singh"
                className="w-full bg-secondary/40 border rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Designation / Role
              </label>
              <input
                type="text"
                value={extractedData.role}
                onChange={(e) => setExtractedData({ ...extractedData, role: e.target.value })}
                placeholder="e.g. Head of Fintech"
                className="w-full bg-secondary/40 border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> Company
              </label>
              <input
                type="text"
                value={extractedData.company}
                onChange={(e) => setExtractedData({ ...extractedData, company: e.target.value })}
                placeholder="e.g. QuantumVibe"
                className="w-full bg-secondary/40 border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              <input
                type="email"
                value={extractedData.email}
                onChange={(e) => setExtractedData({ ...extractedData, email: e.target.value })}
                placeholder="email@company.com"
                className="w-full bg-secondary/40 border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone
              </label>
              <input
                type="tel"
                value={extractedData.phone}
                onChange={(e) => setExtractedData({ ...extractedData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-secondary/40 border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Location / Address
              </label>
              <input
                type="text"
                value={extractedData.location}
                onChange={(e) => setExtractedData({ ...extractedData, location: e.target.value })}
                placeholder="City, Country or full address"
                className="w-full bg-secondary/40 border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2 md:col-span-2 pt-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                Select Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-secondary/40 hover:bg-secondary border-border/70 text-muted-foreground'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveContact}
              className="flex-1 bg-primary text-primary-foreground py-3.5 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserCheck className="w-5 h-5" />
                  Save to Contacts
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleOpenFullForm}
              className="bg-secondary text-foreground py-3.5 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors border"
            >
              Edit in Full Form
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
