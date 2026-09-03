"use client";
import { Users, TrendingUp, Calendar as CalIcon, AlertCircle, Coffee, Phone, FileText, Mail, ArrowRight, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { contacts, events } from '@/lib/data';

export default function Dashboard() {
  const needsAttention = contacts.filter(c => c.needsFollowUp);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good morning, Alex</h1>
          <p className="text-muted-foreground mt-1">Here is what is happening with your network today.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/reports" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 shadow-sm">
            Export
          </Link>
          <Link href="/contacts" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 shadow-sm gap-2">
            New Contact
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Contacts</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{contacts.length}</div>
          <p className="text-xs text-green-600 font-medium mt-1">+12% from last month</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Needs Follow-up</h3>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{needsAttention.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Contacts requiring attention</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Upcoming Events</h3>
            <CalIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{events.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Scheduled for this week</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Network Growth</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">Healthy</div>
          <p className="text-xs text-muted-foreground mt-1">Consistent engagement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
              <button onClick={() => alert("Full activity log coming soon!")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">View all</button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              {/* Timeline Item 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">2 hours ago</div>
                  <div className="text-sm"><strong>Coffee meeting</strong> with Sarah Chen</div>
                </div>
              </div>
              {/* Timeline Item 2 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Yesterday</div>
                  <div className="text-sm"><strong>Call</strong> with David Kim regarding API integration</div>
                </div>
              </div>
              {/* Timeline Item 3 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Mar 15</div>
                  <div className="text-sm"><strong>Added note</strong> to Elena Rodriguez's profile</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold leading-none tracking-tight">Contacts Needing Attention</h3>
              <Link href="/contacts" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">View all</Link>
            </div>
            <div className="p-0">
              {needsAttention.map(contact => (
                <div key={contact.id} className="p-4 border-b border-border flex items-center justify-between hover:bg-muted/50 transition-colors last:border-0">
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/micah/svg?seed=${contact.name.replace(' ', '')}&backgroundColor=transparent`} 
                      alt={contact.name} 
                      className="w-10 h-10 rounded-full bg-blue-50/50 border border-border p-0.5 flex-shrink-0" 
                    />
                    <div>
                      <div className="font-medium text-sm">{contact.name}</div>
                      <div className="text-xs text-muted-foreground">{contact.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:inline-block mr-2">Last contacted: 3 months ago</span>
                    <a 
                      href={`mailto:${contact.email}`}
                      className="p-2 hover:bg-accent rounded-md transition-colors text-muted-foreground inline-block"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    <Link 
                      href={`/contacts/${contact.id}`}
                      className="p-2 hover:bg-accent rounded-md transition-colors text-muted-foreground inline-block"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold leading-none tracking-tight">Upcoming</h3>
              <Link href="/calendar" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">View calendar</Link>
            </div>
            <div className="p-6 flex flex-col gap-6">
              {events.slice(0, 3).map((event, i) => (
                <div key={event.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                    <CalIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {event.date.toLocaleDateString()} at {event.time}
                    </div>
                    <div className="text-sm font-medium">{event.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
