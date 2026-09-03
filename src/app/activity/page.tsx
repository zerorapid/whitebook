"use client";
import { Coffee, Phone, FileText, Mail, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ActivityPage() {
  const activities = [
    { id: 1, type: 'coffee', text: 'Coffee meeting with Sarah Chen', time: '2 hours ago', icon: Coffee, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 2, type: 'call', text: 'Call with David Kim regarding API integration', time: 'Yesterday, 3:00 PM', icon: Phone, color: 'text-amber-600', bg: 'bg-amber-100' },
    { id: 3, type: 'note', text: 'Added note to Elena Rodriguez profile', time: 'Mar 15, 2024', icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 4, type: 'email', text: 'Sent follow-up email to Marcus Johnson', time: 'Mar 12, 2024', icon: Mail, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 5, type: 'meeting', text: 'Quarterly review with VIP Clients', time: 'Mar 10, 2024', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 6, type: 'note', text: 'Updated David Kim phone number', time: 'Mar 08, 2024', icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Activity Log</h1>
          <p className="text-muted-foreground mt-1">A complete history of all interactions across your network.</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-0 divide-y divide-border">
          {activities.map(activity => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="p-6 flex gap-4 hover:bg-muted/30 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.bg} ${activity.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{activity.time}</div>
                  <div className="text-base font-medium">{activity.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
