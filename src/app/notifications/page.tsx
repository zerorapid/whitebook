"use client";
import { useState } from 'react';
import { Bell, Calendar, MessageSquare, AlertCircle, CheckCircle2, Clock, MoreHorizontal, Trash2, Check, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const unreadCount = notifications.filter((n: any) => !n.read).length;
  const filteredNotifications = notifications.filter((n: any) => activeTab === 'all' ? true : !n.read);

  const getIcon = (type: string) => {
    switch(type) {
      case 'event': return <Calendar className="w-4 h-4 text-foreground" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-foreground" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'system': return <Bell className="w-4 h-4 text-foreground" />;
    }
  };

  return (
    <div className="space-y-6 relative max-w-3xl mx-auto pb-10" onClick={() => setActiveDropdown(null)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Inbox {unreadCount > 0 && `(${unreadCount})`}</h2>
        <button onClick={markAllAsRead} disabled={unreadCount === 0} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent border h-9 px-4 disabled:opacity-50">
          <CheckCircle2 className="w-4 h-4 mr-2" /> Mark all as read
        </button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="border-b p-2 bg-muted/30 flex gap-2">
          <button onClick={() => setActiveTab('all')} className={`px-4 py-1.5 text-sm rounded-sm ${activeTab === 'all' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>All</button>
          <button onClick={() => setActiveTab('unread')} className={`px-4 py-1.5 text-sm rounded-sm ${activeTab === 'unread' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>Unread</button>
        </div>

        <div className="divide-y">
          {filteredNotifications.map((n: any) => (
            <div key={n.id} className={`p-5 flex gap-4 hover:bg-muted/50 ${!n.read ? 'bg-primary/5' : ''}`}>
              <div className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center border bg-background">{getIcon(n.type)}</div>
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-semibold">{n.title}</h4>
                <p className="text-sm text-muted-foreground">{n.description}</p>
              </div>
              <button onClick={() => markAsRead(n.id)} className="h-8 px-2 text-xs border rounded-md">Mark Read</button>
              <button onClick={() => deleteNotification(n.id)} className="h-8 px-2 text-xs border rounded-md text-destructive">Del</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
