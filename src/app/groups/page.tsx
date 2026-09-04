"use client";
import { useState } from 'react';
import { Layers, Plus, Users, Trash2, Edit2, X, Check } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function GroupsPage() {
  const { groups, addGroup, deleteGroup, contacts, updateContact } = useStore();
  const [activeGroup, setActiveGroup] = useState<any>(null);
  
  // Modals state
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Find contacts that belong to a group (by tag)
  const getContactsInGroup = (groupName: string) => {
    return contacts.filter((c: any) => c.tags?.includes(groupName));
  };

  // Add/Remove contact from active group
  const toggleContactInGroup = (contact: any) => {
    if (!activeGroup) return;
    const hasTag = contact.tags?.includes(activeGroup.name);
    
    let newTags = contact.tags || [];
    if (hasTag) {
      newTags = newTags.filter((t: string) => t !== activeGroup.name);
    } else {
      newTags = [...newTags, activeGroup.name];
    }
    
    updateContact(contact.id, { tags: newTags });
  };

  const handleCreateGroup = (e: any) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    
    const newGroup = {
      id: Date.now(),
      name: newGroupName,
      color: "bg-blue-100 text-blue-600"
    };
    addGroup(newGroup);
    setNewGroupName('');
    setShowNewGroup(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40 shrink-0">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Layers className="w-8 h-8 text-primary" />
            Groups & Cohorts
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Organize your network into distinct event cohorts and lists.</p>
        </div>
        <button 
          onClick={() => setShowNewGroup(true)}
          className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all bg-foreground text-background hover:bg-foreground/90 h-10 px-5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
        {/* Left Column: Group List */}
        <div className="w-full md:w-80 border rounded-2xl bg-card shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b bg-muted/30 font-bold text-sm tracking-wide uppercase text-muted-foreground">All Groups</div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {groups.map((group: any) => {
              const count = getContactsInGroup(group.name).length;
              return (
                <div 
                  key={group.id} 
                  onClick={() => setActiveGroup(group)}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${activeGroup?.id === group.id ? 'bg-primary/10 border-primary/20 border' : 'hover:bg-muted border border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${group.color || 'bg-slate-100 text-slate-600'}`}>
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">{group.name}</span>
                  </div>
                  <span className="text-xs font-bold bg-background border px-2 py-0.5 rounded-full text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Group Details & Contacts */}
        <div className="flex-1 border rounded-2xl bg-card shadow-sm flex flex-col overflow-hidden relative">
          {activeGroup ? (
            <>
              <div className="p-6 border-b flex items-center justify-between bg-muted/10">
                <div>
                  <h2 className="text-2xl font-bold">{activeGroup.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{getContactsInGroup(activeGroup.name).length} members in this group</p>
                </div>
                <button 
                  onClick={() => {
                    deleteGroup(activeGroup.id);
                    setActiveGroup(null);
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">Manage Members</h3>
                <div className="space-y-2">
                  {contacts.map((contact: any) => {
                    const isInGroup = contact.tags?.includes(activeGroup.name);
                    return (
                      <div key={contact.id} className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${isInGroup ? 'bg-primary/5 border-primary/30' : 'bg-background hover:bg-muted'}`}>
                        <div className="flex items-center gap-3">
                          <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} className="w-10 h-10 rounded-full bg-secondary" />
                          <div>
                            <div className="font-semibold text-sm">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">{contact.role}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleContactInGroup(contact)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isInGroup ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                        >
                          {isInGroup ? 'Remove' : 'Add to Group'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <Layers className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-semibold">Select a group to view and manage members</p>
            </div>
          )}
        </div>
      </div>

      {/* New Group Modal */}
      {showNewGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md p-6 rounded-2xl shadow-xl border animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create New Group</h2>
              <button onClick={() => setShowNewGroup(false)} className="text-muted-foreground hover:bg-muted p-2 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Group Name</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Investors 2026" 
                  className="w-full p-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors">
                Save Group
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
