import React from 'react';
import { RecognitionBadge, Fellow } from '../types';
import { Award, ShieldAlert, Heart, Calendar, Sparkles, UserCheck } from 'lucide-react';

interface RecognitionViewProps {
  recognitions: RecognitionBadge[];
  fellows: Fellow[];
  currentFellowId: string;
}

export const RecognitionView: React.FC<RecognitionViewProps> = ({
  recognitions,
  fellows,
  currentFellowId,
}) => {
  const getFellow = (id: string) => fellows.find((f) => f.id === id) || fellows[0];

  return (
    <div className="space-y-6">
      {/* Anti-Scoring Philosophy Banner */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-md">
            Human Dignity First
          </span>
          <span className="text-xs text-stone-500">No universal scores • No humiliation walls</span>
        </div>
        <h1 className="text-xl font-bold text-stone-900 mt-1.5">Recognition Without Human Scoring</h1>
        <p className="text-xs text-stone-600 mt-0.5 max-w-3xl leading-relaxed">
          Recognition should say: <strong className="text-stone-900">"We noticed what you repeatedly demonstrated here."</strong>{' '}
          It should never pretend to say: <strong className="text-stone-900">"We have calculated who you are."</strong>{' '}
          Hut4Devs explicitly bans universal credit scores, popularity leaderboards, wealth rankings,
          and permanent negative scarlet letters.
        </p>

        {/* Anti-Slop / Anti-Credit Bureau Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-5 border-t border-stone-100 text-xs">
          <div className="p-3 bg-rose-50/60 border border-rose-200/70 rounded-lg">
            <div className="font-semibold text-rose-900 flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              What Hut4Devs Will Never Build
            </div>
            <ul className="space-y-1 text-rose-800/80 text-[11px] list-disc list-inside">
              <li>No 0–100 universal trust credit scores</li>
              <li>No public debt walls or shaming registries</li>
              <li>No popularity or wealth competition leaderboards</li>
              <li>No permanent labels: past mistakes are repairable</li>
            </ul>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-200/70 rounded-lg">
            <div className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              What Hut4Devs Recognizes
            </div>
            <ul className="space-y-1 text-emerald-800/80 text-[11px] list-disc list-inside">
              <li>Honoured shared accommodation commitments</li>
              <li>Proactive, honest communication when stipend is late</li>
              <li>Generous peer support and Debt-to-Gift forgiveness</li>
              <li>Measured, responsible contextual vouching for peers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recognitions Grid */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs">
        <h2 className="text-base font-bold text-stone-900 mb-1">Demonstrated Community Recognitions</h2>
        <p className="text-xs text-stone-500 mb-5">
          Contextual statements generated from verified trust trails
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recognitions.map((badge) => {
            const fellow = getFellow(badge.fellowId);
            const isCurrent = badge.fellowId === currentFellowId;

            return (
              <div
                key={badge.id}
                id={`badge-card-${badge.id}`}
                className={`p-5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-amber-400/80 bg-amber-50/30'
                    : 'border-stone-200/80 bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-center justify-center text-xl shrink-0">
                    {badge.symbol}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-stone-900 truncate">{badge.title}</h3>
                      <span className="bg-stone-200/70 text-stone-700 text-[10px] font-medium px-2 py-0.5 rounded capitalize">
                        {badge.category}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{badge.description}</p>

                    <div className="mt-4 pt-3 border-t border-stone-200/50 flex items-center justify-between text-[11px] text-stone-500">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={fellow.avatar}
                          alt={fellow.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="font-medium text-stone-800">{fellow.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-1.5 py-0.2 rounded">
                            You
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {badge.earnedAt}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
