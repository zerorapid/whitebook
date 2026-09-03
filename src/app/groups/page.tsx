"use client";
import { useState } from 'react';
import { Plus, Users, Star, TrendingUp, Terminal, GraduationCap, MoreHorizontal, X, Trash2 } from 'lucide-react';
import { groups } from '@/lib/data';
import { useRouter } from 'next/navigation';

const iconMap: Record<string, React.ReactNode> = {
  'star': <Star className="w-5 h-5 text-amber-500" />,
  'trending-up': <TrendingUp className="w-5 h-5 text-emerald-500" />,
  'terminal': <Terminal className="w-5 h-5 text-blue-500" />,
  'graduation-cap': <GraduationCap className="w-5 h-5 text-purple-500" />,
};

const iconOptions = [
  { value: 'star', label: 'Star' },
  { value: 'trending-up', label: 'Trending Up' },
  { value: 'terminal', label: 'Terminal' },
  { value: 'graduation-cap', label: 'Graduation Cap' }
];

const colorSwatches = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#ec4899'];

export default function GroupsPage() {
  const router = useRouter();
  
  // State for Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any | null>(null);
  
  // Form State for new group
  const [selectedColor, setSelectedColor] = useState(colorSwatches[0]);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groups & Tags</h1>
          <p className="text-muted-foreground mt-1">Organize your network into distinct categories.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 shadow-sm gap-2"
          >
            <Plus className="w-4 h-4" /> Create Group
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <div key={group.id} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-opacity-10"
                style={{ backgroundColor: `${group.color}20` }}
              >
                {iconMap[group.icon] || <Users className="w-5 h-5 text-muted-foreground" />}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{group.name}</h3>
                <p className="text-sm text-muted-foreground">{group.count} contacts</p>
              </div>
            </div>
            <div className="mt-auto flex gap-2">
              <button 
                onClick={() => router.push(`/contacts?group=${encodeURIComponent(group.name)}`)}
                className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                View Contacts
              </button>
              <button 
                onClick={() => setEditingGroup(group)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground rounded-xl shadow-lg max-w-md w-full border border-border animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="font-semibold text-lg">Create New Group</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Group Name</label>
                <input type="text" className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="e.g. Mastermind Group" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon</label>
                <select className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Theme Color</label>
                <div className="flex gap-3 mt-2">
                  {colorSwatches.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === color ? 'scale-110 border-foreground shadow-sm' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-2">
              <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">Cancel</button>
              <button onClick={() => {  setIsCreateOpen(false); }} className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Create Group</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {editingGroup && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground rounded-xl shadow-lg max-w-md w-full border border-border animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="font-semibold text-lg">Group Settings</h3>
              <button onClick={() => setEditingGroup(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Group Name</label>
                <input 
                  defaultValue={editingGroup.name}
                  type="text" 
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon</label>
                <select 
                  defaultValue={editingGroup.icon}
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-muted/30 flex justify-between gap-2">
              <button 
                onClick={() => {  setEditingGroup(null); }} 
                className="px-4 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete Group
              </button>
              <div className="flex gap-2">
                <button onClick={() => setEditingGroup(null)} className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">Cancel</button>
                <button onClick={() => {  setEditingGroup(null); }} className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
