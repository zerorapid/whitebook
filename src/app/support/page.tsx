"use client";
import { Book, MessageCircle, Keyboard } from 'lucide-react';

export default function SupportPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Support & Resources</h1>
        <p className="text-muted-foreground mt-1">Get help and learn how to use CRM_OS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => alert("Opening Documentation portal...")}
          className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <Book className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg mb-2">Documentation</h3>
          <p className="text-sm text-muted-foreground">Read the official guides and tutorials to master the platform.</p>
        </div>
        <div 
          onClick={() => alert("Connecting to chat agent...")}
          className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <MessageCircle className="w-8 h-8 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg mb-2">Chat Support</h3>
          <p className="text-sm text-muted-foreground">Talk with our customer success team for direct assistance.</p>
        </div>
        <div 
          onClick={() => alert("Opening Keyboard Shortcuts guide...")}
          className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <Keyboard className="w-8 h-8 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg mb-2">Keyboard Shortcuts</h3>
          <p className="text-sm text-muted-foreground">Navigate faster with our comprehensive list of hotkeys.</p>
        </div>
      </div>
    </div>
  );
}
