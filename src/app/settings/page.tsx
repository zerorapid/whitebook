"use client";
import { useState } from 'react';
import { 
  User, Settings as SettingsIcon, Bell, Shield, 
  Camera, Mail, Smartphone, ShieldAlert, DownloadCloud,
  Trash2, ChevronDown
} from 'lucide-react';

type Tab = 'profile' | 'account' | 'notifications' | 'security';

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`w-11 h-6 rounded-full transition-colors relative inline-flex shrink-0 cursor-pointer items-center border-2 border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${checked ? 'bg-primary' : 'bg-input'}`}
  >
    <div className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Notification States
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [marketingNotif, setMarketingNotif] = useState(false);
  
  const handleSave = () => {
    
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="mr-2 h-4 w-4" /> },
    { id: 'account', label: 'Account', icon: <SettingsIcon className="mr-2 h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="mr-2 h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="mr-2 h-4 w-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
      </div>
      <div className="my-6 w-full border-t border-border" />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        {/* Sidebar Navigation */}
        <aside className="lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`inline-flex items-center justify-start rounded-md h-9 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${
                  activeTab === tab.id 
                    ? 'bg-muted hover:bg-muted text-foreground' 
                    : 'text-muted-foreground'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 lg:max-w-2xl">
          
          {/* PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
              </div>
              <div className="my-4 w-full border-t border-border" />
              
              <div className="space-y-8">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer">
                    <img 
                      src="https://api.dicebear.com/7.x/micah/svg?seed=AlexJohnson&backgroundColor=transparent" 
                      alt="Avatar" 
                      className="w-20 h-20 rounded-full border border-border bg-secondary group-hover:opacity-50 transition-opacity" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5 text-foreground" />
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-2">
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2">Change picture</button>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">Remove</button>
                    </div>
                    <p className="text-[0.8rem] text-muted-foreground mt-2">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">First name</label>
                      <input defaultValue="Alex" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Last name</label>
                      <input defaultValue="Johnson" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Email</label>
                    <input defaultValue="alex@crm-os.com" type="email" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    <p className="text-[0.8rem] text-muted-foreground">You can manage verified email addresses in your account settings.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Bio</label>
                    <textarea 
                      defaultValue="Consultant with 10+ years experience in B2B."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" 
                    />
                    <p className="text-[0.8rem] text-muted-foreground">Brief description for your profile. URLs are hyperlinked.</p>
                  </div>
                </div>
                <button onClick={handleSave} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 shadow-sm">Update profile</button>
              </div>
            </div>
          )}

          {/* ACCOUNT SETTINGS */}
          {activeTab === 'account' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-lg font-medium">Account</h3>
                <p className="text-sm text-muted-foreground">Update your account settings. Set your preferred language and timezone.</p>
              </div>
              <div className="my-4 w-full border-t border-border" />
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Workspace Name</label>
                  <input defaultValue="Personal Directory" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                  <p className="text-[0.8rem] text-muted-foreground">This is the name that will be displayed in your workspace.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Language</label>
                  <div className="relative">
                    <select className="appearance-none flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />
                  </div>
                  <p className="text-[0.8rem] text-muted-foreground">This is the language that will be used in the dashboard.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Timezone</label>
                  <div className="relative">
                    <select className="appearance-none flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                      <option>Pacific Standard Time (PST)</option>
                      <option>Eastern Standard Time (EST)</option>
                      <option>Greenwich Mean Time (GMT)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />
                  </div>
                </div>

                <button onClick={handleSave} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 shadow-sm">Update account</button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS SETTINGS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-lg font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">Configure how you receive notifications.</p>
              </div>
              <div className="my-4 w-full border-t border-border" />
              
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border border-border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Email Notifications</label>
                    <p className="text-[0.8rem] text-muted-foreground">Receive daily summaries and critical alerts.</p>
                  </div>
                  <Toggle checked={emailNotif} onChange={setEmailNotif} />
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border border-border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Push Notifications</label>
                    <p className="text-[0.8rem] text-muted-foreground">Get desktop alerts for new messages.</p>
                  </div>
                  <Toggle checked={pushNotif} onChange={setPushNotif} />
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border border-border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">SMS Alerts</label>
                    <p className="text-[0.8rem] text-muted-foreground">Receive texts for upcoming meetings.</p>
                  </div>
                  <Toggle checked={smsNotif} onChange={setSmsNotif} />
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border border-border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Marketing Emails</label>
                    <p className="text-[0.8rem] text-muted-foreground">Receive emails about new products, features, and more.</p>
                  </div>
                  <Toggle checked={marketingNotif} onChange={setMarketingNotif} />
                </div>
                
                <button onClick={handleSave} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 shadow-sm">Update notifications</button>
              </div>
            </div>
          )}

          {/* SECURITY SETTINGS */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-lg font-medium">Security</h3>
                <p className="text-sm text-muted-foreground">Manage your account security and authentication.</p>
              </div>
              <div className="my-4 w-full border-t border-border" />
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Current Password</label>
                    <input type="password" placeholder="••••••••" className="flex h-9 w-full max-w-sm rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">New Password</label>
                    <input type="password" placeholder="••••••••" className="flex h-9 w-full max-w-sm rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                  </div>
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2 shadow-sm">Update password</button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center rounded-lg border border-border p-4 shadow-sm bg-card">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Authenticator App</p>
                      <p className="text-[0.8rem] text-muted-foreground">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 shadow-sm">Enable 2FA</button>
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
