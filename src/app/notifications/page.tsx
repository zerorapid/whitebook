"use client";
import { Bell, Check, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-3xl mx-auto">
      <div className="flex items-center justify-between pb-6 border-b border-border/40">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Stay updated on syncs, duplicates, and reminders.</p>
        </div>
        <button onClick={markAllAsRead} className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-lg hover:bg-secondary/80 transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif: any) => (
          <div key={notif.id} className={`p-4 rounded-xl border flex gap-4 transition-colors ${notif.read ? 'bg-card' : 'bg-primary/5 border-primary/20'}`}>
            <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${notif.read ? 'bg-transparent' : 'bg-primary'}`}></div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{notif.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{notif.description}</p>
              <div className="text-xs text-muted-foreground font-medium mt-2">{notif.time}</div>
            </div>
            <div className="flex flex-col gap-2">
              {!notif.read && (
                <button onClick={() => markAsRead(notif.id)} className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors" title="Mark as read">
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => deleteNotification(notif.id)} className="p-2 hover:bg-rose-50 text-rose-500 rounded-md transition-colors" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
