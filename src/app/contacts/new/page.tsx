"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Briefcase, Mail, Phone, MapPin, Save } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

export default function NewContactPage() {
  const router = useRouter();
  const { addContact } = useStore();
  
  const [formData, setFormData] = useState({
    name: '', role: '', company: '', email: '', phone: '', location: '', notes: ''
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newContact = {
      id: Date.now(),
      ...formData,
      tags: ['New'],
      lastContact: 'Just now'
    };
    addContact(newContact);
    router.push('/contacts');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Link href="/contacts" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
      </Link>
      
      <div className="bg-card rounded-2xl border shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-6">Create New Contact</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input required type="text" className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Company</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input required type="text" className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  onChange={e => setFormData({...formData, company: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Job Title / Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input required type="text" className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  onChange={e => setFormData({...formData, role: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input required type="email" className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input type="tel" className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input type="text" className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. New York, NY" 
                  onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
