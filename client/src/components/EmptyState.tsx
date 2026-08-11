import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction
}) => (
  <div className="glass-panel rounded-3xl p-10 text-center border border-slate-800 space-y-3 max-w-lg mx-auto">
    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
      <SearchX className="w-6 h-6" />
    </div>
    <h3 className="text-base font-bold text-slate-200">{title}</h3>
    {description && <p className="text-xs text-slate-400 max-w-sm mx-auto">{description}</p>}
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="mt-3 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition active:scale-95"
      >
        {actionLabel}
      </button>
    )}
  </div>
);
