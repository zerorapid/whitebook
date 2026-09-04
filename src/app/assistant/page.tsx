"use client";
import { Sparkles, Merge, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function AssistantPage() {
  const { duplicates, resolveDuplicate } = useStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl">
      <div className="space-y-1.5">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Assistant
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Smart contact management: deduplicate, enrich, and clean your network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Merge className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-1">Duplicate Management</h3>
          <p className="text-sm text-muted-foreground mb-4">We found {duplicates.length} overlapping contacts across your accounts.</p>
          
          <div className="space-y-3">
            {duplicates.map((dupe: any) => (
              <div key={dupe.id} className="p-4 rounded-xl border bg-muted/30 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{dupe.name} <span className="text-muted-foreground font-normal">matches</span> {dupe.match}</div>
                  <div className="text-xs text-primary font-medium mt-1">{dupe.confidence} Match Confidence</div>
                </div>
                <button onClick={() => resolveDuplicate(dupe.id)} className="px-3 py-1.5 bg-background border shadow-sm rounded-lg text-xs font-semibold hover:bg-muted transition-colors">
                  Merge
                </button>
              </div>
            ))}
            {duplicates.length === 0 && (
              <div className="text-sm text-emerald-600 flex items-center gap-2 font-medium p-4 bg-emerald-50 rounded-xl">
                <CheckCircle2 className="w-4 h-4" /> All contacts are deduplicated.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-1">Contact Enrichment</h3>
          <p className="text-sm text-muted-foreground mb-4">AI automatically searches public profiles to fill in missing job titles and photos.</p>
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <span className="font-semibold block mb-1">Auto-Enrichment is Active</span>
              Your contacts are automatically updated daily with the latest LinkedIn and public data.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
