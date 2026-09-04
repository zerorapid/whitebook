const fs = require('fs');

// --- 1. Settings Page ---
const settingsPath = 'src/app/settings/page.tsx';
let settingsContent = fs.readFileSync(settingsPath, 'utf8');
if (!settingsContent.includes('setToggles')) {
  settingsContent = settingsContent.replace(
    'export default function SettingsPage() {',
    `export default function SettingsPage() {
  const [toggles, setToggles] = React.useState<Record<string, boolean>>({
    'Dark Mode': true,
    'Push Notifications': true,
    'Email Summaries': false,
    'Two-Factor Auth': false
  });

  const toggleSetting = (name: string) => {
    setToggles(prev => ({ ...prev, [name]: !prev[name] }));
  };
`
  );
  
  settingsContent = settingsContent.replace(
    /import \{ Settings.*?\} from 'lucide-react';/,
    "import { Settings, Shield, Bell, Key, Moon, Globe } from 'lucide-react';\nimport React from 'react';"
  );
  
  // Replace static toggles with dynamic ones
  settingsContent = settingsContent.replace(
    /<div className="w-10 h-6 bg-primary\/20 rounded-full flex items-center px-1">.*?<\/div>/gs,
    (match) => {
      // Find what the setting is called from the previous sibling...
      // For simplicity, we just inject a dynamic toggle button
      return \`<div className="flex-shrink-0">
                  <button type="button" className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary">
                    <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </button>
                </div>\`;
    }
  );
  
  // Actually a better way to fix settings is just completely replace it since it's a stub
  const newSettingsContent = `"use client";
import { Settings, Shield, Bell, Moon, Globe, Check } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'Dark Mode': true,
    'Compact View': false,
    'Push Notifications': true,
    'Email Summaries': false,
    'Two-Factor Auth': false,
    'Biometric Login': true
  });

  const toggle = (key: string) => setToggles(p => ({ ...p, [key]: !p[key] }));

  const sections = [
    {
      title: "Appearance",
      icon: Moon,
      items: [
        { name: "Dark Mode", desc: "Use the dark theme across the app." },
        { name: "Compact View", desc: "Decrease spacing to see more contacts at once." }
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { name: "Push Notifications", desc: "Get alerts for duplicates and updates." },
        { name: "Email Summaries", desc: "Weekly digest of your network growth." }
      ]
    },
    {
      title: "Security",
      icon: Shield,
      items: [
        { name: "Two-Factor Auth", desc: "Require a code when logging in." },
        { name: "Biometric Login", desc: "Use FaceID/TouchID on supported devices." }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Manage your preferences and security.</p>
      </div>

      <div className="grid gap-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="bg-card border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                <sec.icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">{sec.title}</h2>
            </div>
            
            <div className="space-y-6">
              {sec.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggle(item.name)}
                    className={\`w-12 h-6 rounded-full flex items-center px-1 transition-colors \${toggles[item.name] ? 'bg-primary' : 'bg-secondary'}\`}
                  >
                    <div className={\`w-4 h-4 rounded-full bg-white shadow-sm transition-transform \${toggles[item.name] ? 'translate-x-6' : 'translate-x-0'}\`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(settingsPath, newSettingsContent);
}

// --- 2. Integrations Page ---
const intPath = 'src/app/integrations/page.tsx';
const newIntContent = `"use client";
import { RefreshCw, Mail, Calendar, Linkedin, Phone } from 'lucide-react';
import { useState } from 'react';

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<string[]>(['Google Contacts']);

  const toggle = (name: string) => {
    setConnected(p => p.includes(name) ? p.filter(n => n !== name) : [...p, name]);
  };

  const platforms = [
    { name: "Google Contacts", icon: Mail, desc: "Two-way sync with your Google account.", color: "text-red-500" },
    { name: "Outlook", icon: Calendar, desc: "Import and sync Outlook contacts.", color: "text-blue-500" },
    { name: "LinkedIn", icon: Linkedin, desc: "Enrich contacts with LinkedIn data.", color: "text-blue-700" },
    { name: "iCloud Contacts", icon: Phone, desc: "Sync with your Apple devices.", color: "text-gray-500" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary" />
          Integrations
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Connect external sources to enrich your directory.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {platforms.map((p, i) => {
          const isConnected = connected.includes(p.name);
          return (
            <div key={i} className="bg-card border rounded-3xl p-6 shadow-sm flex flex-col items-center text-center gap-4 transition-all hover:shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <p.icon className={\`w-8 h-8 \${p.color}\`} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
              </div>
              <button 
                onClick={() => toggle(p.name)}
                className={\`mt-2 px-6 py-2 rounded-xl font-bold text-sm transition-colors \${isConnected ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-primary text-primary-foreground hover:bg-primary/90'}\`}
              >
                {isConnected ? 'Connected' : 'Connect'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
}
`;
fs.writeFileSync(intPath, newIntContent);

// --- 3. Profile Actions (mailto / tel) ---
const profilePath = 'src/app/contacts/[id]/page.tsx';
let profileContent = fs.readFileSync(profilePath, 'utf8');

// The Send Message button
profileContent = profileContent.replace(
  '<button className="flex-1 py-3 px-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">',
  `<button onClick={() => window.location.href = \`sms:\${contact.phone}\`} className="flex-1 py-3 px-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">`
);

// The Email button
profileContent = profileContent.replace(
  '<button className="p-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors">',
  `<button onClick={() => window.location.href = \`mailto:\${contact.email}\`} className="p-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors">`
);

fs.writeFileSync(profilePath, profileContent);

