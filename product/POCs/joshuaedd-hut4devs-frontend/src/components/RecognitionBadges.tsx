import React from 'react';
import { RecognitionBadge, Member } from '../types';
import { Award, CheckCircle2, ShieldCheck, HeartHandshake, BookOpen, AlertTriangle, Sparkles } from 'lucide-react';

interface RecognitionBadgesProps {
  badges: RecognitionBadge[];
  currentUser: Member;
}

export const RecognitionBadges: React.FC<RecognitionBadgesProps> = ({
  badges,
  currentUser,
}) => {
  const getBadgeIcon = (category: RecognitionBadge['category']) => {
    switch (category) {
      case 'commitments':
        return CheckCircle2;
      case 'communication':
        return HeartHandshake;
      case 'repair':
        return ShieldCheck;
      case 'vouching':
        return Award;
      case 'stewardship':
        return BookOpen;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dignity-Preserving Recognition</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Contextual Recognition Without Human Scoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            "We noticed what you repeatedly demonstrated here." We explicitly reject universal credit scores, popularity rankings, and wealth leaderboards.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Universal Score</span>
          <span className="text-sm font-bold text-rose-500 line-through">NO CREDIT SCORE</span>
          <span className="text-[10px] text-emerald-500 font-semibold block">Only Qualitative Proof</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="p-5 rounded-xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Strictly Forbidden in Hut4Devs</span>
          </div>
          <ul className="space-y-2 text-xs text-rose-950/80 dark:text-rose-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span><strong>Universal Trust Scores:</strong> No algorithm calculates who you are or rates human character.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span><strong>Wealth Leaderboards:</strong> No rankings based on transaction volumes or wallet size.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span><strong>Permanent Negative Labels:</strong> Difficulties can be communicated, renegotiated, and repaired.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>What We Truly Value & Preserve</span>
          </div>
          <ul className="space-y-2 text-xs text-emerald-950/80 dark:text-emerald-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Fulfilled Commitments:</strong> Transparent follow-through on shared chamber responsibilities.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Early Communication:</strong> Speaking up before due dates when stipend schedules fluctuate.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Demonstrated Repair:</strong> Honoring revisions and settling difficulties in good faith.</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Verified Activity Patterns for {currentUser.name}</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {badges.length} Demonstrated Patterns
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map((badge) => {
            const Icon = getBadgeIcon(badge.category);

            return (
              <div
                key={badge.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                    <Icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Earned {badge.earnedDate}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {badge.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Backed by {badge.verifiedTrailCount} Trail Events
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Category: {badge.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
