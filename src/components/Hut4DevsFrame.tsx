import React from 'react';

export interface Hut4DevsFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  isDark?: boolean;
  variant?: 'card' | 'surface' | 'highlight' | 'subtle';
  accentColor?: string; // Optional internal semantic accent border or glow
  children: React.ReactNode;
}

/**
 * Hut4DevsFrame: Unified External Brand Frame Primitive
 *
 * Core Principle: "THIRD-PARTY / SEMANTIC COLOR INSIDE, HUT4DEVS BRAND FRAME OUTSIDE"
 * Enforces the brand palette:
 * - Warm ivory: #F7F1E7
 * - Soft cream: #FFF9EE
 * - Dark chocolate: #5A2D0C
 * - Caramel gold: #C88D3A
 * - Deep golden brown: #B77620
 * - Dark surface: #2F1707
 */
export const Hut4DevsFrame: React.FC<Hut4DevsFrameProps> = ({
  isDark = false,
  variant = 'card',
  accentColor,
  className = '',
  style = {},
  children,
  ...rest
}) => {
  // Base classes with rounded geometry and smooth theme transition
  const baseClasses = 'rounded-2xl transition-all duration-200';

  // Variant styling
  const variantStyles = {
    card: isDark
      ? 'bg-[#3E200C]/75 text-[#FFF9EE] border-2 border-[#C46F18]/40 backdrop-blur-md shadow-[0_8px_32px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(196,111,24,0.2)]'
      : 'bg-[#FAE5C5] text-[#432006] border-2 border-[#CF9F68] shadow-[0_8px_30px_-6px_rgba(67,32,6,0.19),inset_0_1px_0_rgba(255,240,214,0.9)]',
    surface: isDark
      ? 'bg-[#241104]/80 text-[#FFF9EE] border border-[#623416] shadow-xs'
      : 'bg-[#F3D5AB]/80 text-[#432006] border border-[#DDB985] shadow-xs',
    highlight: isDark
      ? 'bg-[#4B2710]/80 text-[#FFF9EE] border-2 border-[#C46F18] backdrop-blur-md shadow-[0_10px_35px_-5px_rgba(196,111,24,0.25),inset_0_1px_0_rgba(229,168,87,0.3)]'
      : 'bg-[#FFF0D6] text-[#432006] border-2 border-[#C46F18] shadow-[0_10px_35px_-5px_rgba(196,111,24,0.20),inset_0_1px_0_rgba(255,240,214,0.9)]',
    subtle: isDark
      ? 'bg-[#2F1707]/60 text-[#FFF9EE] border border-[#623416]/70 backdrop-blur-xs'
      : 'bg-[#FAE5C5]/60 text-[#72451F] border border-[#DDB985] backdrop-blur-xs',
  };

  const combinedStyles: React.CSSProperties = {
    ...(accentColor ? { borderLeft: `4px solid ${accentColor}` } : {}),
    ...style,
  };

  return (
    <div
      className={`${baseClasses} ${variantStyles[variant]} ${className}`}
      style={combinedStyles}
      {...rest}
    >
      {children}
    </div>
  );
};

export interface BrandedSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  isDark?: boolean;
  elevation?: 1 | 2 | 3;
  children: React.ReactNode;
}

/**
 * BrandedSurface: Internal nested surface within Hut4Devs brand geometry
 */
export const BrandedSurface: React.FC<BrandedSurfaceProps> = ({
  isDark = false,
  elevation = 1,
  className = '',
  children,
  style = {},
  ...rest
}) => {
  const elevationStyles = {
    1: isDark
      ? 'bg-[#241104]/80 border border-[#623416] text-[#FFF9EE]'
      : 'bg-[#F3D5AB]/80 border border-[#DDB985] text-[#432006]',
    2: isDark
      ? 'bg-[#3E200C]/85 border border-[#8E560C] text-[#FFF9EE]'
      : 'bg-[#FAE5C5] border border-[#CF9F68] text-[#432006]',
    3: isDark
      ? 'bg-[#4B2710] border border-[#C46F18]/50 text-[#FFF9EE]'
      : 'bg-[#FFF0D6] border border-[#B97A38] text-[#432006]',
  };

  return (
    <div
      className={`rounded-xl p-4 transition-colors duration-150 ${elevationStyles[elevation]} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
};

export interface BrandedActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isDark?: boolean;
  variant?: 'bmoni' | 'primary' | 'secondary' | 'accent' | 'gift' | 'loan' | 'contribution';
  isLoading?: boolean;
  children: React.ReactNode;
}

/**
 * BrandedActionButton: 3D Raised Interaction Button
 *
 * Requirements:
 * - DEFAULT: 3D / raised appearance, clear tactile depth
 * - HOVER: slight upward lift (translateY(-2px)), subtle glow highlight
 * - ACTIVE: small press-down effect (translateY(1px)), reduced shadow
 */
export const BrandedActionButton: React.FC<BrandedActionButtonProps> = ({
  isDark = false,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  // 3D tactile button styling
  const variantStyles = {
    // BMONI button: BMONI own brand color inside Hut4Devs 3D raised elevation
    bmoni: isDark
      ? 'bg-[#2563EB] text-white border-b-4 border-[#1E3A8A] hover:bg-[#3B82F6] hover:border-[#1D4ED8] hover:shadow-[0_8px_25px_rgba(59,130,246,0.5)] active:border-b-1 active:translate-y-[2px]'
      : 'bg-[#1D4ED8] text-white border-b-4 border-[#172554] hover:bg-[#2563EB] hover:border-[#1E3A8A] hover:shadow-[0_8px_25px_rgba(37,99,235,0.45)] active:border-b-1 active:translate-y-[2px]',
    // Primary caramel/gold / chocolate
    primary: isDark
      ? 'bg-[#C46F18] text-[#2F1707] border-b-4 border-[#7A4B0A] hover:bg-[#D18125] hover:shadow-[0_6px_18px_rgba(196,111,24,0.35)] active:border-b-1 active:translate-y-[2px]'
      : 'bg-[#432006] text-[#FAE5C5] border-b-4 border-[#2F1707] hover:bg-[#341905] hover:shadow-[0_6px_18px_rgba(67,32,6,0.3)] active:border-b-1 active:translate-y-[2px]',
    // Secondary ivory / chocolate outline
    secondary: isDark
      ? 'bg-[#2F1707] text-[#E5D3BA] border-b-4 border-[#1A0C04] hover:bg-[#3E200C] hover:text-[#FFF9EE] active:border-b-1 active:translate-y-[2px]'
      : 'bg-[#FFF0D6] text-[#432006] border-b-4 border-[#CF9F68] hover:bg-[#FAE5C5] active:border-b-1 active:translate-y-[2px]',
    // Accent semantic button
    accent: isDark
      ? 'bg-[#9F520B] text-[#FFF0D6] border-b-4 border-[#72451F] hover:bg-[#C46F18] active:border-b-1 active:translate-y-[2px]'
      : 'bg-[#9F520B] text-[#FFF0D6] border-b-4 border-[#72451F] hover:bg-[#C46F18] active:border-b-1 active:translate-y-[2px]',
    // Peer Support: Gift (Warm olive / forest)
    gift: isDark
      ? 'bg-[#556A36] text-white border-b-4 border-[#254020] hover:bg-[#637A40] hover:shadow-[0_6px_20px_rgba(85,106,54,0.35)] active:border-b-1 active:translate-y-[2px]'
      : 'bg-[#556A36] text-white border-b-4 border-[#3F512C] hover:bg-[#637A40] hover:shadow-[0_6px_20px_rgba(85,106,54,0.3)] active:border-b-1 active:translate-y-[2px]',
    // Peer Support: Loan (Muted denim / ink blue)
    loan: isDark
      ? 'bg-[#3E5964] text-white border-b-4 border-[#1E3647] hover:bg-[#4C6872] hover:shadow-[0_6px_20px_rgba(62,89,100,0.35)] active:border-b-1 active:translate-y-[2px]'
      : 'bg-[#3E5964] text-white border-b-4 border-[#344D59] hover:bg-[#4C6872] hover:shadow-[0_6px_20px_rgba(62,89,100,0.3)] active:border-b-1 active:translate-y-[2px]',
    // Peer Support: Contribution (Aubergine / plum)
    contribution: isDark
      ? 'bg-[#67465F] text-white border-b-4 border-[#472B4B] hover:bg-[#76546E] hover:shadow-[0_6px_20px_rgba(103,70,95,0.35)] active:border-b-1 active:translate-y-[2px]'
      : 'bg-[#67465F] text-white border-b-4 border-[#593B55] hover:bg-[#76546E] hover:shadow-[0_6px_20px_rgba(103,70,95,0.3)] active:border-b-1 active:translate-y-[2px]',
  };

  return (
    <button
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer select-none ${
        isDisabled
          ? 'opacity-50 cursor-not-allowed transform-none shadow-none'
          : 'hover:-translate-y-[2px] active:translate-y-[1px]'
      } ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
