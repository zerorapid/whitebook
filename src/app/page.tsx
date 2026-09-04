"use client";
import Link from 'next/link';
import { 
  Users, Plus, Search, 
  MoreHorizontal, Mail, Sparkles, 
  FileText, TrendingUp, AlertCircle, CalendarClock,
  ChevronRight, ArrowUpRight, Gift
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Dashboard() {
  const { contacts } = useStore();
  const followUps = contacts.filter((c: any) => c.followUp);
  const birthdays = contacts.filter((c: any) => c.birthday);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground text-sm font-medium">Your entire network synced, deduplicated, and enriched.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <h3 className="tracking-tight text-sm font-semibold text-muted-foreground uppercase">Total Synced</h3>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Users className="h-4 w-4" /></div>
          </div>
          <div className="text-3xl font-bold tracking-tight">{contacts.length}</div>
        </div>
        <div className="group rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <h3 className="tracking-tight text-sm font-semibold text-muted-foreground uppercase">Follow-ups</h3>
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><CalendarClock className="h-4 w-4" /></div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-amber-600">{followUps.length}</div>
        </div>
        <div className="group rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <h3 className="tracking-tight text-sm font-semibold text-muted-foreground uppercase">Birthdays</h3>
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500"><Gift className="h-4 w-4" /></div>
          </div>
          <div className="text-3xl font-bold tracking-tight">{birthdays.length}</div>
        </div>
        <div className="group rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <h3 className="tracking-tight text-sm font-semibold text-muted-foreground uppercase">AI Updates</h3>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Sparkles className="h-4 w-4" /></div>
          </div>
          <div className="text-3xl font-bold tracking-tight">12</div>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-bold tracking-tight">Pending Follow-ups</h3>
          </div>
          <div className="p-2">
            {followUps.map((contact: any) => (
              <div key={contact.id} className="p-3 rounded-xl flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} alt="" className="w-10 h-10 rounded-full bg-secondary" />
                  <div>
                    <div className="font-semibold text-sm">{contact.name}</div>
                    <div className="text-xs font-medium text-amber-600">Due {contact.followUp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-bold tracking-tight">Upcoming Birthdays</h3>
          </div>
          <div className="p-2">
            {birthdays.map((contact: any) => (
              <div key={contact.id} className="p-3 rounded-xl flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} alt="" className="w-10 h-10 rounded-full bg-secondary" />
                  <div>
                    <div className="font-semibold text-sm">{contact.name}</div>
                    <div className="text-xs font-medium text-muted-foreground">Turns 40 on {contact.birthday}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
