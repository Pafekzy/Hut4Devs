import React from 'react';
import { Member } from '../domain/auth';
import { ActiveMode, getAvailableModesForMember, ScopedRoleAssignment, formatActionAttribution } from '../domain/membership';
import { ShieldCheck, User, Users, Home, Briefcase, ChevronDown } from 'lucide-react';

interface ModeSwitcherProps {
  member: Member;
  scopedRoles?: ScopedRoleAssignment[];
  currentMode: ActiveMode;
  onModeChange: (mode: ActiveMode) => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  member,
  scopedRoles = [],
  currentMode,
  onModeChange,
}) => {
  const availableModes = getAvailableModesForMember(member, scopedRoles);

  // If only 1 mode is available (e.g. Normal Fellow or Financial Admin), do not show a switcher dropdown
  if (availableModes.length <= 1) {
    return null;
  }

  const attribution = formatActionAttribution(member, currentMode);

  const getModeLabel = (mode: ActiveMode) => {
    switch (mode) {
      case 'FELLOW':
        return 'Fellow Workspace';
      case 'ROOM_CAPTAIN':
        return 'Room Captain Mode';
      case 'COORDINATOR':
        return 'Coordinator Workspace';
      case 'CAPTAIN_COVERAGE':
        return 'Room Captain Coverage';
      case 'FINANCIAL_COVERAGE':
        return 'Financial Admin Coverage';
      case 'FINANCIAL_ADMIN':
        return 'Financial Admin Workspace';
      default:
        return mode;
    }
  };

  const getModeIcon = (mode: ActiveMode) => {
    switch (mode) {
      case 'FELLOW':
        return <User className="w-4 h-4" />;
      case 'ROOM_CAPTAIN':
      case 'CAPTAIN_COVERAGE':
        return <Home className="w-4 h-4" />;
      case 'COORDINATOR':
        return <Users className="w-4 h-4" />;
      case 'FINANCIAL_COVERAGE':
      case 'FINANCIAL_ADMIN':
        return <ShieldCheck className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-[#5A2D0C]/5 border border-[#C88D3A]/25 rounded-xl px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#5A2D0C]/70">
          Acting Capacity:
        </span>
        <span
          id="active-acting-capacity-badge"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
            attribution.isCoverage
              ? 'bg-[#C88D3A]/20 text-[#5A2D0C] border border-[#C88D3A]/40'
              : 'bg-[#5A2D0C] text-[#FFF9EE]'
          }`}
        >
          {getModeIcon(currentMode)}
          <span>{attribution.actingCapacity}</span>
        </span>
      </div>

      <div className="relative inline-flex items-center">
        <label htmlFor="mode-switcher-select" className="sr-only">
          Switch Operational Mode
        </label>
        <select
          id="mode-switcher-select"
          value={currentMode}
          onChange={(e) => onModeChange(e.target.value as ActiveMode)}
          className="appearance-none bg-white border border-[#5A2D0C]/20 text-[#5A2D0C] text-xs font-medium rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#C88D3A] cursor-pointer shadow-xs"
        >
          {availableModes.map((mode) => (
            <option key={mode} value={mode}>
              Switch to: {getModeLabel(mode)}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#5A2D0C]/60 absolute right-2.5 pointer-events-none" />
      </div>
    </div>
  );
};
