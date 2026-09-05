"use client";
import { useState } from 'react';
import { 
  User, Shield, Bell, AlertTriangle, Save, 
  Camera, Check, Smartphone, Key, Mail, Lock, Database, Download, Upload
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [profile, setProfile] = useState({ name: 'Srikanth', role: 'Event Organizer', company: 'Whitebook Events', email: 'srikanth@whitebook.app', phone: '+919876543210', linkedin: 'https://linkedin.com/in/srikanth' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  
  // Toggles for notifications
  const [notifs, setNotifs] = useState({ push: true, email: false, digest: true });
  const [security, setSecurity] = useState({ twoFactor: false, biometric: true });

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const tabs = [
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'data', name: 'Data & Import', icon: Database },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-8 px-2 md:px-0">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0 px-2 md:px-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 min-w-0 px-2 md:px-0">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold tracking-tight mb-6">Profile Information</h2>
                
                <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground border-4 border-background shadow-sm overflow-hidden">
                      EU
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1.5 flex-1 pt-2">
                    <h3 className="font-bold text-base">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">PNG, JPG or GIF up to 5MB. This will be displayed on your digital card.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="text" 
                          value={profile.name}
                          onChange={e => setProfile({...profile, name: e.target.value})}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="email" 
                          value={profile.email}
                          onChange={e => setProfile({...profile, email: e.target.value})}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border/40 flex justify-end">
                    <button 
                      onClick={handleSave}
                      className="flex items-center justify-center gap-2 px-6 h-11 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all"
                    >
                      {isLoading ? <span className="animate-pulse">Saving...</span> : <><Save className="w-4 h-4" /> Save Changes</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DATA & IMPORT TAB */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" /> Data Management
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Export Card */}
                  <div className="border border-border/60 rounded-2xl p-5 flex flex-col justify-between hover:border-primary/50 transition-colors group bg-muted/10">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Download className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-base mb-1">Export Contacts</h3>
                      <p className="text-sm text-muted-foreground mb-6">Download your entire directory as a standard CSV file for backups or external use.</p>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 h-10 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-sm font-bold transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                      <Download className="w-4 h-4" /> Export to CSV
                    </button>
                  </div>

                  {/* Import Card */}
                  <div className="border border-border/60 rounded-2xl p-5 flex flex-col justify-between hover:border-primary/50 transition-colors group bg-muted/10">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Upload className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-base mb-1">Import Contacts</h3>
                      <p className="text-sm text-muted-foreground mb-6">Bulk add contacts by uploading a CSV file. We will automatically map the columns.</p>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 h-10 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-sm font-bold transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                      <Upload className="w-4 h-4" /> Import from CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> Danger Zone
                    </h2>
                    <p className="text-sm text-red-600/70 mt-1">Permanently delete your account and all associated data.</p>
                  </div>
                  <button className="px-5 h-10 bg-red-500 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-red-600 active:scale-95 transition-all whitespace-nowrap">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" /> Change Password
                </h2>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-bold mb-1.5">Current Password</label>
                    <input 
                      type="password" 
                      value={passwords.current}
                      onChange={e => setPasswords({...passwords, current: e.target.value})}
                      className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1.5">New Password</label>
                    <input 
                      type="password" 
                      value={passwords.new}
                      onChange={e => setPasswords({...passwords, new: e.target.value})}
                      className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1.5">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwords.confirm}
                      onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                      className="w-full h-11 px-4 rounded-xl border border-border/40 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all" 
                    />
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={handleSave}
                      className="h-11 px-6 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all"
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold tracking-tight mb-6">Advanced Security</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">Two-Factor Authentication</h3>
                        <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security requiring an SMS or authenticator app code.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSecurity(s => ({ ...s, twoFactor: !s.twoFactor }))}
                      className={`shrink-0 w-12 h-6 rounded-full flex items-center px-1 transition-colors ${security.twoFactor ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${security.twoFactor ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Lock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">Biometric Login</h3>
                        <p className="text-xs text-muted-foreground mt-1">Use FaceID or TouchID on supported devices for faster login.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSecurity(s => ({ ...s, biometric: !s.biometric }))}
                      className={`shrink-0 w-12 h-6 rounded-full flex items-center px-1 transition-colors ${security.biometric ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${security.biometric ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold tracking-tight mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm">Push Notifications</h3>
                      <p className="text-xs text-muted-foreground mt-1">Get instant alerts for duplicates, AI insights, and important updates.</p>
                    </div>
                    <button 
                      onClick={() => setNotifs(n => ({ ...n, push: !n.push }))}
                      className={`shrink-0 w-12 h-6 rounded-full flex items-center px-1 transition-colors ${notifs.push ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notifs.push ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm">Marketing Emails</h3>
                      <p className="text-xs text-muted-foreground mt-1">Receive news, feature updates, and special offers.</p>
                    </div>
                    <button 
                      onClick={() => setNotifs(n => ({ ...n, email: !n.email }))}
                      className={`shrink-0 w-12 h-6 rounded-full flex items-center px-1 transition-colors ${notifs.email ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notifs.email ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm">Weekly Digest</h3>
                      <p className="text-xs text-muted-foreground mt-1">A weekly summary of your network growth and AI interactions.</p>
                    </div>
                    <button 
                      onClick={() => setNotifs(n => ({ ...n, digest: !n.digest }))}
                      className={`shrink-0 w-12 h-6 rounded-full flex items-center px-1 transition-colors ${notifs.digest ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notifs.digest ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
