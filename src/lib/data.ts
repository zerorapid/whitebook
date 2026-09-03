export const contacts = [
  { id: 1, name: 'Sarah Chen', role: 'Product Manager', email: 'sarah@techcorp.com', location: 'San Francisco, CA', tags: ['VIP', 'Tech'], added: 'Mar 15, 2024' },
  { id: 2, name: 'Michael Rodriguez', role: 'Angel Investor', email: 'm.rodriguez@capital.io', location: 'Austin, TX', tags: ['Investor', 'Early Stage'], added: 'Feb 28, 2024' },
  { id: 3, name: 'Emma Watson', role: 'Head of Growth', email: 'emma.w@startup.co', location: 'London, UK', tags: ['Marketing', 'B2B'], added: 'Jan 10, 2024' },
  { id: 4, name: 'David Kim', role: 'CTO', email: 'david.kim@innovate.net', location: 'Seattle, WA', tags: ['Tech', 'Enterprise'], added: 'Mar 02, 2024' },
  { id: 5, name: 'Lisa Johnson', role: 'Founder', email: 'lisa@nextgen.co', location: 'New York, NY', tags: ['Founder', 'VIP'], added: 'Dec 15, 2023' },
];

export const groups = [
  { id: 1, name: 'VIP Clients', count: 12, icon: 'star', color: '#f59e0b' },
  { id: 2, name: 'Investors', count: 8, icon: 'trending-up', color: '#10b981' },
  { id: 3, name: 'Tech Partners', count: 24, icon: 'terminal', color: '#3b82f6' },
  { id: 4, name: 'Alumni', count: 45, icon: 'graduation-cap', color: '#8b5cf6' },
];

export const events = [
  { id: 1, title: 'Q1 Review', date: new Date(), time: '10:00 AM' },
  { id: 2, title: 'Investor Pitch', date: new Date(new Date().setDate(new Date().getDate() + 2)), time: '2:30 PM' },
  { id: 3, title: 'Product Launch', date: new Date(new Date().setDate(new Date().getDate() + 5)), time: '9:00 AM' },
];

export const deals = [
  { id: 1, client: 'Acme Corp', amount: 12500, status: 'Won', date: '2024-03-12' },
  { id: 2, client: 'Global Tech', amount: 8200, status: 'Pending', date: '2024-03-10' },
  { id: 3, client: 'Stark Industries', amount: 24000, status: 'Won', date: '2024-03-08' },
  { id: 4, client: 'Wayne Enterprises', amount: 5500, status: 'Lost', date: '2024-03-05' },
  { id: 5, client: 'LexCorp', amount: 45000, status: 'Pending', date: '2024-03-15' },
  { id: 6, client: 'Daily Planet', amount: 3200, status: 'Won', date: '2024-03-01' },
];

export const revenueData = [
  { label: 'Jan', value: 35 }, { label: 'Feb', value: 45 }, 
  { label: 'Mar', value: 75 }, { label: 'Apr', value: 50 },
  { label: 'May', value: 65 }, { label: 'Jun', value: 90 }
];
