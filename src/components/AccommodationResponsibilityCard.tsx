import React from 'react';
import {
  AccommodationResponsibility,
  calculateRemainingAmount,
  formatNaira,
  getStatusLabel,
} from '../domain/accommodation';
import { Building2, ArrowRight } from 'lucide-react';

interface AccommodationResponsibilityCardProps {
  responsibility: AccommodationResponsibility;
  isDark: boolean;
  onViewDetails: (responsibilityId: string) => void;
}

export const AccommodationResponsibilityCard: React.FC<AccommodationResponsibilityCardProps> = ({
  responsibility,
  isDark,
  onViewDetails,
}) => {
  const remainingAmount = calculateRemainingAmount(responsibility);
  const statusLabel = getStatusLabel(responsibility.status);

  return (
    <article
      id={`responsibility-card-${responsibility.id}`}
      aria-labelledby={`responsibility-title-${responsibility.id}`}
      className="rounded-2xl p-5 sm:p-7 border transition-all duration-200"
      style={{
        backgroundColor: isDark ? '#3E200C' : '#FFF9EE',
        borderColor: isDark ? '#623416' : '#EAE0D0',
      }}
    >
      {/* Header: Title & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span
            className="text-xs font-semibold uppercase tracking-wider block mb-1"
            style={{ color: isDark ? '#C88D3A' : '#B77620' }}
          >
            Accommodation Responsibility
          </span>
          <h2
            id={`responsibility-title-${responsibility.id}`}
            className="font-serif text-xl sm:text-2xl font-semibold tracking-tight"
            style={{ color: isDark ? '#FFF9EE' : '#5A2D0C' }}
          >
            {responsibility.title}
          </h2>
        </div>

        {/* Status indicator */}
        <div className="self-start sm:self-auto">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase"
            style={{
              backgroundColor: isDark ? '#4B2710' : '#F7F1E7',
              color: isDark ? '#E2AB5D' : '#B77620',
              border: `1px solid ${isDark ? '#623416' : '#E7D6C1'}`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: isDark ? '#C88D3A' : '#B77620' }}
              aria-hidden="true"
            />
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Location Hierarchy: Property → Floor → Room */}
      <div
        className="rounded-xl p-3 sm:p-4 mb-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm"
        style={{
          backgroundColor: isDark ? '#2F1707' : '#F7F1E7',
          color: isDark ? '#D9C4AC' : '#5A2D0C',
          border: `1px solid ${isDark ? '#4B2710' : '#E7D6C1'}`,
        }}
      >
        <div className="flex items-center gap-2 font-medium">
          <Building2
            className="w-4 h-4 shrink-0"
            style={{ color: isDark ? '#C88D3A' : '#B77620' }}
            aria-hidden="true"
          />
          <span>{responsibility.accommodationContext.property.name}</span>
        </div>
        <div className="hidden sm:inline text-stone-400" aria-hidden="true">&bull;</div>
        <div className="flex items-center gap-3">
          <span>{responsibility.accommodationContext.floor.name}</span>
          <span aria-hidden="true">&bull;</span>
          <span className="font-medium">{responsibility.accommodationContext.room.name}</span>
        </div>
      </div>

      {/* Financial State Breakdown: Required, Verified, Remaining */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-t border-b mb-5"
        style={{ borderColor: isDark ? '#4B2710' : '#EAE0D0' }}
      >
        {/* Required Amount */}
        <div className="min-w-0">
          <span
            className="text-[11px] sm:text-xs block mb-1 truncate"
            style={{ color: isDark ? '#A67B54' : '#8A5D3B' }}
          >
            Required Amount
          </span>
          <p
            className="text-sm sm:text-base md:text-lg font-semibold truncate"
            style={{ color: isDark ? '#FFF9EE' : '#5A2D0C' }}
          >
            {formatNaira(responsibility.requiredAmount)}
          </p>
        </div>

        {/* Verified Amount */}
        <div className="min-w-0">
          <span
            className="text-[11px] sm:text-xs block mb-1 truncate"
            style={{ color: isDark ? '#A67B54' : '#8A5D3B' }}
          >
            Verified Amount
          </span>
          <p
            className="text-sm sm:text-base md:text-lg font-medium truncate"
            style={{ color: isDark ? '#D9C4AC' : '#704728' }}
          >
            {formatNaira(responsibility.verifiedAmount)}
          </p>
        </div>

        {/* Remaining Amount (Derived) */}
        <div className="min-w-0">
          <span
            className="text-[11px] sm:text-xs block mb-1 truncate font-medium"
            style={{ color: isDark ? '#C88D3A' : '#B77620' }}
          >
            Remaining Amount
          </span>
          <p
            className="text-sm sm:text-base md:text-lg font-bold truncate"
            style={{ color: isDark ? '#E2AB5D' : '#B77620' }}
          >
            {formatNaira(remainingAmount)}
          </p>
        </div>
      </div>

      {/* Action Footer: "View Responsibility" */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          id={`view-responsibility-${responsibility.id}-btn`}
          onClick={() => onViewDetails(responsibility.id)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isDark
              ? 'bg-[#C88D3A] text-[#2F1707] hover:bg-[#DDA250] focus-visible:ring-[#C88D3A] focus-visible:ring-offset-[#3E200C]'
              : 'bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#432108] focus-visible:ring-[#5A2D0C] focus-visible:ring-offset-[#FFF9EE]'
          }`}
        >
          <span>View Responsibility</span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
