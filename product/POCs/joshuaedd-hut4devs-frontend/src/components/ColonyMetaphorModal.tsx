import React from 'react';
import { Users, Home, History, Wrench, Shield, X, Sparkles } from 'lucide-react';

interface ColonyMetaphorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColonyMetaphorModal: React.FC<ColonyMetaphorModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const metaphors = [
    {
      term: 'The Hut / Mound',
      meaning: 'Shared infrastructure and digital commons.',
      icon: Home,
      color: 'text-emerald-500',
    },
    {
      term: 'The Colony',
      meaning: 'Tech fellows, interns, and peers participating in the ecosystem.',
      icon: Users,
      color: 'text-indigo-500',
    },
    {
      term: 'Chambers',
      meaning: 'Contextual accommodation units (rooms, flats, co-living suites).',
      icon: Sparkles,
      color: 'text-amber-500',
    },
    {
      term: 'Trails',
      meaning: 'Trusted, unrewritten records of verifiable actions and repairs.',
      icon: History,
      color: 'text-teal-500',
    },
    {
      term: 'Builders',
      meaning: 'Contributors coding, designing, researching, and improving.',
      icon: Wrench,
      color: 'text-purple-500',
    },
    {
      term: 'Maintainers',
      meaning: 'Contributors protecting security, principles, and community integrity.',
      icon: Shield,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛖</span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                The Colony Metaphor & Manifesto
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Strong structures emerge when many small contributions coordinate around a shared purpose.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 text-white border border-emerald-500/30 space-y-1.5 shadow-md">
          <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
            The Core Belief
          </div>
          <p className="text-sm font-semibold italic text-emerald-100">
            "I don't have to stand alone when I am part of a colony."
          </p>
          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            "No member owns another person's money, time, labour, privacy, or loyalty. Support should build trust, not control. A person who receives support today may support someone tomorrow."
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {metaphors.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.term}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-tight">
                  {item.meaning}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="font-mono text-slate-500 dark:text-slate-400">
            Build. Pay. Support. Thrive. 🛖
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
          >
            Enter The Colony
          </button>
        </div>
      </div>
    </div>
  );
};
