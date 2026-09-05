"use client";

import { useSearchParams } from 'next/navigation';
import { Phone, Mail, Globe, Scan } from 'lucide-react';
import { Suspense } from 'react';


const Github = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
);
const Linkedin = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const Twitter = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z"/></svg>
);

function CardContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('n') || 'Alexander Wright';
  const role = searchParams.get('r') || 'Principal Software Engineer';
  const company = searchParams.get('c') || 'Vercel Ecosystem Labs';
  const phone = searchParams.get('p') || '+1 (555) 019-2834';
  const email = searchParams.get('e') || 'alexander.w@example.com';
  const website = searchParams.get('w') || 'www.alexanderwright.dev';
  const avatar = searchParams.get('a') || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(name)}&backgroundColor=e2e8f0`;
  const linkedin = searchParams.get('l') || '';

  const handleSaveContact = () => {
    // Generate vCard
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:${company}
TITLE:${role}
TEL:${phone}
EMAIL:${email}
URL:${website}
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100">
        
        {/* Banner */}
        <div className="h-40 bg-gradient-to-br from-gray-800 via-gray-700 to-black relative w-full">
          {/* Abstract curve overlay */}
          <div className="absolute inset-0 opacity-40">
            <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
              <path d="M0 100 C 100 50, 200 150, 400 100 L 400 0 L 0 0 Z"></path>
            </svg>
          </div>
        </div>

        {/* Profile Avatar */}
        <div className="relative flex justify-center -mt-16">
          <img 
            src={avatar} 
            alt={name} 
            className="w-32 h-32 rounded-full border-[6px] border-white object-cover bg-gray-200 shadow-sm"
          />
        </div>

        {/* Info */}
        <div className="px-6 pt-4 pb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{name}</h1>
          <h2 className="text-base font-bold text-gray-500 mt-1">{role}</h2>
          <h3 className="text-sm font-medium text-gray-400 mt-0.5">{company}</h3>

          
          {/* Contact Links */}
          <div className="mt-8 space-y-3">
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-all bg-white hover:bg-gray-50">
                <Phone className="w-5 h-5 text-gray-800 shrink-0" />
                <span className="font-semibold text-gray-900">{phone}</span>
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-all bg-white hover:bg-gray-50">
                <Mail className="w-5 h-5 text-gray-800 shrink-0" />
                <span className="font-semibold text-gray-900 truncate">{email}</span>
              </a>
            )}
            {website && (
              <a href={`https://${website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-all bg-white hover:bg-gray-50">
                <Globe className="w-5 h-5 text-gray-800 shrink-0" />
                <span className="font-semibold text-gray-900 truncate">{website}</span>
              </a>
            )}
          </div>

          {/* Social & QR Grid (Matching Screenshot) */}
          <div className="mt-6 p-4 border border-gray-100 rounded-2xl bg-[#fafafa] flex gap-4">
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2">
              <a href="#" className="flex items-center justify-center py-2.5 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <Github className="w-5 h-5 text-gray-800" />
              </a>
              <a href={linkedin || "#"} target="_blank" rel="noreferrer" className="flex items-center justify-center py-2.5 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <Linkedin className="w-5 h-5 text-gray-800" />
              </a>
              <a href="#" className="flex items-center justify-center py-2.5 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <Twitter className="w-5 h-5 text-gray-800" />
              </a>
              <a href={`https://${website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center py-2.5 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <Globe className="w-5 h-5 text-gray-800" />
              </a>
            </div>
            <div className="w-[88px] shrink-0 border border-gray-200 bg-white rounded-xl p-2 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors">
              <div className="w-full aspect-square bg-black rounded-lg flex items-center justify-center text-white mb-1">
                <Scan className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-semibold text-gray-500 whitespace-nowrap">Scan vCard</span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8">
            <button 
              onClick={handleSaveContact}
              className="w-full py-4 bg-[#111111] hover:bg-black text-white text-lg font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all"
            >
              Save Contact
            </button>
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-1.5 opacity-40">
                <Scan className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Powered by Whitebook</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default function CardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center"><div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div></div>}>
      <CardContent />
    </Suspense>
  );
}
