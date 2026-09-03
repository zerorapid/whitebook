"use client";
import { useState } from 'react';
import { 
  Users, Calendar as CalIcon, Download, 
  CheckSquare, Activity, FileText, FileSpreadsheet, X, 
  CheckCircle2, FolderHeart, Clock, ChevronDown
} from 'lucide-react';
import { useStore } from '@/lib/store';

// Mock data for the activity volume chart
const activityData = [
  { label: 'Mon', tasks: 12, events: 3, contacts: 4 },
  { label: 'Tue', tasks: 19, events: 5, contacts: 2 },
  { label: 'Wed', tasks: 15, events: 2, contacts: 7 },
  { label: 'Thu', tasks: 22, events: 4, contacts: 1 },
  { label: 'Fri', tasks: 14, events: 1, contacts: 5 },
  { label: 'Sat', tasks: 5, events: 0, contacts: 0 },
  { label: 'Sun', tasks: 2, events: 0, contacts: 0 },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('This Week');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  // Pulling live data from Global Store
  const { contacts, events, groups, tasks } = useStore();
  
  const totalContacts = contacts.length;
  const upcomingEvents = events.length;
  const activeGroups = groups.length;
  const tasksCompletedThisWeek = tasks.filter((t: any) => t.status === 'done').length;

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
      setIsExportModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 relative pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Reports</h1>
          <p className="text-muted-foreground mt-1">Monitor your schedule, tasks, and network growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none h-9 pl-3 pr-8 rounded-md border border-input bg-background text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>All Time</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />
          </div>
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 shadow-sm gap-2"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Network</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">Synced from contacts</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Tasks Completed</h3>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{tasksCompletedThisWeek}</div>
            <p className="text-xs text-muted-foreground">+12% vs last week</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Upcoming Events</h3>
            <CalIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Synced from calendar</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Groups</h3>
            <FolderHeart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{activeGroups}</div>
            <p className="text-xs text-muted-foreground">Synced from groups</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Volume Chart */}
        <div className="lg:col-span-2 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col">
          <div className="p-6 flex flex-col space-y-1.5 pb-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold leading-none tracking-tight">Activity Volume</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> Tasks</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary/50"></div> Events</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div> Contacts</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">A breakdown of your daily interactions.</p>
          </div>
          
          <div className="p-6 pt-4 mt-auto h-[300px] flex items-end justify-between gap-2 md:gap-6 border-t border-border/50 relative">
            <div className="absolute inset-0 p-6 pt-4 flex flex-col justify-between pointer-events-none pb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full border-t border-border/50 border-dashed"></div>
              ))}
            </div>

            {activityData.map((data, i) => {
              const total = data.tasks + data.events + data.contacts;
              const heightPct = Math.min((total / 30) * 100, 100);
              const taskPct = (data.tasks / total) * 100;
              const eventPct = (data.events / total) * 100;
              const contactPct = (data.contacts / total) * 100;

              return (
                <div key={i} className="relative flex flex-col items-center flex-1 h-full justify-end group z-10">
                  <div className="w-full max-w-[48px] flex flex-col justify-end overflow-hidden rounded-t-sm transition-all duration-300 ease-out hover:opacity-80" style={{ height: `${heightPct}%` }}>
                    <div style={{ height: `${contactPct}%` }} className="w-full bg-muted-foreground/30"></div>
                    <div style={{ height: `${eventPct}%` }} className="w-full bg-primary/50 border-y border-background"></div>
                    <div style={{ height: `${taskPct}%` }} className="w-full bg-primary"></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-3">{data.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col">
          <div className="p-6 flex flex-col space-y-1.5 border-b border-border/50">
            <h3 className="font-semibold leading-none tracking-tight">Upcoming Schedule</h3>
            <p className="text-sm text-muted-foreground">Your next scheduled events.</p>
          </div>
          <div className="p-0 divide-y divide-border/50 overflow-y-auto flex-1 max-h-[340px]">
            {events.map((event: any, idx: number) => {
              const d = new Date(event.date);
              return (
                <div key={idx} className="p-4 flex gap-4 hover:bg-muted/50 transition-colors group">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-md bg-secondary text-secondary-foreground border border-border/50 shrink-0">
                    <span className="text-[10px] font-semibold uppercase">{isNaN(d.getTime()) ? 'EVT' : d.toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-lg font-bold leading-none">{isNaN(d.getTime()) ? '00' : d.getDate()}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium leading-none mb-1.5 group-hover:text-primary transition-colors">{event.title}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3" /> {event.time}</p>
                  </div>
                </div>
              );
            })}
            {events.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No upcoming events.</div>}
          </div>
        </div>
      </div>

      {/* Recent Connections */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-6 flex flex-row items-center justify-between border-b border-border/50">
          <div className="space-y-1.5">
            <h3 className="font-semibold leading-none tracking-tight">Recent Connections</h3>
            <p className="text-sm text-muted-foreground">The latest contacts added to your directory.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-3 font-medium">Contact Name</th>
                <th className="px-6 py-3 font-medium">Role & Location</th>
                <th className="px-6 py-3 font-medium">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {contacts.slice(0, 5).map((contact: any) => (
                <tr key={contact.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} alt="" className="w-8 h-8 rounded-full border border-border/50 bg-secondary" />
                      <span className="font-medium text-foreground">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-medium text-foreground">{contact.role}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{contact.location}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {contact.tags.map((tag: string) => (
                        <span key={tag} className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">{tag}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
