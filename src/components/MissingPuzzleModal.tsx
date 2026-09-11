import React, { useState, useEffect } from 'react';
import {
  Puzzle,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Clock,
  Layers,
  Send,
  UserCheck,
  MessageSquare,
  HelpCircle,
  Code2,
  Lightbulb,
} from 'lucide-react';
import { Member } from '../domain/auth';
import {
  puzzleFeedbackStore,
  MissingPuzzleReport,
  MissingPuzzleInvolvement,
} from '../services/puzzleFeedbackStore';

interface MissingPuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMember: Member;
  isDark?: boolean;
  defaultLocation?: string;
}

const CATEGORIES = [
  'Visual / UI Glitch',
  'Accommodation Flow',
  'Peer Support',
  'Performance / Speed',
  'Idea / Missing Feature',
  'Other',
];

const INVOLVEMENT_OPTIONS: {
  id: MissingPuzzleInvolvement;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'JUST_LOG',
    title: 'Just log it',
    description: 'Keep the trail recorded; I will watch progress in the changelog.',
    icon: CheckCircle2,
  },
  {
    id: 'CONTACT_ME',
    title: 'Contact me for clarification',
    description: 'Reach out to my room or contact info if reproduction details are needed.',
    icon: MessageSquare,
  },
  {
    id: 'HELP_TEST',
    title: 'I can help test the fix',
    description: 'Give me access to verify the staged patch in my accommodation setting.',
    icon: UserCheck,
  },
  {
    id: 'CONTRIBUTE_FIX',
    title: 'I want to contribute to fixing it',
    description: 'I would like to help build the code or UI adjustment directly.',
    icon: Code2,
  },
  {
    id: 'CONSULT_DESIGN',
    title: 'Consult me when designing the solution',
    description: 'Let me share ideas on human UX and community interaction expectations.',
    icon: Lightbulb,
  },
];

export const MissingPuzzleModal: React.FC<MissingPuzzleModalProps> = ({
  isOpen,
  onClose,
  currentMember,
  isDark = false,
  defaultLocation = 'Fellow Workspace',
}) => {
  const [activeView, setActiveView] = useState<'REPORT' | 'COMMUNITY_LEDGER'>('REPORT');
  const [isSlotted, setIsSlotted] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [locationContext, setLocationContext] = useState(defaultLocation);
  const [errorMsg, setErrorMsg] = useState('');

  // Post-submit state
  const [submittedReport, setSubmittedReport] = useState<MissingPuzzleReport | null>(null);
  const [selectedInvolvement, setSelectedInvolvement] = useState<MissingPuzzleInvolvement | null>(null);
  const [allReports, setAllReports] = useState<MissingPuzzleReport[]>([]);

  useEffect(() => {
    if (isOpen) {
      setAllReports(puzzleFeedbackStore.getReports());
      // Reset state if starting fresh
      if (!submittedReport) {
        setIsSlotted(false);
        setTitle('');
        setDescription('');
        setErrorMsg('');
      }
    }
  }, [isOpen, submittedReport]);

  if (!isOpen) return null;

  const handleSlotPiece = () => {
    setIsSlotted(true);
    setSelectedPieceId('piece-core');
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', 'h4d-puzzle-piece');
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleSlotPiece();
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please give this missing puzzle piece a concise title.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please describe what happened or what is missing.');
      return;
    }

    const report = puzzleFeedbackStore.saveReport({
      title: title.trim(),
      description: description.trim(),
      category,
      locationContext,
      loggedBy: {
        id: currentMember.id,
        displayName: currentMember.displayName,
        h4dMemberId: currentMember.h4dMemberId || 'H4D-FELLOW',
        email: currentMember.email,
      },
      puzzleCompleted: isSlotted,
    });

    setSubmittedReport(report);
    setAllReports(puzzleFeedbackStore.getReports());
  };

  const handleSelectInvolvement = (inv: MissingPuzzleInvolvement) => {
    if (!submittedReport) return;
    const updated = puzzleFeedbackStore.updateInvolvement(submittedReport.id, inv);
    if (updated) {
      setSubmittedReport({ ...updated });
      setSelectedInvolvement(inv);
      setAllReports(puzzleFeedbackStore.getReports());
    }
  };

  const handleResetForAnother = () => {
    setSubmittedReport(null);
    setSelectedInvolvement(null);
    setIsSlotted(false);
    setTitle('');
    setDescription('');
    setErrorMsg('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="missing-puzzle-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-2xl my-auto ${
          isDark
            ? 'bg-[#2F1707] text-[#FFF9EE] border-[#C88D3A]/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(200,141,58,0.2)]'
            : 'bg-[#FFFDF9] text-[#5A2D0C] border-[#5A2D0C]/30 shadow-[0_20px_50px_-15px_rgba(90,45,12,0.35),0_0_0_1px_rgba(200,141,58,0.25)]'
        }`}
      >
        {/* Top Header Bar */}
        <div
          className={`px-5 sm:px-6 py-4 border-b flex items-center justify-between ${
            isDark
              ? 'bg-[#231004] border-[#3E200C]'
              : 'bg-[#F7F1E7] border-[#EAE0D0]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5A2D0C] border border-[#C88D3A] flex items-center justify-center shadow-inner">
              <Puzzle className="w-5 h-5 text-[#C88D3A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="missing-puzzle-title" className="font-serif font-bold text-base sm:text-lg">
                  Fix a Missing Puzzle
                </h2>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border bg-[#C88D3A]/15 border-[#C88D3A]/40 text-[#B77620] dark:text-[#E2AB5D] font-semibold">
                  Community Feedback
                </span>
              </div>
              <p className="text-xs opacity-75">
                Every bug or gap is just a piece of our collective home waiting to be slotted.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl border border-transparent hover:border-[#C88D3A]/40 hover:bg-[#C88D3A]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 opacity-70 hover:opacity-100" />
          </button>
        </div>

        {/* View Toggle (Report vs Ledger) */}
        <div
          className={`px-6 pt-3 pb-2 border-b flex items-center justify-between gap-2 text-xs ${
            isDark ? 'bg-[#2B1406] border-[#3E200C]' : 'bg-[#FFF9EE] border-[#EAE0D0]'
          }`}
        >
          <div className="inline-flex p-1 rounded-xl bg-black/10 dark:bg-black/25 border border-[#C88D3A]/20">
            <button
              type="button"
              id="tab-report-puzzle"
              onClick={() => setActiveView('REPORT')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeView === 'REPORT'
                  ? 'bg-[#5A2D0C] text-[#FFF9EE] shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Slot a Piece &amp; Report
            </button>
            <button
              type="button"
              id="tab-community-ledger"
              onClick={() => setActiveView('COMMUNITY_LEDGER')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'COMMUNITY_LEDGER'
                  ? 'bg-[#5A2D0C] text-[#FFF9EE] shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <span>Community Puzzle Trail</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#C88D3A] text-[#2F1707] font-bold">
                {allReports.length}
              </span>
            </button>
          </div>

          <div className="text-[11px] opacity-70 hidden sm:block">
            Member: <span className="font-semibold">{currentMember.displayName}</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {activeView === 'COMMUNITY_LEDGER' ? (
            /* Community Puzzle Trail Ledger */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-sm">Community Missing Puzzles Log</h3>
                  <p className="text-xs opacity-70">
                    Live trail of issues, UI polish requests, and mutual repairs reported by fellows.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('REPORT')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#5A2D0C] text-[#FFF9EE] border-b-2 border-[#3E200C] hover:bg-[#723B12] transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Puzzle className="w-3.5 h-3.5 text-[#C88D3A]" />
                  <span>Report New Piece</span>
                </button>
              </div>

              {allReports.length === 0 ? (
                <div className="py-12 text-center text-xs opacity-60 border border-dashed rounded-2xl p-6">
                  No missing puzzles logged yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {allReports.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        isDark
                          ? 'bg-[#240E03] border-[#3E200C] hover:border-[#C88D3A]/40'
                          : 'bg-[#FFFDF9] border-[#EAE0D0] hover:border-[#C88D3A]/40 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#C88D3A]">
                            {item.id}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#5A2D0C]/10 dark:bg-[#FFF9EE]/10 border border-[#C88D3A]/30">
                            {item.category}
                          </span>
                          {item.locationContext && (
                            <span className="text-[11px] opacity-70">
                              &bull; {item.locationContext}
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                            item.status === 'SOLVED'
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                              : item.status === 'UNDER_REVIEW'
                              ? 'bg-blue-500/15 border-blue-500/40 text-blue-600 dark:text-blue-400'
                              : 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold">{item.title}</h4>
                      <p className="text-xs opacity-80 mt-1 leading-relaxed">{item.description}</p>

                      <div className="mt-3 pt-2.5 border-t border-[#C88D3A]/15 flex flex-wrap items-center justify-between gap-2 text-[11px] opacity-75">
                        <div>
                          Logged by: <span className="font-semibold">{item.loggedBy.displayName}</span> ({item.loggedBy.h4dMemberId})
                        </div>
                        <div className="flex items-center gap-2">
                          {item.involvement && (
                            <span className="text-[10px] bg-[#C88D3A]/20 px-2 py-0.5 rounded border border-[#C88D3A]/30 font-medium">
                              Involvement: {item.involvement.replace('_', ' ')}
                            </span>
                          )}
                          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : submittedReport ? (
            /* Post-Submission: Step 2 - How would you like to be involved? */
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#5A2D0C] border-2 border-[#C88D3A] flex items-center justify-center shadow-lg shadow-[#5A2D0C]/30 animate-bounce">
                <Sparkles className="w-7 h-7 text-[#C88D3A]" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl">
                  Puzzle Piece Logged! 🧩
                </h3>
                <p className="text-xs opacity-80 mt-1 max-w-md mx-auto">
                  Report <strong className="font-mono text-[#C88D3A]">{submittedReport.id}</strong> is permanently preserved in our trail of trust.
                </p>
              </div>

              {/* Involvement Question */}
              <div
                className={`p-5 rounded-2xl border-2 text-left space-y-3 ${
                  isDark ? 'bg-[#231004] border-[#3E200C]' : 'bg-[#FFF9EE] border-[#EAE0D0]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#C88D3A]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B77620] dark:text-[#E2AB5D]">
                    Next Step: How would you like to be involved?
                  </span>
                </div>
                <p className="text-xs opacity-75">
                  At Hut4Devs, everyday collaboration turns into trails of trust. Tell us how closely you wish to take part in this repair:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {INVOLVEMENT_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isChosen = (submittedReport.involvement || selectedInvolvement) === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        id={`involvement-opt-${opt.id.toLowerCase()}`}
                        onClick={() => handleSelectInvolvement(opt.id)}
                        className={`p-3 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer flex flex-col justify-between gap-2 shadow-xs hover:-translate-y-0.5 active:translate-y-0.5 ${
                          isChosen
                            ? 'border-[#C88D3A] ring-2 ring-[#C88D3A]/40 bg-[#FFF3DC] dark:bg-[#3E200C]'
                            : isDark
                            ? 'border-[#3E200C] bg-[#2A1305] hover:border-[#C88D3A]/40'
                            : 'border-[#EAE0D0] bg-[#FFFDF9] hover:border-[#C88D3A]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-[#C88D3A]" />
                            {opt.title}
                          </span>
                          {isChosen && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </div>
                        <p className="text-[11px] opacity-75 leading-tight">{opt.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  id="btn-view-ledger-after-submit"
                  onClick={() => setActiveView('COMMUNITY_LEDGER')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#C88D3A]/40 hover:bg-[#C88D3A]/10 transition-colors cursor-pointer"
                >
                  View Community Puzzle Trail
                </button>
                <button
                  type="button"
                  id="btn-report-another"
                  onClick={handleResetForAnother}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#C88D3A]/40 hover:bg-[#C88D3A]/10 transition-colors cursor-pointer"
                >
                  Slot Another Piece
                </button>
                <button
                  type="button"
                  id="btn-done-puzzle-modal"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#5A2D0C] text-[#FFF9EE] border-b-2 border-[#3E200C] hover:bg-[#723B12] transition-colors shadow-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Interactive Stage 1: The Puzzle Board & Form */
            <div className="space-y-6">
              {/* Interactive Drifting & Slotting Area */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                  isDark
                    ? 'bg-[#231004] border-[#3E200C]'
                    : 'bg-[#FFF9EE] border-[#EAE0D0]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#B77620] dark:text-[#E2AB5D] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C88D3A]" />
                      Interactive Puzzle Alignment
                    </span>
                    <h3 className="font-serif font-bold text-sm sm:text-base">
                      {isSlotted
                        ? 'Puzzle Piece Slotted into Place! ✨'
                        : 'Drag or click the missing piece to slot it in'}
                    </h3>
                  </div>

                  {!isSlotted && (
                    <button
                      type="button"
                      id="btn-click-to-slot"
                      onClick={handleSlotPiece}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#5A2D0C] text-[#FFF9EE] border-b-2 border-[#3E200C] hover:bg-[#723B12] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:translate-y-0.5"
                    >
                      <Puzzle className="w-3.5 h-3.5 text-[#C88D3A]" />
                      <span>Click to Slot Piece</span>
                    </button>
                  )}
                </div>

                {/* Puzzle Slot Stage */}
                <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-3">
                  {/* Empty or Slotted Slot */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleSlotPiece}
                    className={`w-40 h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer relative overflow-hidden ${
                      isSlotted
                        ? 'border-[#C88D3A] bg-[#C88D3A]/15 shadow-inner'
                        : isDragging
                        ? 'border-[#C88D3A] bg-[#C88D3A]/10 scale-105 ring-2 ring-[#C88D3A]/50'
                        : isDark
                        ? 'border-[#C88D3A]/40 bg-[#1D0A02] hover:border-[#C88D3A]'
                        : 'border-[#5A2D0C]/30 bg-white hover:border-[#5A2D0C]'
                    }`}
                  >
                    {isSlotted ? (
                      <div className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400 animate-in fade-in zoom-in duration-300">
                        <div className="w-10 h-10 rounded-xl bg-[#5A2D0C] border border-[#C88D3A] flex items-center justify-center shadow-md">
                          <CheckCircle2 className="w-6 h-6 text-[#C88D3A]" />
                        </div>
                        <span className="text-xs font-bold font-serif text-[#5A2D0C] dark:text-[#FFF9EE]">
                          Piece Locked In
                        </span>
                        <span className="text-[10px] opacity-75">Ready to record report</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-9 h-9 rounded-xl border border-dashed border-[#C88D3A]/60 flex items-center justify-center">
                          <Puzzle className="w-5 h-5 text-[#C88D3A]/70" />
                        </div>
                        <span className="text-xs font-semibold text-[#B77620] dark:text-[#E2AB5D]">
                          Empty Slot
                        </span>
                        <span className="text-[10px] opacity-70">
                          {isDragging ? 'Drop here to snap!' : 'Drop piece here'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Missing Puzzle Piece (Animated Drifting) */}
                  {!isSlotted ? (
                    <div className="flex flex-col items-center gap-2">
                      <div
                        draggable
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onClick={handleSlotPiece}
                        id="draggable-puzzle-piece"
                        title="Click or drag to slot into place"
                        className="w-28 h-24 rounded-2xl bg-[#5A2D0C] text-[#FFF9EE] border-2 border-[#C88D3A] flex flex-col items-center justify-center gap-1 shadow-lg shadow-[#5A2D0C]/30 hover:scale-105 active:scale-95 transition-all cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-[#C88D3A] animate-pulse"
                      >
                        <Puzzle className="w-6 h-6 text-[#C88D3A]" />
                        <span className="text-[11px] font-bold">Missing Piece</span>
                        <span className="text-[9px] opacity-75 text-[#C88D3A]">Drag or Click</span>
                      </div>
                      <span className="text-[10px] opacity-70 italic text-center max-w-[140px]">
                        Drifting gap found in community experience
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs opacity-75 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C88D3A]" />
                      <span>Great! Now describe the piece below.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* The Issue Report Form */}
              <form onSubmit={handleSubmitReport} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl border border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label htmlFor="puzzle-issue-title" className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#B77620] dark:text-[#E2AB5D]">
                    Issue Title *
                  </label>
                  <input
                    id="puzzle-issue-title"
                    type="text"
                    required
                    placeholder="e.g., Tooltip cut off on mobile receipt download"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                      isDark
                        ? 'bg-[#231004] border-[#3E200C] focus:border-[#C88D3A] focus:ring-1 focus:ring-[#C88D3A]'
                        : 'bg-white border-[#EAE0D0] focus:border-[#5A2D0C] focus:ring-1 focus:ring-[#5A2D0C]'
                    }`}
                  />
                </div>

                {/* Category & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="puzzle-issue-category" className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#B77620] dark:text-[#E2AB5D]">
                      Category *
                    </label>
                    <select
                      id="puzzle-issue-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs outline-none cursor-pointer ${
                        isDark
                          ? 'bg-[#231004] border-[#3E200C] text-[#FFF9EE] focus:border-[#C88D3A]'
                          : 'bg-white border-[#EAE0D0] text-[#5A2D0C] focus:border-[#5A2D0C]'
                      }`}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="puzzle-issue-location" className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#B77620] dark:text-[#E2AB5D]">
                      App Location / Context
                    </label>
                    <input
                      id="puzzle-issue-location"
                      type="text"
                      placeholder="e.g., Peer Support Hub, Chamber View"
                      value={locationContext}
                      onChange={(e) => setLocationContext(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                        isDark
                          ? 'bg-[#231004] border-[#3E200C] focus:border-[#C88D3A]'
                          : 'bg-white border-[#EAE0D0] focus:border-[#5A2D0C]'
                      }`}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="puzzle-issue-desc" className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#B77620] dark:text-[#E2AB5D]">
                    Description &amp; Observations *
                  </label>
                  <textarea
                    id="puzzle-issue-desc"
                    required
                    rows={3}
                    placeholder="Describe what you observed, expected behavior, or ideas to make this puzzle piece whole..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all resize-none ${
                      isDark
                        ? 'bg-[#231004] border-[#3E200C] focus:border-[#C88D3A] focus:ring-1 focus:ring-[#C88D3A]'
                        : 'bg-white border-[#EAE0D0] focus:border-[#5A2D0C] focus:ring-1 focus:ring-[#5A2D0C]'
                    }`}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] opacity-75">
                    Attributed to: <strong className="font-semibold">{currentMember.displayName}</strong> ({currentMember.h4dMemberId || 'H4D-FELLOW'})
                  </div>

                  <button
                    type="submit"
                    id="btn-submit-puzzle-report"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#5A2D0C] text-[#FFF9EE] border-b-2 border-[#3E200C] hover:bg-[#723B12] transition-all flex items-center gap-2 shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5"
                  >
                    <span>Log Missing Puzzle</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C88D3A]" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
