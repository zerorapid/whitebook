import { useState } from 'react';
import { X, Mail, Phone, MapPin, Building2, Briefcase, Trash2, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import Link from 'next/link';

// Custom SVG Icons for Social Media
const Linkedin = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Twitter = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export function ContactModal({ contact, onClose }: { contact: any, onClose: () => void }) {
  const { updateContact, deleteContact } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...contact });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    await updateContact(contact.id, formData);
    setIsEditing(false);
    // update parent's version by just closing or we can leave it open
    onClose();
  };

  const handleDelete = async () => {
    await deleteContact(contact.id);
    onClose();
  };

  if (!contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-card w-full max-w-xl rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border/50 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="relative bg-muted/30 p-6 border-b">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-5">
            <img 
              src={contact.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} 
              alt={contact.name} 
              className="w-20 h-20 rounded-2xl bg-secondary border border-border/50 object-cover" 
            />
            <div>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="text-2xl font-bold bg-background border px-3 py-1 rounded-lg w-full mb-2"
                />
              ) : (
                <h2 className="text-2xl font-extrabold tracking-tight">{contact.name}</h2>
              )}
              
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Briefcase className="w-4 h-4" />
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.role || ""} 
                    onChange={e => setFormData({...formData, role: e.target.value})} 
                    className="text-sm bg-background border px-2 py-1 rounded-md"
                    placeholder="Role"
                  />
                ) : (
                  <span className="text-sm font-medium">{contact.role}</span>
                )}
                <span>at</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.company || ""} 
                    onChange={e => setFormData({...formData, company: e.target.value})} 
                    className="text-sm bg-background border px-2 py-1 rounded-md"
                    placeholder="Company"
                  />
                ) : (
                  <span className="text-sm font-medium">{contact.company}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {isDeleting ? (
            <div className="bg-destructive/10 border-destructive/20 text-destructive p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <AlertCircle className="w-8 h-8 mb-1" />
              <div className="font-bold">Delete this contact?</div>
              <div className="text-sm opacity-80 mb-2">This action cannot be undone.</div>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleting(false)} className="px-4 py-2 bg-background border text-foreground rounded-xl text-sm font-semibold hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">Yes, Delete</button>
              </div>
            </div>
          ) : (
            <>
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</div>
                  {isEditing ? (
                    <input type="email" value={formData.email || ""} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full text-sm bg-background border px-3 py-2 rounded-lg" />
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="w-4 h-4 text-muted-foreground shrink-0" /> 
                      <span className="truncate" title={contact.email}>{contact.email || '-'}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone</div>
                  {isEditing ? (
                    <input type="tel" value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full text-sm bg-background border px-3 py-2 rounded-lg" />
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0" /> 
                      <span className="truncate" title={contact.phone}>{contact.phone || '-'}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 md:col-span-2">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</div>
                  {isEditing ? (
                    <input type="text" value={formData.location || ""} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full text-sm bg-background border px-3 py-2 rounded-lg" />
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-medium"><MapPin className="w-4 h-4 text-muted-foreground" /> {contact.location || '-'}</div>
                  )}
                </div>
              </div>

              {/* Socials */}
              <div className="bg-muted/30 p-5 rounded-2xl border">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Social Profiles</div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5 text-muted-foreground" />
                      <input type="url" placeholder="LinkedIn URL" value={formData.linkedin || ''} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="flex-1 text-sm bg-background border px-3 py-2 rounded-lg" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Twitter className="w-5 h-5 text-muted-foreground" />
                      <input type="url" placeholder="Twitter URL" value={formData.twitter || ''} onChange={e => setFormData({...formData, twitter: e.target.value})} className="flex-1 text-sm bg-background border px-3 py-2 rounded-lg" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-muted-foreground" />
                      <input type="url" placeholder="Instagram URL" value={formData.instagram || ''} onChange={e => setFormData({...formData, instagram: e.target.value})} className="flex-1 text-sm bg-background border px-3 py-2 rounded-lg" />
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <a href={contact.linkedin || '#'} target={contact.linkedin ? "_blank" : "_self"} className={`p-3 rounded-xl transition-colors flex items-center justify-center ${contact.linkedin ? 'bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20' : 'bg-muted text-muted-foreground/40 cursor-not-allowed grayscale'}`} title="LinkedIn">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href={contact.twitter || '#'} target={contact.twitter ? "_blank" : "_self"} className={`p-3 rounded-xl transition-colors flex items-center justify-center ${contact.twitter ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white hover:bg-black/10 dark:hover:bg-white/20' : 'bg-muted text-muted-foreground/40 cursor-not-allowed grayscale'}`} title="Twitter">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href={contact.instagram || '#'} target={contact.instagram ? "_blank" : "_self"} className={`p-3 rounded-xl transition-colors flex items-center justify-center ${contact.instagram ? 'bg-[#e1306c]/10 text-[#e1306c] hover:bg-[#e1306c]/20' : 'bg-muted text-muted-foreground/40 cursor-not-allowed grayscale'}`} title="Instagram">
                      <Instagram className="w-5 h-5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Business Card (if exists) */}
              {!isEditing && contact.business_card_image && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Scanned Business Card</div>
                  <div className="rounded-xl overflow-hidden border">
                    <img src={contact.business_card_image} alt="Visiting Card" className="w-full object-cover" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isDeleting && (
          <div className="p-4 bg-muted/10 border-t flex items-center justify-between">
            {!isEditing ? (
              <>
                <button onClick={() => setIsDeleting(true)} className="p-2.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  <Link href={`/contacts/${contact.id}`} className="px-5 py-2.5 bg-secondary text-secondary-foreground text-sm font-bold rounded-xl hover:bg-secondary/80 transition-colors">
                    Full Profile
                  </Link>
                  <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-muted-foreground text-sm font-bold rounded-xl hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Save Changes
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
