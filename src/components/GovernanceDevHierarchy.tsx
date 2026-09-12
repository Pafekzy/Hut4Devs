import React, { useState } from 'react';
import { MemberRole } from '../domain/auth';
import {
  INSTITUTIONS_SEED,
  CAMPUSES_SEED,
  ACCOMMODATION_SPACES_SEED,
  ROOM_CAPTAINS_SEED,
  COORDINATOR_ASSIGNMENTS_SEED,
  ADMINISTRATION_ASSIGNMENTS_SEED,
  Institution,
  Campus,
  AccommodationSpace,
  RoomCaptainAssignment,
  CoordinatorAssignment,
  AdministrationAssignment,
} from '../domain/governanceHierarchy';
import {
  Building2,
  MapPin,
  Shield,
  ShieldCheck,
  Users,
  Home,
  ArrowRight,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UserCheck,
  Scale,
  Sparkles,
} from 'lucide-react';

interface GovernanceDevHierarchyProps {
  isDark: boolean;
  isLoading: boolean;
  authenticating: boolean;
  onAuthenticate: (role: MemberRole) => Promise<void>;
}

type DrillLevel = 'INSTITUTIONS' | 'CAMPUSES' | 'CATEGORIES' | 'ROOM_CAPTAINS' | 'COORDINATOR' | 'ADMINISTRATION';

export const GovernanceDevHierarchy: React.FC<GovernanceDevHierarchyProps> = ({
  isDark,
  isLoading,
  authenticating,
  onAuthenticate,
}) => {
  // Navigation State
  const [drillLevel, setDrillLevel] = useState<DrillLevel>('INSTITUTIONS');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(
    INSTITUTIONS_SEED.find((i) => i.id === 'inst-learn2earn') || INSTITUTIONS_SEED[0]
  );
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [selectedRoomCaptain, setSelectedRoomCaptain] = useState<RoomCaptainAssignment | null>(null);
  const [selectedAdminRole, setSelectedAdminRole] = useState<AdministrationAssignment | null>(null);

  // Active preview feedback state
  const [previewNote, setPreviewNote] = useState<string | null>(null);

  // Handlers for Drill-down
  const handleSelectInstitution = (inst: Institution) => {
    setSelectedInstitution(inst);
    setSelectedCampus(null);
    setSelectedRoomCaptain(null);
    setSelectedAdminRole(null);
    setPreviewNote(null);
    setDrillLevel('CAMPUSES');
  };

  const handleSelectCampus = (campus: Campus) => {
    setSelectedCampus(campus);
    setSelectedRoomCaptain(null);
    setSelectedAdminRole(null);
    setPreviewNote(null);
    setDrillLevel('CATEGORIES');
  };

  const handleBack = () => {
    setPreviewNote(null);
    if (drillLevel === 'ROOM_CAPTAINS' || drillLevel === 'COORDINATOR' || drillLevel === 'ADMINISTRATION') {
      setDrillLevel('CATEGORIES');
    } else if (drillLevel === 'CATEGORIES') {
      setDrillLevel('CAMPUSES');
    } else if (drillLevel === 'CAMPUSES') {
      setDrillLevel('INSTITUTIONS');
    }
  };

  // Trigger Development Preview Authentication
  const handleLaunchPreview = async (
    role: MemberRole,
    contextSummary: string
  ) => {
    setPreviewNote(`Activating Development Preview: ${contextSummary}`);
    await onAuthenticate(role);
  };

  // Helper getters
  const campuses = selectedInstitution ? CAMPUSES_SEED[selectedInstitution.id] || [] : [];
  const roomCaptains = selectedCampus ? ROOM_CAPTAINS_SEED[selectedCampus.id] || [] : [];
  const coordinator = selectedCampus ? COORDINATOR_ASSIGNMENTS_SEED[selectedCampus.id] : null;
  const administration = selectedCampus ? ADMINISTRATION_ASSIGNMENTS_SEED[selectedCampus.id] || [] : [];

  return (
    <div
      className="rounded-2xl border p-4 sm:p-5 transition-all duration-200"
      style={{
        backgroundColor: isDark ? '#2A1305' : '#FFFDF8',
        borderColor: isDark ? '#4B2710' : '#E7D6C1',
      }}
    >
      {/* Dev Hierarchy Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#C88D3A]/25">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase"
              style={{
                backgroundColor: isDark ? '#5A2D0C' : '#F7F1E7',
                color: isDark ? '#FFF9EE' : '#5A2D0C',
                border: '1px solid #C88D3A40',
              }}
            >
              SCOPED GOVERNANCE MODEL
            </span>
            <span className="text-xs font-bold text-[#5A2D0C] dark:text-[#FFF9EE]">
              Development Tools &amp; Seed Fixtures
            </span>
          </div>
          <p className="text-[11px] text-[#5A2D0C]/75 dark:text-[#FFF9EE]/75 mt-0.5">
            Institution → Campus → Responsibility Category → Assigned Person / Room → Dev Preview
          </p>
        </div>

        {drillLevel !== 'INSTITUTIONS' && (
          <button
            type="button"
            onClick={handleBack}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-[#F7F1E7] dark:bg-[#1E0D03] border border-[#5A2D0C]/20 dark:border-[#C88D3A]/40 text-[#5A2D0C] dark:text-[#FFF9EE] hover:bg-[#EAE0D0] dark:hover:bg-[#321605] transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C88D3A]" />
            <span>Back</span>
          </button>
        )}
      </div>

      {/* Breadcrumbs Navigation */}
      <nav aria-label="Governance Hierarchy Breadcrumbs" className="mb-4 flex items-center flex-wrap gap-1.5 text-[11px] font-medium">
        <button
          type="button"
          onClick={() => {
            setDrillLevel('INSTITUTIONS');
            setSelectedCampus(null);
          }}
          className={`hover:underline cursor-pointer transition-colors ${
            drillLevel === 'INSTITUTIONS'
              ? 'font-bold text-[#5A2D0C] dark:text-[#FFF9EE]'
              : 'text-[#C88D3A] hover:text-[#B77620]'
          }`}
        >
          Institutions
        </button>

        {selectedInstitution && drillLevel !== 'INSTITUTIONS' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <button
              type="button"
              onClick={() => {
                setDrillLevel('CAMPUSES');
                setSelectedCampus(null);
              }}
              className={`hover:underline cursor-pointer transition-colors ${
                drillLevel === 'CAMPUSES'
                  ? 'font-bold text-[#5A2D0C] dark:text-[#FFF9EE]'
                  : 'text-[#C88D3A] hover:text-[#B77620]'
              }`}
            >
              {selectedInstitution.name}
            </button>
          </>
        )}

        {selectedCampus && (drillLevel === 'CATEGORIES' || drillLevel === 'ROOM_CAPTAINS' || drillLevel === 'COORDINATOR' || drillLevel === 'ADMINISTRATION') && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <button
              type="button"
              onClick={() => setDrillLevel('CATEGORIES')}
              className={`hover:underline cursor-pointer transition-colors ${
                drillLevel === 'CATEGORIES'
                  ? 'font-bold text-[#5A2D0C] dark:text-[#FFF9EE]'
                  : 'text-[#C88D3A] hover:text-[#B77620]'
              }`}
            >
              {selectedCampus.name}
            </button>
          </>
        )}

        {drillLevel === 'ROOM_CAPTAINS' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-bold text-[#5A2D0C] dark:text-[#FFF9EE]">
              Room Captains
            </span>
          </>
        )}

        {drillLevel === 'COORDINATOR' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-bold text-[#5A2D0C] dark:text-[#FFF9EE]">
              Fellow Accommodation Coordinator
            </span>
          </>
        )}

        {drillLevel === 'ADMINISTRATION' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-bold text-[#5A2D0C] dark:text-[#FFF9EE]">
              Accommodation Administration
            </span>
          </>
        )}
      </nav>

      {/* Notice Banner */}
      <div
        className="mb-4 p-3 rounded-xl border text-[11px] leading-relaxed transition-colors duration-200"
        style={{
          backgroundColor: isDark ? '#3A1E0B' : '#FBF7EE',
          borderColor: isDark ? '#5C3115' : '#E0D2BE',
          color: isDark ? '#E2AB5D' : '#7C4A1E',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-3.5 h-3.5 text-[#C88D3A] shrink-0" />
          <span className="font-bold">Principle: Capability is Not Authority</span>
        </div>
        <p>
          A Fellow is the base member identity. Administrative and captaincy capacities are strictly scoped to specific institutions, campuses, and rooms. Authority does not leak across campuses.
        </p>
      </div>

      {previewNote && (
        <div className="mb-4 p-2.5 rounded-lg bg-emerald-900/20 border border-emerald-700/50 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{previewNote}</span>
        </div>
      )}

      {/* ============================================================
       * LEVEL 1: INSTITUTIONS
       * ============================================================ */}
      {drillLevel === 'INSTITUTIONS' && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#5A2D0C] dark:text-[#FFF9EE] flex items-center justify-between">
            <span>Select Institution</span>
            <span className="text-[11px] font-normal opacity-75">4 Ecosystems Configured</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INSTITUTIONS_SEED.map((inst) => (
              <div
                key={inst.id}
                onClick={() => handleSelectInstitution(inst)}
                className="p-4 rounded-xl border border-[#C88D3A]/30 bg-white dark:bg-[#1E0D03] hover:border-[#5A2D0C] dark:hover:border-[#C88D3A] transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#5A2D0C] text-[#FFF9EE] flex items-center justify-center font-bold text-xs shadow-inner">
                        {inst.logoBadge}
                      </span>
                      <span className="font-bold text-sm text-[#5A2D0C] dark:text-[#FFF9EE]">
                        {inst.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F7F1E7] dark:bg-[#351A07] text-[#5A2D0C] dark:text-[#FFF9EE] border border-[#5A2D0C]/20">
                      {inst.campusesCount} {inst.campusesCount === 1 ? 'Campus' : 'Campuses'}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-[#C88D3A] mb-1">
                    {inst.tagline}
                  </p>
                  <p className="text-[11px] text-[#5A2D0C]/75 dark:text-[#FFF9EE]/75 leading-relaxed">
                    {inst.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#5A2D0C]/10 dark:border-[#C88D3A]/20 flex items-center justify-between text-xs font-bold text-[#5A2D0C] dark:text-[#FFF9EE]">
                  <span>Explore Campuses</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C88D3A]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
       * LEVEL 2: CAMPUSES
       * ============================================================ */}
      {drillLevel === 'CAMPUSES' && selectedInstitution && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#5A2D0C] dark:text-[#FFF9EE] flex items-center justify-between">
            <span>
              {selectedInstitution.name} — Campuses ({campuses.length})
            </span>
            <span className="text-[11px] font-normal opacity-75">Select Campus Scope</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {campuses.map((campus) => (
              <div
                key={campus.id}
                onClick={() => handleSelectCampus(campus)}
                className="p-3.5 rounded-xl border border-[#C88D3A]/30 bg-white dark:bg-[#1E0D03] hover:border-[#5A2D0C] dark:hover:border-[#C88D3A] transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C88D3A]" />
                      <span className="font-bold text-xs text-[#5A2D0C] dark:text-[#FFF9EE]">
                        {campus.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                      {campus.stateOrRegion}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#5A2D0C]/75 dark:text-[#FFF9EE]/75 line-clamp-2 mt-1 leading-relaxed">
                    {campus.description}
                  </p>

                  <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-[#F7F1E7] dark:bg-[#351A07] text-[#5A2D0C] dark:text-[#FFF9EE]">
                      {campus.accommodationSpacesCount} Spaces
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#F7F1E7] dark:bg-[#351A07] text-[#5A2D0C] dark:text-[#FFF9EE]">
                      {campus.activeCaptainsCount} Captains
                    </span>
                    {campus.coordinatorAssigned ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                        Coordinator ✓
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        Unassigned
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#5A2D0C]/10 dark:border-[#C88D3A]/20 flex items-center justify-between text-xs font-bold text-[#5A2D0C] dark:text-[#FFF9EE]">
                  <span>Open Responsibilities</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C88D3A]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
       * LEVEL 3: RESPONSIBILITY CATEGORIES (Lagos Yaba / Campus Scope)
       * Shows:
       * 1. ROOM CAPTAINS
       * 2. FELLOW ACCOMMODATION COORDINATOR
       * 3. ACCOMMODATION ADMINISTRATION
       * ============================================================ */}
      {drillLevel === 'CATEGORIES' && selectedCampus && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-[#5A2D0C] dark:text-[#FFF9EE] flex items-center justify-between">
            <span>
              {selectedInstitution?.name} • {selectedCampus.name} — Responsibility Categories
            </span>
            <span className="text-[11px] font-normal opacity-75">Scoped Authority</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Category 1: Room Captains */}
            <div
              onClick={() => setDrillLevel('ROOM_CAPTAINS')}
              className="p-4 rounded-xl border-2 border-[#C88D3A]/30 hover:border-[#5A2D0C] dark:hover:border-[#C88D3A] bg-white dark:bg-[#1E0D03] transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#5A2D0C] text-[#FFF9EE] flex items-center justify-center shadow-inner">
                    <Home className="w-4 h-4 text-[#C88D3A]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FBF0DD] dark:bg-[#4B2B11] text-[#8C5209] dark:text-[#E5AD5B] border border-[#C88D3A]/50">
                    {roomCaptains.length} Rooms
                  </span>
                </div>
                <h3 className="font-bold text-xs text-[#5A2D0C] dark:text-[#FFF9EE]">
                  1. Room Captains
                </h3>
                <p className="text-[11px] text-[#5A2D0C]/75 dark:text-[#FFF9EE]/75 mt-1 leading-relaxed">
                  Fellows with room-scoped delegated responsibility. Grouped by property and room assignment.
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-[#5A2D0C]/10 dark:border-[#C88D3A]/20 flex items-center justify-between text-xs font-bold text-[#5A2D0C] dark:text-[#FFF9EE]">
                <span>Inspect Room Assignments</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C88D3A]" />
              </div>
            </div>

            {/* Category 2: Fellow Accommodation Coordinator */}
            <div
              onClick={() => setDrillLevel('COORDINATOR')}
              className="p-4 rounded-xl border-2 border-[#C88D3A]/30 hover:border-[#5A2D0C] dark:hover:border-[#C88D3A] bg-white dark:bg-[#1E0D03] transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#5A2D0C] text-[#FFF9EE] flex items-center justify-center shadow-inner">
                    <Users className="w-4 h-4 text-[#C88D3A]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F4E3CB] dark:bg-[#522F13] text-[#6C3F06] dark:text-[#F3CA8A] border border-[#B77620]/50">
                    {coordinator ? 'Assigned' : 'Vacant'}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-[#5A2D0C] dark:text-[#FFF9EE]">
                  2. Fellow Accommodation Coordinator
                </h3>
                <p className="text-[11px] text-[#5A2D0C]/75 dark:text-[#FFF9EE]/75 mt-1 leading-relaxed">
                  Campus-wide coordinator responsible for onboarding, delegations, and fellow oversight.
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-[#5A2D0C]/10 dark:border-[#C88D3A]/20 flex items-center justify-between text-xs font-bold text-[#5A2D0C] dark:text-[#FFF9EE]">
                <span>Inspect Coordinator</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C88D3A]" />
              </div>
            </div>

            {/* Category 3: Accommodation Administration */}
            <div
              onClick={() => setDrillLevel('ADMINISTRATION')}
              className="p-4 rounded-xl border-2 border-[#C88D3A]/30 hover:border-[#5A2D0C] dark:hover:border-[#C88D3A] bg-white dark:bg-[#1E0D03] transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#5A2D0C] text-[#FFF9EE] flex items-center justify-center shadow-inner">
                    <ShieldCheck className="w-4 h-4 text-[#C88D3A]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5A2D0C] text-[#FFF9EE] border border-[#C88D3A]/60">
                    {administration.length} Roles
                  </span>
                </div>
                <h3 className="font-bold text-xs text-[#5A2D0C] dark:text-[#FFF9EE]">
                  3. Accommodation Administration
                </h3>
                <p className="text-[11px] text-[#5A2D0C]/75 dark:text-[#FFF9EE]/75 mt-1 leading-relaxed">
                  Financial Admin accountability &amp; Accommodation Welfare &amp; Mediation Officer.
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-[#5A2D0C]/10 dark:border-[#C88D3A]/20 flex items-center justify-between text-xs font-bold text-[#5A2D0C] dark:text-[#FFF9EE]">
                <span>Inspect Administration</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C88D3A]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
       * LEVEL 4A: ROOM CAPTAINS BREAKDOWN
       * ============================================================ */}
      {drillLevel === 'ROOM_CAPTAINS' && selectedCampus && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#5A2D0C] dark:text-[#FFF9EE] flex items-center justify-between">
            <span>
              Room Captain Assignments — {selectedCampus.name} ({roomCaptains.length})
            </span>
            <span className="text-[11px] font-mono opacity-75">Scope: Room-level only</span>
          </div>

          {roomCaptains.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-white dark:bg-[#1E0D03] border border-[#C88D3A]/30">
              <Home className="w-6 h-6 text-[#C88D3A] mx-auto mb-2 opacity-60" />
              <p className="text-xs font-semibold text-[#5A2D0C] dark:text-[#FFF9EE]">
                No Room Captains currently assigned for {selectedCampus.name}.
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                Room Captains are delegated per room by the Fellow Accommodation Coordinator.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roomCaptains.map((rc) => (
                <div
                  key={rc.id}
                  className="p-4 rounded-xl border border-[#C88D3A]/30 bg-white dark:bg-[#1E0D03] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-[#C88D3A]" />
                        <span className="font-bold text-xs text-[#5A2D0C] dark:text-[#FFF9EE]">
                          {rc.roomNumber} ({rc.accommodationSpaceName})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FBF0DD] dark:bg-[#4B2B11] text-[#8C5209] dark:text-[#E5AD5B] border border-[#C88D3A]/60">
                        ROOM CAPTAIN
                      </span>
                    </div>

                    <div className="mt-2 p-2 rounded-lg bg-[#F7F1E7] dark:bg-[#2A1305] border border-[#5A2D0C]/10 text-xs">
                      <div className="font-bold text-[#5A2D0C] dark:text-[#FFF9EE]">
                        {rc.memberName}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">
                        {rc.memberEmail}
                      </div>
                      <div className="text-[10px] text-[#C88D3A] font-mono mt-1">
                        Scope: {rc.accommodationSpaceName} • {rc.floor} • {rc.roomNumber}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        Delegated by: {rc.delegatedBy}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-2 border-t border-[#5A2D0C]/10 dark:border-[#C88D3A]/20">
                    <button
                      type="button"
                      id={`dev-preview-captain-${rc.id}`}
                      disabled={isLoading || authenticating}
                      onClick={() =>
                        handleLaunchPreview(
                          MemberRole.ROOM_CAPTAIN,
                          `${rc.memberName} (${rc.roomNumber} Captain Scope)`
                        )
                      }
                      className="w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#723B12] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#C88D3A]" />
                      <span>Development Preview: Room Captain ({rc.roomNumber})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
       * LEVEL 4B: FELLOW ACCOMMODATION COORDINATOR BREAKDOWN
       * ============================================================ */}
      {drillLevel === 'COORDINATOR' && selectedCampus && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#5A2D0C] dark:text-[#FFF9EE] flex items-center justify-between">
            <span>
              Fellow Accommodation Coordinator — {selectedCampus.name}
            </span>
            <span className="text-[11px] font-mono opacity-75">Scope: Campus-wide</span>
          </div>

          {coordinator ? (
            <div className="p-4 rounded-xl border border-[#C88D3A]/40 bg-white dark:bg-[#1E0D03] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#5A2D0C] text-[#FFF9EE] flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-[#C88D3A]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#5A2D0C] dark:text-[#FFF9EE]">
                      {coordinator.memberName}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {coordinator.memberEmail}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F4E3CB] dark:bg-[#522F13] text-[#6C3F06] dark:text-[#F3CA8A] border border-[#B77620]/60">
                  COORDINATOR
                </span>
              </div>

              <div className="mt-3 p-3 rounded-lg bg-[#F7F1E7] dark:bg-[#2A1305] border border-[#5A2D0C]/10 text-xs space-y-1">
                <div className="font-semibold text-[#5A2D0C] dark:text-[#FFF9EE]">
                  {coordinator.title} ({selectedCampus.name})
                </div>
                <p className="text-[11px] text-[#5A2D0C]/80 dark:text-[#FFF9EE]/80 leading-relaxed">
                  {coordinator.scopeDescription}
                </p>
                <div className="text-[10px] text-stone-500 pt-1 font-mono">
                  Invariant: Emmanuel Ukom is Coordinator for Lagos Yaba ONLY. Authority does not leak to other campuses.
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#5A2D0C]/10 dark:border-[#C88D3A]/20">
                <button
                  type="button"
                  id="dev-preview-coordinator-btn"
                  disabled={isLoading || authenticating}
                  onClick={() =>
                    handleLaunchPreview(
                      MemberRole.ACCOMMODATION_FELLOWS_COORDINATOR,
                      `${coordinator.memberName} (L2E Lagos Yaba Coordinator)`
                    )
                  }
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#723B12] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#C88D3A]" />
                  <span>Development Preview: Coordinator Workspace</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl bg-white dark:bg-[#1E0D03] border border-[#C88D3A]/30">
              <Users className="w-6 h-6 text-[#C88D3A] mx-auto mb-2 opacity-60" />
              <p className="text-xs font-semibold text-[#5A2D0C] dark:text-[#FFF9EE]">
                No Coordinator currently assigned for {selectedCampus.name}.
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                Emmanuel Ukom coordinates Lagos Yaba only. Independent coordinator assignments apply per campus.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
       * LEVEL 4C: ACCOMMODATION ADMINISTRATION BREAKDOWN
       * Contains:
       * 1. Financial Admin
       * 2. Accommodation Welfare & Mediation Officer
       * ============================================================ */}
      {drillLevel === 'ADMINISTRATION' && selectedCampus && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#5A2D0C] dark:text-[#FFF9EE] flex items-center justify-between">
            <span>
              Accommodation Administration — {selectedCampus.name} ({administration.length})
            </span>
            <span className="text-[11px] font-mono opacity-75">Scope: Administrative &amp; Welfare</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {administration.map((adm) => (
              <div
                key={adm.id}
                className="p-4 rounded-xl border border-[#C88D3A]/30 bg-white dark:bg-[#1E0D03] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#5A2D0C] text-[#FFF9EE] flex items-center justify-center">
                        {adm.responsibilityType === 'FINANCIAL_ADMIN' ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#C88D3A]" />
                        ) : (
                          <Scale className="w-3.5 h-3.5 text-[#C88D3A]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#5A2D0C] dark:text-[#FFF9EE]">
                          {adm.memberName}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {adm.memberEmail}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5A2D0C] text-[#FFF9EE] border border-[#C88D3A]/60">
                      {adm.responsibilityType === 'FINANCIAL_ADMIN' ? 'FINANCIAL' : 'WELFARE'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F1E7] dark:bg-[#2A1305] border border-[#5A2D0C]/10 text-xs space-y-1">
                    <div className="font-semibold text-[#5A2D0C] dark:text-[#FFF9EE]">
                      {adm.roleTitle}
                    </div>
                    <p className="text-[11px] text-[#5A2D0C]/80 dark:text-[#FFF9EE]/80 leading-relaxed">
                      {adm.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#5A2D0C]/10 dark:border-[#C88D3A]/20">
                  {adm.responsibilityType === 'FINANCIAL_ADMIN' ? (
                    <button
                      type="button"
                      id="dev-preview-admin-financial-btn"
                      disabled={isLoading || authenticating}
                      onClick={() =>
                        handleLaunchPreview(
                          MemberRole.ACCOMMODATION_ADMIN,
                          `${adm.memberName} (Financial Admin Command Center)`
                        )
                      }
                      className="w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#723B12] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#C88D3A]" />
                      <span>Development Preview: Financial Admin Command Center</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      id="dev-preview-admin-welfare-btn"
                      disabled={isLoading || authenticating}
                      onClick={() =>
                        handleLaunchPreview(
                          MemberRole.ACCOMMODATION_FELLOWS_COORDINATOR,
                          `${adm.memberName} (${adm.roleTitle})`
                        )
                      }
                      className="w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#723B12] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#C88D3A]" />
                      <span>Development Preview: Welfare &amp; Mediation View</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
