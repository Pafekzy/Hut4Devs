import React from 'react';
import { CommunityRecognition } from '../domain/peerSupport';
import { Member } from '../domain/auth';
import { Award, ShieldAlert, Heart, Calendar, UserCheck, Sparkles } from 'lucide-react';

interface RecognitionViewProps {
  recognitions: CommunityRecognition[];
  availableMembers: Member[];
  currentMember: Member;
}

export const RecognitionView: React.FC<RecognitionViewProps> = ({
  recognitions,
  availableMembers,
  currentMember,
}) => {
  return (
    <div className="space-y-6">
      {/* Anti-Scoring Philosophy Banner */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="bg-[#FFF9EE] text-[#5A2D0C] border border-[#E7D6C1] text-xs font-semibold px-2.5 py-0.5 rounded-md">
            Human Dignity First
          </span>
          <span className="text-xs text-stone-500">No universal scores • No humiliation registries</span>
        </div>
        <h1 className="text-xl font-serif font-bold text-stone-900 mt-1.5">Recognition Without Human Scoring</h1>
        <p className="text-xs text-stone-600 mt-0.5 max-w-3xl leading-relaxed">
          Recognition should say: <strong className="text-stone-900">"We noticed what you repeatedly demonstrated here."</strong>{' '}
          It should never pretend to say: <strong className="text-stone-900">"We have calculated who you are."</strong>{' '}
          Hut4Devs explicitly bans universal credit scores, popularity leaderboards, wealth rankings,
          and permanent negative scarlet letters.
        </p>

        {/* Anti-Credit Bureau Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-5 border-t border-stone-100 text-xs">
          <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-xl">
            <div className="font-semibold text-rose-900 flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              What Hut4Devs Will Never Build
            </div>
            <ul className="space-y-1 text-rose-800/90 text-[11px] list-disc list-inside">
              <li>No 0–100 universal trust credit scores</li>
              <li>No public debt walls or shaming registries</li>
              <li>No popularity or wealth competition leaderboards</li>
              <li>No permanent labels: past mistakes are repairable</li>
            </ul>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
            <div className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1">
              <span className="text-sm" aria-hidden="true">🛖</span>
              What Hut4Devs Recognizes
            </div>
            <ul className="space-y-1 text-emerald-800/90 text-[11px] list-disc list-inside">
              <li>Honoured shared accommodation commitments</li>
              <li>Proactive, honest communication when stipend is late</li>
              <li>Generous peer support and Debt-to-Gift forgiveness</li>
              <li>Measured, responsible contextual vouching for peers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recognitions Grid */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs">
        <h2 className="text-base font-serif font-bold text-stone-900 mb-1">Demonstrated Community Recognitions</h2>
        <p className="text-xs text-stone-500 mb-5">
          Contextual statements derived from verifiable cooperative actions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recognitions.map((badge) => {
            const isCurrent = badge.memberId === currentMember.id;

            return (
              <div
                key={badge.id}
                id={`badge-card-${badge.id}`}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-50/30 shadow-xs'
                    : 'border-stone-200/90 bg-[#FFFDF9] hover:bg-stone-50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-center text-2xl shrink-0">
                    {badge.symbol}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif font-bold text-sm text-stone-900 truncate">{badge.title}</h3>
                      <span className="bg-stone-200/70 text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded capitalize">
                        {badge.category.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-stone-500 font-medium mt-0.5">
                      Earned by <strong className="text-stone-800">{badge.memberName}</strong>
                    </div>

                    <p className="text-stone-600 text-xs mt-2 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-stone-100">
                      "{badge.description}"
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                      <span className="italic text-stone-500 text-[10px]">{badge.principle}</span>
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <Calendar className="w-3 h-3" />
                        {badge.earnedAt}
                      </span>
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
