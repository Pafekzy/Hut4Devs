import React, { useState } from 'react';
import { CampusRoom, CandidateAssignment } from '../../domain/roomOperations';
import { roomOperationsStore } from '../../services/roomOperationsStore';
import {
  Sparkles,
  Check,
  X,
  ShieldCheck,
  AlertCircle,
  User,
  Building2,
  Bed,
} from 'lucide-react';

interface DelegateCandidateChoiceModalProps {
  room: CampusRoom;
  bedId: string;
  isDark?: boolean;
  coordinatorAttribution: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const DelegateCandidateChoiceModal: React.FC<DelegateCandidateChoiceModalProps> = ({
  room,
  bedId,
  isDark = false,
  coordinatorAttribution,
  onClose,
  onSuccess,
}) => {
  const bed = room.beds.find((b) => b.id === bedId);
  const candidates = roomOperationsStore
    .getCandidates()
    .filter((c) => c.status === 'PENDING_ASSIGNMENT' || c.status === 'DELEGATED_TO_CAPTAIN');

  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string>(
    'Please review candidate alignment with existing room study rhythms and verify in-person hub residency.'
  );
  const [error, setError] = useState<string | null>(null);

  const toggleCandidate = (id: string) => {
    if (selectedCandidateIds.includes(id)) {
      setSelectedCandidateIds(selectedCandidateIds.filter((cId) => cId !== id));
    } else {
      setSelectedCandidateIds([...selectedCandidateIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCandidateIds.length === 0) {
      setError('Please select at least 1 eligible candidate for the delegation pool.');
      return;
    }

    if (!room.captainMemberId) {
      setError(`Cannot delegate choice: No Room Captain assigned to ${room.roomNumber}.`);
      return;
    }

    try {
      roomOperationsStore.delegateCandidateChoice({
        roomId: room.id,
        bedId,
        candidateIds: selectedCandidateIds,
        instructions: instructions.trim(),
        coordinatorAttribution,
        captainMemberId: room.captainMemberId,
        captainName: room.captainName || 'Room Captain',
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delegate-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        className="w-full max-w-2xl rounded-2xl border-2 border-b-4 shadow-2xl p-6 sm:p-7 my-8 transition-all backdrop-blur-md"
        style={{
          backgroundColor: isDark ? 'rgba(23, 21, 19, 0.95)' : '#FFF0D6',
          borderColor: isDark ? 'rgba(200, 141, 58, 0.40)' : '#CF9F68',
        }}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b"
          style={{ borderColor: isDark ? 'rgba(200, 141, 58, 0.20)' : '#CF9F68' }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2
              id="delegate-modal-title"
              className="font-serif font-bold text-base sm:text-lg"
              style={{ color: isDark ? '#FFF9EE' : '#432006' }}
            >
              Delegate Candidate Choice &bull; {room.roomNumber}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg border border-transparent hover:border-[#CF9F68] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room & Bed Target Banner */}
        <div
          className="p-3.5 rounded-xl border-2 border-b-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
          style={{
            backgroundColor: isDark ? 'rgba(30, 27, 24, 0.50)' : '#FAE5C5',
            borderColor: isDark ? 'rgba(200, 141, 58, 0.30)' : '#CF9F68',
          }}
        >
          <div>
            <strong>Target:</strong> {room.propertyName} &bull; {room.roomNumber} ({bed?.bedLabel})
          </div>
          <div>
            <strong>Delegated to:</strong> {room.captainName || 'Room Captain'}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 text-red-800 text-xs mb-4 flex items-center gap-2 border border-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: isDark ? '#FFF9EE' : '#432006' }}
              >
                Select Candidate Pool ({selectedCandidateIds.length} Selected)
              </label>
              <span className="text-[10px] font-mono text-[#C46F18] dark:text-[#C88D3A]">
                13 Available Fixture Candidates
              </span>
            </div>

            <div
              className="max-h-60 overflow-y-auto rounded-xl border-2 border-b-3 p-3 space-y-2"
              style={{
                backgroundColor: isDark ? 'rgba(23, 21, 19, 0.70)' : '#FFF8EE',
                borderColor: isDark ? 'rgba(200, 141, 58, 0.25)' : '#DDB985',
              }}
            >
              {candidates.map((cand) => {
                const isSelected = selectedCandidateIds.includes(cand.id);

                return (
                  <div
                    key={cand.id}
                    onClick={() => toggleCandidate(cand.id)}
                    className={`p-3 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40'
                        : 'border-transparent hover:bg-[#FAE5C5] dark:hover:bg-[#2F1707]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected
                            ? 'bg-purple-600 border-purple-600 text-white'
                            : 'border-[#CF9F68] dark:border-[#623416]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div
                          className="font-bold text-xs"
                          style={{ color: isDark ? '#FFF9EE' : '#432006' }}
                        >
                          {cand.fullName}
                        </div>
                        <div className="text-[11px] text-[#C46F18] dark:text-[#C88D3A]">
                          {cand.track} &bull; Prefers {cand.preferredPropertyName}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-[#5A3013] dark:text-[#E5D3BA]/75">
                      {cand.admissionNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="delegation-instructions"
              className="block text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: isDark ? '#FFF9EE' : '#432006' }}
            >
              Coordinator Guidance for Captain
            </label>
            <textarea
              id="delegation-instructions"
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border-2 border-b-3"
              style={{
                backgroundColor: isDark ? 'rgba(23, 21, 19, 0.8)' : '#FFF8EE',
                borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                color: isDark ? '#FFF9EE' : '#432006',
              }}
            />
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t"
            style={{ borderColor: isDark ? 'rgba(200, 141, 58, 0.20)' : '#CF9F68' }}
          >
            <div
              className="text-[11px]"
              style={{ color: isDark ? '#D9C4AC' : '#5A3013' }}
            >
              Authority: Explicit room-scoped delegation
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium rounded-lg border-2 border-b-3"
                style={{
                  backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#FFF0D6',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                  color: isDark ? '#FFF9EE' : '#432006',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-submit-delegation"
                disabled={selectedCandidateIds.length === 0}
                className={`flex-1 sm:flex-none px-5 py-2 text-xs font-bold rounded-lg border-2 border-b-3 transition-all duration-150 cursor-pointer active:translate-y-[1px] disabled:opacity-50 ${
                  isDark
                    ? 'bg-[#C88D3A] text-[#241104] border-[#915B15]'
                    : 'bg-[#432006] text-[#FFF0D6] border-[#381B07]'
                }`}
              >
                Dispatch Delegation
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
