"use client";
import { useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock, MoreHorizontal, Edit2, Trash2, X, Calendar as CalIcon, Tag, LayoutGrid, List as ListIcon, ChevronDown } from 'lucide-react';
import { useStore } from '@/lib/store';

type TaskStatus = 'todo' | 'in-progress' | 'done';

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [activeTab, setActiveTab] = useState<TaskStatus>('todo');
  const { tasks, addTask, updateTaskStatus, deleteTask } = useStore();
  
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-secondary text-secondary-foreground border-border';
      case 'medium': return 'bg-muted text-muted-foreground border-transparent';
      case 'low': return 'bg-background text-muted-foreground border-border';
      default: return 'bg-background text-muted-foreground border-border';
    }
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const element = document.getElementById(`task-${id}`);
      if (element) element.classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, id: number) => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
    const element = document.getElementById(`task-${id}`);
    if (element) element.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) setDragOverColumn(status);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTaskId !== null) {
      updateTaskStatus(draggedTaskId, status);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const renderKanbanCard = (task: any) => (
    <div 
      key={task.id} 
      id={`task-${task.id}`}
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      onDragEnd={(e) => handleDragEnd(e, task.id)}
      className="bg-card border border-border p-4 rounded-xl shadow-sm hover:shadow-md transition-all group relative cursor-grab active:cursor-grabbing shrink-0"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === task.id ? null : task.id); }} className="text-muted-foreground hover:bg-accent rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {activeDropdown === task.id && (
            <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-8 w-40 rounded-md border border-border bg-popover text-popover-foreground shadow-md overflow-hidden z-20 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground border-b bg-muted/30 uppercase tracking-wider">Move to</div>
              {['todo', 'in-progress', 'done'].map((status) => (
                status !== task.status && (
                  <button key={status} onClick={() => { updateTaskStatus(task.id, status as TaskStatus); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-accent capitalize">
                    {status.replace('-', ' ')}
                  </button>
                )
              ))}
              <div className="border-t my-1"></div>
              <button onClick={() => { deleteTask(task.id); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <h4 className={`font-semibold text-sm mb-3 leading-snug ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</h4>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium"><Clock className="w-3.5 h-3.5" /> {task.due}</div>
        <div className="text-[10px] font-semibold text-secondary-foreground bg-secondary px-2 py-0.5 rounded-md border border-border/50">{task.tag}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 relative h-[calc(100vh-8rem)] flex flex-col" onClick={() => setActiveDropdown(null)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your workflow and track statuses.</p>
        </div>
        <button onClick={() => setIsNewTaskOpen(true)} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 shadow-sm w-fit">
          <Plus className="w-4 h-4 mr-2" /> New Task
        </button>
      </div>

      <div className="flex-1 flex flex-row gap-6 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar">
        {['todo', 'in-progress', 'done'].map((status) => (
          <div key={status} onDragOver={(e) => handleDragOver(e, status as TaskStatus)} onDrop={(e) => handleDrop(e, status as TaskStatus)} className={`flex flex-col border rounded-xl overflow-hidden transition-colors duration-200 min-w-[85vw] md:min-w-0 md:flex-1 snap-center shrink-0 ${status === 'todo' ? 'bg-blue-50/40 border-blue-100/50' : status === 'in-progress' ? 'bg-amber-50/40 border-amber-100/50' : 'bg-emerald-50/40 border-emerald-100/50'}`}>
            <div className={`p-4 border-b flex justify-between items-center ${status === 'todo' ? 'bg-blue-100/50 border-blue-200/50 text-blue-900' : status === 'in-progress' ? 'bg-amber-100/50 border-amber-200/50 text-amber-900' : 'bg-emerald-100/50 border-emerald-200/50 text-emerald-900'}`}>
              <h3 className="font-semibold text-sm capitalize">{status.replace('-', ' ')}</h3>
              <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-0.5 rounded-md">{tasks.filter((t: any) => t.status === status).length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
              {tasks.filter((t: any) => t.status === status).map(renderKanbanCard)}
              {dragOverColumn === status && draggedTaskId && <div className="h-24 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5"></div>}
            </div>
          </div>
        ))}
      </div>

      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground rounded-xl shadow-lg max-w-md w-full border border-border p-6 space-y-4">
            <h3 className="font-semibold">Create New Task</h3>
            <button onClick={() => { addTask({ id: Date.now(), title: "New Task", due: "Today", status: "todo", tag: "Admin", priority: "medium" }); setIsNewTaskOpen(false); }} className="w-full bg-primary text-primary-foreground h-9 rounded-md">Save Task</button>
            <button onClick={() => setIsNewTaskOpen(false)} className="w-full border h-9 rounded-md">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
