"use client";
import Link from 'next/link';
import { 
  Users, Plus, Search, 
  MoreHorizontal, Mail, Coffee, 
  FileText, TrendingUp, AlertCircle, Layers,
  ChevronRight, ArrowUpRight
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Dashboard() {
  const { contacts, groups } = useStore();
  const needsAttention = contacts.filter((c: any) => c.tags.includes('Investor') || c.tags.includes('VIP'));

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground text-sm font-medium">Welcome back. Here is your network at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/contacts" className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all bg-foreground text-background hover:bg-foreground/90 hover:scale-105 active:scale-95 h-10 px-5 shadow-lg shadow-black/5">
            <Plus className="w-4 h-4 mr-2" />
            New Contact
          </Link>
        </div>
      </div>

      {/* KPI Cards - Premium Styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group rounded-2xl border bg-card/50 backdrop-blur-sm p-6 transition-all hover:bg-card hover:shadow-md hover:border-border cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between pb-4">
            <h3 className="tracking-tight text-sm font-semibold text-muted-foreground uppercase">Total Directory</h3>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight">{contacts.length}</div>
          <div className="flex items-center text-xs font-medium mt-2 text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3 mr-1" /> +12% this month
          </div>
        </div>

        <div className="group rounded-2xl border bg-card/50 backdrop-blur-sm p-6 transition-all hover:bg-card hover:shadow-md hover:border-border cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between pb-4">
            <h3 className="tracking-tight text-sm font-semibold text-muted-foreground uppercase">VIPs & Investors</h3>
            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight">{needsAttention.length}</div>
          <p className="text-xs font-medium mt-2 text-muted-foreground">High priority network</p>
        </div>

        <div className="group rounded-2xl border bg-card/50 backdrop-blur-sm p-6 transition-all hover:bg-card hover:shadow-md hover:border-border cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between pb-4">
            <h3 className="tracking-tight text-sm font-semibold text-muted-foreground uppercase">Active Groups</h3>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight">{groups.length}</div>
          <p className="text-xs font-medium mt-2 text-muted-foreground">Active event cohorts</p>
        </div>

        <div className="group rounded-2xl border bg-card/50 backdrop-blur-sm p-6 transition-all hover:bg-card hover:shadow-md hover:border-border cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between pb-4">
            <h3 className="tracking-tight text-sm font-semibold text-muted-foreground uppercase">Network Health</h3>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-emerald-600">Strong</div>
          <p className="text-xs font-medium mt-2 text-muted-foreground">Consistent engagement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activity - Premium List */}
          <div className="rounded-2xl border bg-card shadow-sm">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight">Recent Activity</h3>
              <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                View Log <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-0">
              <div className="p-4 border-b border-border/40 hover:bg-muted/30 transition-colors flex gap-4 group">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform">
                  <Coffee className="w-4 h-4" />
                </div>
                <div className="flex-1 py-1">
                  <div className="text-sm text-foreground">Added new group <span className="font-semibold">Tech Investors</span></div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">2 hours ago</div>
                </div>
              </div>
              <div className="p-4 border-b border-border/40 hover:bg-muted/30 transition-colors flex gap-4 group">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 py-1">
                  <div className="text-sm text-foreground">Logged a note for <span className="font-semibold">Elena Rodriguez</span></div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">Yesterday at 4:30 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Network */}
          <div className="rounded-2xl border bg-card shadow-sm">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight">Priority Network</h3>
              <Link href="/contacts" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                See All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-2">
              {needsAttention.slice(0, 3).map((contact: any) => (
                <div key={contact.id} className="p-3 rounded-xl flex items-center justify-between hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <img 
                      src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} 
                      alt={contact.name} 
                      className="w-12 h-12 rounded-full bg-secondary border border-border p-0.5 flex-shrink-0" 
                    />
                    <div>
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{contact.name}</div>
                      <div className="text-xs font-medium text-muted-foreground mt-0.5">{contact.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={`mailto:${contact.email}`}
                      className="w-9 h-9 flex items-center justify-center hover:bg-background shadow-sm border border-transparent hover:border-border rounded-full transition-all text-muted-foreground hover:text-foreground"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    <Link 
                      href={`/contacts/${contact.id}`}
                      className="w-9 h-9 flex items-center justify-center hover:bg-background shadow-sm border border-transparent hover:border-border rounded-full transition-all text-muted-foreground hover:text-foreground"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Quick Search */}
          <div className="rounded-2xl border bg-card shadow-sm p-1">
             <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Quick search contacts..." 
                  className="w-full h-11 pl-10 pr-12 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
                <div className="absolute right-3 top-3 text-[10px] font-bold text-muted-foreground border bg-muted px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <span className="font-sans">⌘</span>K
                </div>
             </div>
          </div>

          {/* Recent Additions */}
          <div className="rounded-2xl border bg-card shadow-sm">
            <div className="p-6 border-b border-border/50">
              <h3 className="text-lg font-bold tracking-tight">Recently Added</h3>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {contacts.slice(0, 4).map((contact: any) => (
                <Link href={`/contacts/${contact.id}`} key={contact.id} className="flex items-center gap-4 group">
                  <img 
                    src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} 
                    alt={contact.name} 
                    className="w-10 h-10 rounded-full border border-border flex-shrink-0 bg-secondary group-hover:scale-105 transition-transform" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{contact.name}</div>
                    <div className="text-xs font-medium text-muted-foreground truncate">{contact.location}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
