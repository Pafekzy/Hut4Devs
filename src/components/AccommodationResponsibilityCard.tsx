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
      className="h4d-card-static rounded-2xl p-5 sm:p-7 border-2 border-b-4 transition-all duration-200 shadow-md backdrop-blur-md"
      style={{
        backgroundColor: isDark ? '#3E200C' : '#FAE5C5',
        borderColor: isDark ? '#623416' : '#CF9F68',
      }}
    >
      {/* Header: Title & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span
            className="text-xs font-bold uppercase tracking-wider block mb-1"
            style={{ color: isDark ? '#E5A857' : '#9F520B' }}
          >
            Accommodation Responsibility
          </span>
          <h2
            id={`responsibility-title-${responsibility.id}`}
            className="font-serif text-xl sm:text-2xl font-bold tracking-tight"
            style={{ color: isDark ? '#FFF9EE' : '#432006' }}
          >
            {responsibility.title}
          </h2>
        </div>

        {/* Status indicator */}
        <div className="self-start sm:self-auto">
          <span
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs border"
            style={{
              backgroundColor: isDark ? '#2F1707' : '#FDE8C7',
              color: isDark ? '#FDE8C7' : '#964700',
              borderColor: isDark ? '#C46F18' : '#C46F18',
            }}
          >
            <span
              className="w-2 h-2 rounded-full mr-2 shadow-xs"
              style={{ backgroundColor: isDark ? '#C46F18' : '#C46F18' }}
              aria-hidden="true"
            />
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Location Hierarchy: Property → Floor → Room */}
      <div
        className="rounded-xl p-3.5 sm:p-4 mb-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm border shadow-xs backdrop-blur-xs"
        style={{
          backgroundColor: isDark ? '#2F1707' : '#FFF0D6',
          color: isDark ? '#EAD6C0' : '#432006',
          borderColor: isDark ? '#623416' : '#CF9F68',
        }}
      >
        <div className="flex items-center gap-2 font-bold">
          <Building2
            className="w-4 h-4 shrink-0"
            style={{ color: isDark ? '#E5A857' : '#C46F18' }}
            aria-hidden="true"
          />
          <span>{responsibility.accommodationContext?.property?.name || (responsibility as any).propertyName || 'Infinite Grace Apartment'}</span>
        </div>
        <div className="hidden sm:inline text-[#C46F18]/60 dark:text-[#E5D3BA]/50" aria-hidden="true">&bull;</div>
        <div className="flex items-center gap-3">
          <span>{responsibility.accommodationContext?.floor?.name || 'Floor 3'}</span>
          <span aria-hidden="true">&bull;</span>
          <span className="font-semibold">{responsibility.accommodationContext?.room?.name || (responsibility as any).roomNumber || 'Room 304'}</span>
        </div>
      </div>

      {/* Financial State Breakdown: Required, Verified, Remaining */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-t-2 border-b-2 mb-5"
        style={{ borderColor: isDark ? '#623416' : '#DDB985' }}
      >
        {/* Required Amount */}
        <div className="min-w-0">
          <span
            className="text-[11px] sm:text-xs block mb-1 truncate font-medium"
            style={{ color: isDark ? '#E5D3BA' : '#72451F' }}
          >
            Required Amount
          </span>
          <p
            className="text-sm sm:text-base md:text-lg font-bold truncate font-mono"
            style={{ color: isDark ? '#FFF9EE' : '#432006' }}
          >
            {formatNaira(responsibility.requiredAmount)}
          </p>
        </div>

        {/* Verified Amount */}
        <div className="min-w-0">
          <span
            className="text-[11px] sm:text-xs block mb-1 truncate font-medium"
            style={{ color: isDark ? '#E5D3BA' : '#72451F' }}
          >
            Verified Amount
          </span>
          <p
            className="text-sm sm:text-base md:text-lg font-semibold truncate font-mono"
            style={{ color: isDark ? '#EAD6C0' : '#3D5A1E' }}
          >
            {formatNaira(responsibility.verifiedAmount)}
          </p>
        </div>

        {/* Remaining Amount (Derived) */}
        <div className="min-w-0">
          <span
            className="text-[11px] sm:text-xs block mb-1 truncate font-bold"
            style={{ color: isDark ? '#E5A857' : '#9F520B' }}
          >
            Remaining Amount
          </span>
          <p
            className="text-sm sm:text-base md:text-lg font-extrabold truncate font-mono"
            style={{ color: isDark ? '#E5A857' : '#C46F18' }}
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
          className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border-b-3 active:border-b active:translate-y-[1px] shadow-sm ${
            isDark
              ? 'bg-[#C46F18] text-[#2F1707] hover:bg-[#D18125] border-[#9F520B] focus-visible:ring-[#C46F18] focus-visible:ring-offset-[#261205]'
              : 'bg-[#432006] text-[#FFF0D6] hover:bg-[#341905] border-[#251203] focus-visible:ring-[#432006] focus-visible:ring-offset-[#FAE5C5]'
          }`}
        >
          <span>View Responsibility</span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
