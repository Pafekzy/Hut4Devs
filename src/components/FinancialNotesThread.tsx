import React, { useState, useEffect } from 'react';
import { Member } from '../domain/auth';
import { ActiveMode, ResponsibilityMessage, formatActionAttribution } from '../domain/membership';
import { membershipStore } from '../services/membershipStore';
import { MessageSquare, Send, ShieldCheck, User, Clock } from 'lucide-react';

interface FinancialNotesThreadProps {
  responsibilityId: string;
  currentMember: Member;
  activeMode: ActiveMode;
  isDark?: boolean;
}

export const FinancialNotesThread: React.FC<FinancialNotesThreadProps> = ({
  responsibilityId,
  currentMember,
  activeMode,
  isDark = false,
}) => {
  const [, setTick] = useState(0);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    return membershipStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const messages: ResponsibilityMessage[] = membershipStore.getMessagesForResponsibility(responsibilityId);
  const attribution = formatActionAttribution(currentMember, activeMode);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    membershipStore.addMessage({
      responsibilityId,
      fellowId: currentMember.id,
      sender: currentMember,
      activeMode,
      content: newNote.trim(),
    });

    setNewNote('');
  };

  return (
    <div
      id={`notes-thread-${responsibilityId}`}
      className={`rounded-xl border p-4 sm:p-5 transition-colors duration-200 ${
        isDark ? 'bg-[#2A221C] border-[#623416]' : 'bg-[#FAE5C5] border-[#CF9F68]'
      }`}
    >
      <div className="flex items-center justify-between border-b pb-3 mb-4 border-[#CF9F68]/30">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#C46F18]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#432006] dark:text-[#FFF9EE]">
            Accommodation Financial Notes &amp; Clarifications
          </h3>
        </div>
        <span className="text-[10px] text-[#72451F] dark:text-[#D9C4AC] font-mono">
          Contextual to this Month's Responsibility
        </span>
      </div>

      {/* Messages List */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#72451F] dark:text-[#D9C4AC] italic">
            No notes on this accommodation responsibility yet.
          </div>
        ) : (
          messages.map((msg: ResponsibilityMessage) => {
            const isSelf = msg.senderId === currentMember.id;
            const isStaff = Boolean(
              msg.actingCapacity?.includes('Coordinator') || msg.actingCapacity?.includes('Admin')
            );

            return (
              <div
                key={msg.id}
                className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  isDark
                    ? isStaff
                      ? 'bg-[#362B22] border-[#623416]'
                      : 'bg-[#231C16] border-[#4A3222]'
                    : isStaff
                    ? 'bg-[#FFF0D6] border-[#CF9F68]'
                    : 'bg-[#FFF8EE] border-[#DDB985]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#432006] dark:text-[#FFF9EE]">
                    {isStaff ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C46F18] dark:text-[#E5A955]" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-[#72451F] dark:text-[#D9C4AC]" />
                    )}
                    <span>{msg.senderName}</span>
                    {isSelf && (
                      <span className="text-[10px] text-[#9F520B] dark:text-[#E5A955] font-normal">(You)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#72451F] dark:text-[#D9C4AC]">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-[#9F520B] dark:text-[#E5A955] mb-1">
                  Capacity: {msg.actingCapacity}
                </div>

                <p className="text-xs text-[#5A3013] dark:text-[#EAD6C0] mt-1 whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Note Composition Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={`Add a note as ${attribution.actingCapacity}...`}
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#CF9F68] dark:border-[#623416] bg-[#FFF0D6] dark:bg-[#1E1712] text-[#432006] dark:text-[#FFF9EE] placeholder-[#72451F]/60 dark:placeholder-[#D9C4AC]/50 focus:outline-none focus:ring-1 focus:ring-[#C46F18]"
        />
        <button
          type="submit"
          disabled={!newNote.trim()}
          className="px-3 py-2 bg-[#432006] hover:bg-[#5A3013] dark:bg-[#C46F18] dark:hover:bg-[#A55708] text-[#FFF0D6] disabled:opacity-40 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Send Note</span>
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
