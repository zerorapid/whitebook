"use client";
import Link from 'next/link';
import { 
  Users, Sparkles, TrendingUp, AlertCircle, CalendarClock,
  Gift, Camera, MessageSquare, QrCode, PieChart, Activity,
  ChevronRight, Clock, ArrowUpRight
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Dashboard() {
  const { contacts } = useStore();
  
  // Computed Insights
  const followUps = contacts.filter((c: any) => c.followUp);
  const birthdays = contacts.filter((c: any) => c.birthday);
  
  // Calculate Top Roles
  const roles = contacts.map((c: any) => c.role || 'Unknown').filter((r: string) => r !== 'Unknown');
  const roleCounts = roles.reduce((acc: any, role: string) => {
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
  const topRoles = Object.entries(roleCounts)
    .sort(([,a]: any, [,b]: any) => b - a)
    .slice(0, 3)
    .map(([name, count]: any) => ({ name, count, percentage: Math.round((count / roles.length) * 100) || 0 }));

  // Generate dynamic AI briefing
  const recentAdds = Math.min(contacts.length, 12);
  const urgentCount = followUps.length + birthdays.length;
  
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Good morning, Srikanth.</h1>
          <p className="text-muted-foreground text-sm font-medium">Here is what is happening in your network today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all">
            <Camera className="w-4 h-4" /> Scan Badge
          </button>
          <Link href="/assistant" className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-bold shadow-sm hover:bg-secondary/80 active:scale-95 transition-all border border-border/50">
            <MessageSquare className="w-4 h-4" /> Ask Dude
          </Link>
          <Link href="/settings" className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-bold shadow-sm hover:bg-secondary/80 active:scale-95 transition-all border border-border/50">
            <QrCode className="w-4 h-4" /> My QR
          </Link>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* AI Morning Briefing (Spans 2 cols) */}
        <div className="md:col-span-2 rounded-[2rem] bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-primary">Dude's Morning Briefing</h2>
          </div>
          
          <div className="space-y-1 relative z-10">
            <p className="text-xl sm:text-2xl font-semibold text-foreground/90 tracking-tight">
              You have <strong className="text-amber-600">{urgentCount} items</strong> needing attention today.
            </p>
            <p className="text-muted-foreground font-medium text-sm sm:text-base">
              +{recentAdds} new connections • {followUps.length} follow-ups • {birthdays.length} birthdays
            </p>
          </div>
        </div>

        {/* Network Velocity (Spans 1 col) */}
        <div className="rounded-[2rem] bg-card border border-border/60 p-6 shadow-sm flex flex-col justify-between group hover:border-primary/30 transition-colors">
          <div className="flex items-start justify-between mb-8">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm bg-emerald-500/10 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-3 h-3" /> 24%
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Network Growth</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight">{contacts.length}</span>
              <span className="text-sm font-medium text-muted-foreground">total contacts</span>
            </div>
          </div>

          {/* Mini Bar Chart Mockup */}
          <div className="mt-6 flex items-end justify-between h-12 gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
            {[4, 7, 3, 8, 5, 12, 9].map((height, i) => (
              <div key={i} className="w-full bg-primary/20 rounded-t-sm hover:bg-primary transition-colors cursor-pointer" style={{ height: `${height * 8}%` }}></div>
            ))}
          </div>
        </div>

        {/* Needs Attention (Spans 2 cols) */}
        <div className="md:col-span-2 rounded-[2rem] bg-card border border-border/60 shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-border/40 bg-muted/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold tracking-tight">Requires Attention</h3>
            </div>
            <button className="text-xs font-bold text-primary hover:underline">View All</button>
          </div>
          
          <div className="p-2 flex-1 overflow-y-auto">
            {followUps.slice(0, 3).map((contact: any) => (
              <div key={contact.id} className="p-3 sm:p-4 rounded-2xl flex items-center justify-between hover:bg-muted/40 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} alt="" className="w-12 h-12 rounded-full bg-secondary border border-border/50" />
                  <div>
                    <div className="font-bold text-sm sm:text-base group-hover:text-primary transition-colors">{contact.name}</div>
                    <div className="text-xs sm:text-sm font-medium text-amber-600 flex items-center gap-1.5 mt-0.5">
                      <CalendarClock className="w-3.5 h-3.5" /> Follow up: {contact.followUp}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </div>
            ))}
            {birthdays.slice(0, 1).map((contact: any) => (
              <div key={contact.id + 'b'} className="p-3 sm:p-4 rounded-2xl flex items-center justify-between hover:bg-muted/40 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} alt="" className="w-12 h-12 rounded-full bg-secondary border border-border/50" />
                  <div>
                    <div className="font-bold text-sm sm:text-base group-hover:text-primary transition-colors">{contact.name}</div>
                    <div className="text-xs sm:text-sm font-medium text-rose-500 flex items-center gap-1.5 mt-0.5">
                      <Gift className="w-3.5 h-3.5" /> Birthday: {contact.birthday}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Top Audiences (Spans 1 col) */}
        <div className="rounded-[2rem] bg-card border border-border/60 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border/40 bg-muted/10 flex items-center gap-3">
             <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <PieChart className="w-4 h-4" />
              </div>
            <h3 className="text-lg font-bold tracking-tight">Top Sectors</h3>
          </div>
          <div className="p-6 space-y-6 flex-1">
            {topRoles.map((role: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold truncate pr-4">{role.name}</span>
                  <span className="font-bold text-muted-foreground shrink-0">{role.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${role.percentage}%` }}></div>
                </div>
              </div>
            ))}
            {topRoles.length === 0 && (
              <div className="text-sm text-muted-foreground text-center pt-4">No role data available yet.</div>
            )}
          </div>
        </div>

      </div>

      {/* Recent Activity Timeline */}
      <div className="mt-8 rounded-[2rem] bg-card border border-border/60 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">Recent Activity</h3>
        </div>
        
        <div className="space-y-6 ml-4 border-l-2 border-border/60 pl-6">
          <div className="relative">
            <div className="absolute -left-[31px] top-1 w-3 h-3 bg-indigo-500 rounded-full ring-4 ring-card"></div>
            <p className="text-sm font-bold">Dude updated profiles</p>
            <p className="text-sm text-muted-foreground mt-0.5">Enriched 4 contacts with LinkedIn data.</p>
            <span className="text-xs font-bold text-muted-foreground/60 flex items-center gap-1 mt-2">
              <Clock className="w-3 h-3" /> 2 hours ago
            </span>
          </div>
          <div className="relative">
            <div className="absolute -left-[31px] top-1 w-3 h-3 bg-emerald-500 rounded-full ring-4 ring-card"></div>
            <p className="text-sm font-bold">Imported CSV File</p>
            <p className="text-sm text-muted-foreground mt-0.5">Successfully imported 12 new contacts.</p>
            <span className="text-xs font-bold text-muted-foreground/60 flex items-center gap-1 mt-2">
              <Clock className="w-3 h-3" /> Yesterday
            </span>
          </div>
          <div className="relative">
            <div className="absolute -left-[31px] top-1 w-3 h-3 bg-amber-500 rounded-full ring-4 ring-card"></div>
            <p className="text-sm font-bold">Follow-up completed</p>
            <p className="text-sm text-muted-foreground mt-0.5">Marked meeting with Alexander Wright as done.</p>
            <span className="text-xs font-bold text-muted-foreground/60 flex items-center gap-1 mt-2">
              <Clock className="w-3 h-3" /> 2 days ago
            </span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
