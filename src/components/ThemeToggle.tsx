import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  className = '',
}) => {
  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 min-h-[44px] min-w-[44px] rounded-full text-sm font-medium transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C46F18] ${
        isDark
          ? 'bg-[#341905] text-[#FFF0D6] border border-[#6B3710] hover:bg-[#432006]'
          : 'bg-[#FFF0D6] text-[#432006] border border-[#CF9F68] hover:bg-[#E8BF88]'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-[#C46F18] shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline text-xs tracking-wide">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-[#432006] shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline text-xs tracking-wide">Dark Mode</span>
        </>
      )}
    </button>
  );
};
