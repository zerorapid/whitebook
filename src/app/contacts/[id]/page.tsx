"use client";
import { useState } from 'react';
import { 
  ArrowLeft, Mail, MapPin, Briefcase, Calendar, Building2, 
  Globe, Users, Phone, Edit2, MoreHorizontal, Archive, 
  Trash2, X, Globe as Linkedin, Globe as Twitter, FileText, Camera
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { contacts } from '@/lib/data';

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const contact = contacts.find(c => c.id.toString() === params.id);
  if (!contact) return notFound();

  // Mock company data since it's not fully in the data model yet
  const mockCompany = {
    name: "TechCorp Inc.",
    website: "www.techcorp.example.com",
    size: "50-200 Employees",
    industry: "Enterprise Software"
  };

  const avatarUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${contact.name.replace(' ', '')}&backgroundColor=transparent`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/contacts" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm font-medium text-muted-foreground">Back to Contacts</span>
      </div>

      {/* Main Profile Header */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-100 to-indigo-100"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
            <div className="flex items-end gap-6">
              <img 
                src={avatarUrl}
                alt={contact.name} 
                className="w-28 h-28 rounded-full bg-white border-4 border-card p-1 shadow-sm" 
              />
              <div className="mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{contact.name}</h1>
                <div className="text-lg text-muted-foreground mt-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> {contact.role}
                </div>
              </div>
            </div>
            <div className="flex gap-2 relative">
              <a 
                href={`mailto:${contact.email}`} 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 shadow-sm gap-2"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 shadow-sm gap-2"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 shadow-sm"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-12 right-0 w-48 rounded-md border border-border bg-card shadow-md overflow-hidden z-10 animate-in fade-in slide-in-from-top-2">
                    <button 
                      onClick={() => alert(`Archived ${contact.name}`)} 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2 text-muted-foreground"
                    >
                      <Archive className="w-4 h-4" /> Archive Profile
                    </button>
                    <div className="h-px bg-border w-full"></div>
                    <button 
                      onClick={() => alert(`Permanently deleting ${contact.name}...`)} 
                      className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {contact.tags.map(tag => (
              <span key={tag} className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
          <h3 className="font-semibold text-lg border-b border-border pb-2">Personal Details</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-blue-500" /> 
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-0.5">Location</div>
                <div className="text-foreground font-medium">{contact.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="w-5 h-5 text-blue-500" /> 
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-0.5">Email Address</div>
                <div className="text-foreground font-medium">{contact.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="w-5 h-5 text-blue-500" /> 
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-0.5">Phone Number</div>
                <div className="text-foreground font-medium">+1 (555) 123-4567</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="w-5 h-5 text-blue-500" /> 
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-0.5">Added to Directory</div>
                <div className="text-foreground font-medium">{contact.added}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
          <h3 className="font-semibold text-lg border-b border-border pb-2">Company Information</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Building2 className="w-5 h-5 text-indigo-500" /> 
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-0.5">Organization</div>
                <div className="text-foreground font-medium">{mockCompany.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Briefcase className="w-5 h-5 text-indigo-500" /> 
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-0.5">Industry</div>
                <div className="text-foreground font-medium">{mockCompany.industry}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Users className="w-5 h-5 text-indigo-500" /> 
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-0.5">Company Size</div>
                <div className="text-foreground font-medium">{mockCompany.size}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Globe className="w-5 h-5 text-indigo-500" /> 
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-0.5">Website</div>
                <a href={`https://${mockCompany.website}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">{mockCompany.website}</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-card">
              <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer">
                  <img src={avatarUrl} className="w-12 h-12 rounded-full border border-border bg-muted group-hover:opacity-50 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-foreground" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Edit Profile</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Update directory information for {contact.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Left Column */}
                  <div className="space-y-8">
                     
                     {/* Basic Details Section */}
                     <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
                        <h3 className="text-xs font-bold tracking-wider uppercase text-primary flex items-center gap-2 border-b border-border pb-3">
                          <Users className="w-4 h-4" /> Basic Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                            <input defaultValue={contact.name} type="text" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Job Title</label>
                            <input defaultValue={contact.role} type="text" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input defaultValue={contact.email} type="email" className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input defaultValue="+1 (555) 123-4567" type="tel" className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none" />
                          </div>
                        </div>
                     </div>

                     {/* Social Profiles Section */}
                     <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
                        <h3 className="text-xs font-bold tracking-wider uppercase text-blue-500 flex items-center gap-2 border-b border-border pb-3">
                          <Globe className="w-4 h-4" /> Social & Web
                        </h3>
                        <div className="space-y-3">
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                            <input placeholder="LinkedIn URL" defaultValue={`linkedin.com/in/${contact.name.toLowerCase().replace(' ', '')}`} type="text" className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none" />
                          </div>
                          <div className="relative">
                            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500" />
                            <input placeholder="Twitter Handle" defaultValue={`@${contact.name.toLowerCase().replace(' ', '')}`} type="text" className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none" />
                          </div>
                        </div>
                     </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                     
                     {/* Company Info Section */}
                     <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
                        <h3 className="text-xs font-bold tracking-wider uppercase text-indigo-500 flex items-center gap-2 border-b border-border pb-3">
                          <Building2 className="w-4 h-4" /> Company Information
                        </h3>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Organization Name</label>
                          <input defaultValue={mockCompany.name} type="text" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Industry</label>
                            <input defaultValue={mockCompany.industry} type="text" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Company Size</label>
                            <select className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none">
                              <option>1-10 Employees</option>
                              <option selected>50-200 Employees</option>
                              <option>201-500 Employees</option>
                              <option>500+ Employees</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Company Website</label>
                          <input defaultValue={mockCompany.website} type="url" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none" />
                        </div>
                     </div>

                     {/* Location & Extra Notes */}
                     <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
                        <h3 className="text-xs font-bold tracking-wider uppercase text-emerald-500 flex items-center gap-2 border-b border-border pb-3">
                          <MapPin className="w-4 h-4" /> Location & Bio
                        </h3>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">City, State</label>
                          <input defaultValue={contact.location} type="text" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Internal Notes / Bio</label>
                          <textarea 
                            placeholder="Add private background context or notes about this contact..." 
                            className="w-full p-3 min-h-[90px] rounded-md border border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none resize-none"
                          ></textarea>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-card border-t border-border flex justify-end gap-3 items-center">
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="px-5 py-2 text-sm font-semibold rounded-lg border border-input bg-background hover:bg-muted transition-colors text-muted-foreground"
              >
                Cancel
              </button>
              <button 
                onClick={() => {  setIsEditModalOpen(false); }} 
                className="px-6 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
