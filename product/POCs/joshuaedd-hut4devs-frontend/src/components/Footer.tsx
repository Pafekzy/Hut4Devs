import React from 'react';
import { ShieldCheck, Sparkles, Terminal } from 'lucide-react';

interface FooterProps {
  onOpenColonyModal: () => void;
  onOpenStatementModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenColonyModal,
  onOpenStatementModal,
}) => {
  return (
    <footer className="mt-16 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xs py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-xs">
                🛖
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                Hut4Devs
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                [ Logo Space Reserved ]
              </span>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Turning everyday collaboration into trails of trust built by us and for us-all.
              Accommodation is where we begin — not where the vision ends.
            </p>

            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>Build.</span>
              <span>Pay.</span>
              <span>Support.</span>
              <span>Thrive. 🛖</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={onOpenColonyModal}
              className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>The Colony Metaphor</span>
            </button>

            <button
              onClick={onOpenStatementModal}
              className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verifiable Statements</span>
            </button>

            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>Apache 2.0 Open Source</span>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            Designed for Tech Fellows, Interns, Roommates & Builders.
          </p>
          <p className="italic">
            "People present narratives. The platform preserves facts."
          </p>
        </div>
      </div>
    </footer>
  );
};
