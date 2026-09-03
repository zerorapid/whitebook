"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalIcon, Clock, AlignLeft, Users } from 'lucide-react';
import { 
  format, addMonths, subMonths, startOfMonth, 
  endOfMonth, startOfWeek, endOfWeek, isSameMonth, 
  isSameDay, addDays
} from 'date-fns';
import { useStore } from '@/lib/store';

type Event = {
  id: number;
  title: string;
  date: Date;
  time: string;
};

export default function CalendarPage() {
  const { events, addEvent } = useStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // View/Edit existing event
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Create new event
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [newEventDate, setNewEventDate] = useState<Date>(new Date());
  
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const handleOpenNewEvent = (date?: Date) => {
    setNewEventDate(date || new Date());
    setIsNewEventOpen(true);
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        // Find events for this day
        const dayEvents = events.filter(e => isSameDay(e.date, cloneDay));

        days.push(
          <div
            className={`min-h-[120px] border-r border-b p-2 flex flex-col transition-colors hover:bg-muted/30 cursor-pointer relative group ${
              !isSameMonth(day, monthStart)
                ? "text-muted-foreground bg-muted/10"
                : isSameDay(day, new Date())
                ? "bg-blue-50/20"
                : "bg-card"
            }`}
            key={day.toString()}
            onClick={() => handleOpenNewEvent(cloneDay)}
          >
            <div className={`text-right text-sm mb-2 ${isSameDay(day, new Date()) ? 'font-bold text-blue-600 bg-blue-100 w-7 h-7 rounded-full flex items-center justify-center ml-auto' : 'font-medium mr-2'}`}>
              {formattedDate}
            </div>
            
            {/* Plus icon on hover for empty days */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="flex flex-col gap-1 overflow-hidden z-10 relative">
              {dayEvents.map(event => (
                <div 
                  key={event.id} 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                  }}
                  className="text-xs truncate bg-blue-100 text-blue-800 rounded px-2 py-1 border border-blue-200 cursor-pointer hover:bg-blue-200 hover:border-blue-300 transition-colors shadow-sm" 
                  title={event.title}
                >
                  <span className="font-semibold mr-1">{event.time}</span>
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="border-l border-t border-border rounded-lg overflow-hidden bg-background shadow-sm">{rows}</div>;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage your schedule and upcoming interactions.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 border border-input shadow-sm bg-background" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-4 border border-input shadow-sm bg-background" onClick={goToToday}>
            Today
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 border border-input shadow-sm bg-background" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleOpenNewEvent(new Date())}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 ml-2 gap-2"
          >
            <Plus className="h-4 w-4" /> New Event
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm mb-6 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <CalIcon className="w-5 h-5 text-muted-foreground" />
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <div className="grid grid-cols-7 text-center font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider text-xs">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        {renderCells()}
      </div>

      {/* New Event Modal */}
      {isNewEventOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity">
          <div className="bg-card text-card-foreground rounded-xl shadow-lg max-w-md w-full border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-lg">Create New Event</h3>
              <button 
                onClick={() => setIsNewEventOpen(false)}
                className="w-8 h-8 shrink-0 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Title</label>
                <input 
                  autoFocus
                  placeholder="e.g. Lunch with investors"
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input 
                    type="date"
                    defaultValue={format(newEventDate, 'yyyy-MM-dd')}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <input 
                    type="time"
                    defaultValue="12:00"
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Participants</label>
                <input 
                  placeholder="Add guests..."
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <textarea 
                  placeholder="Meeting agenda or notes..."
                  className="w-full p-3 min-h-[80px] rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" 
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-2">
              <button 
                onClick={() => setIsNewEventOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => { addEvent({ id: Date.now(), title: "New Meeting", date: newEventDate, time: "12:00 PM" }); setIsNewEventOpen(false); }}
                className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing View/Edit Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity">
          <div 
            className="bg-card text-card-foreground rounded-xl shadow-lg max-w-md w-full border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-6 border-b border-border bg-muted/30">
              <div className="w-full pr-4">
                {isEditing ? (
                  <input 
                    defaultValue={selectedEvent.title} 
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                  />
                ) : (
                  <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                )}
                
                <div className="flex items-center text-sm text-muted-foreground mt-2 gap-4">
                  <div className="flex items-center gap-1.5">
                    <CalIcon className="w-4 h-4" />
                    {format(selectedEvent.date, 'EEEE, MMMM do')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {isEditing ? (
                      <input 
                        defaultValue={selectedEvent.time} 
                        className="h-7 px-2 w-24 rounded border border-input bg-background text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                      />
                    ) : (
                      selectedEvent.time
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedEvent(null); setIsEditing(false); }}
                className="w-8 h-8 shrink-0 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-3 text-sm">
                <Users className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="w-full">
                  <div className="font-medium mb-1">Participants</div>
                  {isEditing ? (
                    <input 
                      defaultValue="You, Sarah Chen" 
                      className="w-full h-9 px-3 mt-1 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                    />
                  ) : (
                    <p className="text-muted-foreground">You and linked contacts</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <AlignLeft className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="w-full">
                  <div className="font-medium mb-1">Description</div>
                  {isEditing ? (
                    <textarea 
                      defaultValue="Discussing recent updates, aligning on goals, and exploring opportunities for the next quarter."
                      className="w-full p-3 mt-1 min-h-[100px] rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" 
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">Discussing recent updates, aligning on goals, and exploring opportunities for the next quarter.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-2">
              <button 
                onClick={() => { setSelectedEvent(null); setIsEditing(false); }}
                className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Cancel
              </button>
              {isEditing ? (
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Edit Event
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
