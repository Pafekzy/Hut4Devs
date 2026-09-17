import React, { useState } from 'react';
import { ACCOMMODATION_PROPERTIES } from '../domain/membership';
import { membershipStore } from '../services/membershipStore';
import { X, CheckCircle, ArrowRight, ArrowLeft, Building2, User } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (requestId: string) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [githubHandle, setGithubHandle] = useState('');
  const [programCommunity, setProgramCommunity] = useState('L2E (Learn to Earn) Dev Cohort');
  const [selectedPropertyId, setSelectedPropertyId] = useState(ACCOMMODATION_PROPERTIES[0].id);
  const [floorName, setFloorName] = useState('Floor 3');
  const [roomName, setRoomName] = useState('');

  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedProperty = ACCOMMODATION_PROPERTIES.find((p) => p.id === selectedPropertyId)!;

  // Check if existing fellow matches email
  const existingMember = membershipStore.getMembers().find(
    (m) => m.email?.toLowerCase() === email.trim().toLowerCase()
  );
  const existingAssignment = existingMember
    ? membershipStore.getActiveAssignmentForMember(existingMember.id)
    : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !roomName.trim()) {
      setError('Please provide your full name, email, and assigned room number.');
      return;
    }

    try {
      const req = membershipStore.submitMembershipRequest({
        fullName,
        email,
        phone,
        githubHandle,
        programCommunity,
        propertyId: selectedPropertyId,
        floorName,
        roomName,
      });

      setSubmittedRequestId(req.id);
      setStep(4);
      if (onSuccess) onSuccess(req.id);
    } catch (err: any) {
      setError(err.message || 'Failed to submit membership request.');
    }
  };

  const handleReset = () => {
    setStep(1);
    setFullName('');
    setEmail('');
    setPhone('');
    setGithubHandle('');
    setRoomName('');
    setSubmittedRequestId(null);
    setError(null);
    onClose();
  };

  return (
    <div
      id="registration-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#180A02]/60 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div className="bg-[#FFF0D6] border border-[#CF9F68] rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden text-[#432006]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDB985] bg-[#FAE5C5]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9F520B]">
              Hut4Devs Residency Onboarding
            </span>
            <h2 className="font-serif text-xl font-bold text-[#432006]">
              {step === 4 ? 'Request Submitted' : 'Submit Accommodation Membership Request'}
            </h2>
          </div>
          <button
            id="close-registration-modal-btn"
            onClick={handleReset}
            className="p-1.5 rounded-lg text-[#72451F] hover:text-[#432006] hover:bg-[#E8BF88] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator (Steps 1-3) */}
        {step < 4 && (
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center justify-between text-xs font-medium text-[#72451F] mb-2">
              <span className={step === 1 ? 'font-bold text-[#432006]' : ''}>1. Identity Details</span>
              <span>→</span>
              <span className={step === 2 ? 'font-bold text-[#432006]' : ''}>2. Program & Property</span>
              <span>→</span>
              <span className={step === 3 ? 'font-bold text-[#432006]' : ''}>3. Room & Review</span>
            </div>
            <div className="w-full bg-[#432006]/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C46F18] h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3 bg-[#FAE5C5] rounded-xl border border-[#CF9F68]/40 text-xs text-[#5A3013]">
                <span className="font-semibold text-[#432006]">Core Principle: </span>
                Registration establishes your <strong>Identity</strong> and accommodation application.
                Roles and responsibilities are delegated authoritatively after membership verification.
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3013] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-input-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ada Okafor"
                  className="w-full px-3 py-2 text-sm bg-[#FFF0D6] border border-[#CF9F68] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C46F18] text-[#432006]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3013] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ada.okafor@example.com"
                  className="w-full px-3 py-2 text-sm bg-[#FFF0D6] border border-[#CF9F68] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C46F18] text-[#432006]"
                />
              </div>

              {existingMember && (
                <div
                  id="existing-fellow-detected-notice"
                  className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900"
                >
                  <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                    <span className="text-xs" aria-hidden="true">🛖</span>
                    Existing Hut4Devs Fellow Recognized: {existingMember.displayName} ({existingMember.h4dMemberId})
                  </div>
                  <p className="mt-1 text-amber-800">
                    Previous Accommodation:{' '}
                    <strong>
                      {existingAssignment?.propertyName} ({existingAssignment?.roomName})
                    </strong>
                    . Submitting will register an accommodation transfer request without duplicating your member identity.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A3013] mb-1">Phone / WhatsApp</label>
                  <input
                    id="reg-input-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3 py-2 text-sm bg-[#FFF0D6] border border-[#CF9F68] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C46F18] text-[#432006]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A3013] mb-1">GitHub Handle</label>
                  <input
                    id="reg-input-github"
                    type="text"
                    value={githubHandle}
                    onChange={(e) => setGithubHandle(e.target.value)}
                    placeholder="e.g. adadev"
                    className="w-full px-3 py-2 text-sm bg-[#FFF0D6] border border-[#CF9F68] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C46F18] text-[#432006]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  id="reg-step1-next-btn"
                  type="button"
                  onClick={() => {
                    if (!fullName.trim() || !email.trim()) {
                      setError('Please enter your full name and email.');
                      return;
                    }
                    setError(null);
                    setStep(2);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#432006] text-[#FFF0D6] rounded-lg text-sm font-medium hover:bg-[#341905] transition-colors"
                >
                  Next: Program & Property <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Program & Property Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A3013] mb-1">
                  Program or Sponsoring Community
                </label>
                <select
                  id="reg-select-program"
                  value={programCommunity}
                  onChange={(e) => setProgramCommunity(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FFF0D6] border border-[#CF9F68] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C46F18] text-[#432006]"
                >
                  <option value="L2E (Learn to Earn) Dev Cohort">L2E (Learn to Earn) Dev Cohort</option>
                  <option value="Hut4Devs Residency Interns 2026">Hut4Devs Residency Interns 2026</option>
                  <option value="Web3 & Distributed Systems Fellows">Web3 & Distributed Systems Fellows</option>
                  <option value="Independent Developer Fellow">Independent Developer Fellow</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3013] mb-2">
                  Select Accredited Accommodation Property
                </label>
                <div className="space-y-2">
                  {ACCOMMODATION_PROPERTIES.map((prop) => (
                    <label
                      key={prop.id}
                      className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedPropertyId === prop.id
                          ? 'bg-[#FAE5C5] border-[#C46F18] ring-1 ring-[#C46F18]'
                          : 'bg-[#FFF0D6] border-[#CF9F68]/60 hover:border-[#C46F18]/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="property-selection"
                          value={prop.id}
                          checked={selectedPropertyId === prop.id}
                          onChange={() => setSelectedPropertyId(prop.id)}
                          className="mt-1 text-[#C46F18] focus:ring-[#C46F18]"
                        />
                        <div>
                          <div className="text-sm font-bold text-[#432006]">{prop.name}</div>
                          <div className="text-xs text-[#72451F]">{prop.description}</div>
                          <div className="text-[11px] text-[#72451F]/70 mt-0.5">{prop.location}</div>
                        </div>
                      </div>
                      <div className="text-right whitespace-nowrap pl-2">
                        <span className="text-sm font-extrabold text-[#9F520B]">
                          ₦{prop.monthlyCommitment.toLocaleString()}
                        </span>
                        <div className="text-[10px] uppercase font-semibold text-[#72451F]">monthly</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#72451F] hover:bg-[#E8BF88] rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  id="reg-step2-next-btn"
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#432006] text-[#FFF0D6] rounded-lg text-sm font-medium hover:bg-[#341905] transition-colors"
                >
                  Next: Room & Review <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Room & Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A3013] mb-1">
                    Floor Name / Level
                  </label>
                  <select
                    id="reg-select-floor"
                    value={floorName}
                    onChange={(e) => setFloorName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#FFF0D6] border border-[#CF9F68] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C46F18] text-[#432006]"
                  >
                    <option value="Floor 1">Floor 1</option>
                    <option value="Floor 2">Floor 2</option>
                    <option value="Floor 3">Floor 3</option>
                    <option value="Floor 4">Floor 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A3013] mb-1">
                    Assigned Room Number / Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-input-room"
                    type="text"
                    required
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g. Room 304"
                    className="w-full px-3 py-2 text-sm bg-[#FFF0D6] border border-[#CF9F68] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C46F18] text-[#432006]"
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-4 bg-[#FAE5C5] border border-[#CF9F68] rounded-xl space-y-2 text-xs">
                <div className="font-bold text-[#432006] text-sm border-b border-[#DDB985] pb-1">
                  Membership Request Summary
                </div>
                <div className="flex justify-between">
                  <span className="text-[#72451F]">Candidate:</span>
                  <span className="font-semibold text-[#432006]">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#72451F]">Email:</span>
                  <span className="font-semibold text-[#432006]">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#72451F]">Program:</span>
                  <span className="font-semibold text-[#432006]">{programCommunity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#72451F]">Property:</span>
                  <span className="font-semibold text-[#432006]">{selectedProperty.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#72451F]">Room:</span>
                  <span className="font-semibold text-[#432006]">{roomName || 'Pending'} ({floorName})</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#DDB985]">
                  <span className="text-[#72451F]">Monthly Commitment:</span>
                  <span className="font-bold text-[#9F520B]">
                    ₦{selectedProperty.monthlyCommitment.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#72451F] hover:bg-[#E8BF88] rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  id="reg-submit-btn"
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C46F18] text-white rounded-lg text-sm font-semibold hover:bg-[#9F520B] shadow-xs transition-colors"
                >
                  Submit Membership Request
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Awaiting Verification */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#432006]">
                Membership Request Submitted Successfully
              </h3>
              <p className="text-xs text-[#5A3013] max-w-md mx-auto leading-relaxed">
                Your request has been routed to the <strong>L2E Accommodation Fellows Coordinator</strong> for
                verification. A Room Captain may be delegated to confirm your room occupancy.
              </p>
              <div className="p-3 bg-[#FAE5C5] rounded-xl text-xs font-mono text-[#432006] max-w-sm mx-auto border border-[#CF9F68]">
                Reference ID: <strong>{submittedRequestId}</strong>
              </div>
              <div className="pt-2">
                <button
                  id="reg-close-done-btn"
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2 bg-[#432006] text-[#FFF0D6] rounded-lg text-sm font-medium hover:bg-[#341905] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
