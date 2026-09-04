"use client";
import { useState, useMemo } from 'react';
import { Layers, Plus, Users, Trash2, Edit2, X, Search, UserPlus, Check } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function GroupsPage() {
  const { groups, addGroup, updateGroup, deleteGroup, contacts, updateContact } = useStore();
  const [activeGroup, setActiveGroup] = useState<any>(null);
  
  // Modals state
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);
  
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [directorySearchQuery, setDirectorySearchQuery] = useState('');

  // Find contacts that belong to a group (by tag)
  const getContactsInGroup = (groupName: string) => {
    return contacts.filter((c: any) => c.tags?.includes(groupName));
  };

  // The members of the currently selected group
  const groupMembers = useMemo(() => {
    if (!activeGroup) return [];
    const members = getContactsInGroup(activeGroup.name);
    if (!memberSearchQuery.trim()) return members;
    return members.filter((m: any) => m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()));
  }, [activeGroup, contacts, memberSearchQuery]);

  // The search results for the directory
  const directoryResults = useMemo(() => {
    if (!directorySearchQuery.trim()) return contacts.slice(0, 50); // Show top 50
    return contacts.filter((c: any) => 
        c.name.toLowerCase().includes(directorySearchQuery.toLowerCase()) || 
        c.company.toLowerCase().includes(directorySearchQuery.toLowerCase())
    ).slice(0, 50);
  }, [contacts, directorySearchQuery]);

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
    addGroup(newGroup, selectedContactIds); // Store action handles applying tags
    setNewGroupName('');
    setSelectedContactIds([]);
    setShowNewGroup(false);
    setActiveGroup(newGroup);
  };

  const handleEditGroup = (e: any) => {
    e.preventDefault();
    if (!newGroupName.trim() || !activeGroup) return;
    
    updateGroup(activeGroup.id, newGroupName);
    setActiveGroup({ ...activeGroup, name: newGroupName });
    setShowEditGroup(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40 shrink-0">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Layers className="w-8 h-8 text-primary" />
            Groups & Cohorts
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Create lists and manage participants (WhatsApp style).</p>
        </div>
        <button 
          onClick={() => {
            setNewGroupName('');
            setSelectedContactIds([]);
            setDirectorySearchQuery('');
            setShowNewGroup(true);
          }}
          className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all bg-foreground text-background hover:bg-foreground/90 h-10 px-5 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Group
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
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${activeGroup?.id === group.id ? 'bg-primary/10 border-primary/20 border shadow-sm' : 'hover:bg-muted border border-transparent'}`}
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
              {/* Group Header */}
              <div className="p-6 border-b flex flex-col gap-4 bg-muted/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeGroup.color || 'bg-slate-100 text-slate-600'}`}>
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        {activeGroup.name}
                        <button 
                          onClick={() => {
                            setNewGroupName(activeGroup.name);
                            setShowEditGroup(true);
                          }}
                          className="p-1.5 text-muted-foreground hover:bg-background rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">{getContactsInGroup(activeGroup.name).length} participants</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setDirectorySearchQuery('');
                        setShowAddMember(true);
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" /> Add Participants
                    </button>
                    <button 
                      onClick={() => {
                        deleteGroup(activeGroup.id);
                        setActiveGroup(null);
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors border shadow-sm bg-background"
                      title="Delete Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Group Members List */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search within participants..." 
                      value={memberSearchQuery}
                      onChange={e => setMemberSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {groupMembers.map((contact: any) => (
                    <div key={contact.id} className="p-3 rounded-xl border bg-background flex items-center justify-between hover:border-primary/30 transition-colors group">
                      <div className="flex items-center gap-3">
                        <img src={contact.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} className="w-10 h-10 rounded-full bg-secondary" />
                        <div>
                          <div className="font-semibold text-sm">{contact.name}</div>
                          <div className="text-xs text-muted-foreground">{contact.role} at {contact.company}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleContactInGroup(contact)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:bg-rose-100 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {groupMembers.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">No participants in this group.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <Layers className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-semibold">Select a group to view and manage participants</p>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Style New Group Modal */}
      {showNewGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-xl p-6 rounded-2xl shadow-xl border animate-in zoom-in-95 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-xl font-bold">New Group</h2>
              <button onClick={() => setShowNewGroup(false)} className="text-muted-foreground hover:bg-muted p-2 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreateGroup} className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-4 shrink-0 mb-6">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Group Subject</label>
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
              </div>

              <div className="flex flex-col flex-1 overflow-hidden">
                <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
                  Add Participants ({selectedContactIds.length} selected)
                </label>
                
                <div className="relative mb-3 shrink-0">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search directory..." 
                    value={directorySearchQuery}
                    onChange={(e) => setDirectorySearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary/20" 
                  />
                </div>

                <div className="flex-1 overflow-y-auto border rounded-xl bg-background divide-y">
                  {directoryResults.map((contact: any) => {
                    const isSelected = selectedContactIds.includes(contact.id);
                    return (
                      <div 
                        key={contact.id} 
                        onClick={() => {
                          if (isSelected) {
                            setSelectedContactIds(selectedContactIds.filter(id => id !== contact.id));
                          } else {
                            setSelectedContactIds([...selectedContactIds, contact.id]);
                          }
                        }}
                        className={`p-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={contact.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} className="w-8 h-8 rounded-full bg-secondary" />
                          <div className="font-semibold text-sm">{contact.name}</div>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-background'}`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t shrink-0">
                <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors">
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Group Info Modal */}
      {showEditGroup && activeGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-sm p-6 rounded-2xl shadow-xl border animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Edit Group Info</h2>
              <button onClick={() => setShowEditGroup(false)} className="text-muted-foreground hover:bg-muted p-2 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleEditGroup} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Group Subject</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full p-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Members Modal (Multi-select) */}
      {showAddMember && activeGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-lg p-6 rounded-2xl shadow-xl border animate-in zoom-in-95 flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="text-xl font-bold">Add Participants</h2>
              <button onClick={() => setShowAddMember(false)} className="text-muted-foreground hover:bg-muted p-2 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="relative mb-4 shrink-0">
              <Search className="w-5 h-5 absolute left-3 top-3 text-muted-foreground" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search directory..." 
                value={directorySearchQuery}
                onChange={(e) => setDirectorySearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 shadow-sm" 
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {directoryResults.map((contact: any) => {
                const isInGroup = contact.tags?.includes(activeGroup.name);
                return (
                  <div key={contact.id} className="p-3 rounded-xl border flex items-center justify-between bg-background">
                    <div className="flex items-center gap-3">
                      <img src={contact.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(contact.name)}&backgroundColor=transparent`} className="w-10 h-10 rounded-full bg-secondary" />
                      <div>
                        <div className="font-semibold text-sm">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.role} at {contact.company}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleContactInGroup(contact)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isInGroup ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                    >
                      {isInGroup ? 'Added' : 'Add'}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t shrink-0">
              <button onClick={() => setShowAddMember(false)} className="w-full py-2.5 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-colors">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
