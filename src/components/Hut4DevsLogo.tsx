import React from 'react';

interface Hut4DevsLogoProps {
  isDark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  wordmarkOrientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Hut4DevsLogo: React.FC<Hut4DevsLogoProps> = ({
  isDark = false,
  size = 'md',
  showWordmark = true,
  wordmarkOrientation = 'horizontal',
  className = '',
}) => {
  const iconDimensions = {
    sm: 36,
    md: 52,
    lg: 84,
  }[size];

  // Exact brand colors according to specification
  const colors = isDark
    ? {
        roofLeft: '#FFF9EE', // Warm Cream in dark mode
        roofRightChimney: '#C88D3A', // Caramel
        wallLeft: '#B77620', // Deep Gold
        wallRight: '#E2AB5D', // Light Caramel
        centerInterlock: '#3E200C', // Deep Chocolate elevated
        outline: '#2F1707',
        wordmarkPrimary: '#FFF9EE',
        wordmarkAccent: '#C88D3A',
      }
    : {
        roofLeft: '#5A2D0C', // Primary Chocolate in light mode
        roofRightChimney: '#C88D3A', // Caramel
        wallLeft: '#B77620', // Deep Gold
        wallRight: '#5A2D0C', // Primary Chocolate
        centerInterlock: '#FFF9EE', // Warm Cream
        outline: '#FFF9EE',
        wordmarkPrimary: '#5A2D0C',
        wordmarkAccent: '#C88D3A',
      };

  const emblem = (
    <svg
      width={iconDimensions}
      height={iconDimensions}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-colors duration-200"
      aria-hidden="true"
    >
      {/* Chimney on Right Roof */}
      <path
        d="M74 16H86V38H74V16Z"
        fill={colors.roofRightChimney}
      />
      <path
        d="M72 16H88V19H72V16Z"
        fill={colors.roofRightChimney}
      />

      {/* Top-Left Roof Puzzle Piece with interlocking boundary */}
      <path
        d="M60 20L18 52H38V58C38 61.3137 40.6863 64 44 64C47.3137 64 50 61.3137 50 58V52H60V38C56.6863 38 54 35.3137 54 32C54 28.6863 56.6863 26 60 26V20Z"
        fill={colors.roofLeft}
      />

      {/* Top-Right Roof Puzzle Piece (matching chimney and interlocking tabs) */}
      <path
        d="M60 20V26C56.6863 26 54 28.6863 54 32C54 35.3137 56.6863 38 60 38V52H70V58C70 61.3137 72.6863 64 76 64C79.3137 64 82 61.3137 82 58V52H102L60 20Z"
        fill={colors.roofRightChimney}
      />

      {/* Bottom-Left Wall Puzzle Piece */}
      <path
        d="M28 52H38V58C38 61.3137 40.6863 64 44 64C47.3137 64 50 61.3137 50 58V52H60V70C63.3137 70 66 72.6863 66 76C66 79.3137 63.3137 82 60 82V96H28V52Z"
        fill={colors.wallLeft}
      />

      {/* Bottom-Right Wall Puzzle Piece */}
      <path
        d="M60 52H70V58C70 61.3137 72.6863 64 76 64C79.3137 64 82 61.3137 82 58V52H92V96H60V82C63.3137 82 66 79.3137 66 76C66 72.6863 63.3137 70 60 70V52Z"
        fill={colors.wallRight}
      />

      {/* Central Interlocking Joint / Centerpiece */}
      <circle
        cx="60"
        cy="58"
        r="4"
        fill={colors.centerInterlock}
      />
    </svg>
  );

  if (!showWordmark) {
    return <div className={`inline-flex items-center ${className}`}>{emblem}</div>;
  }

  const wordmarkSizes = {
    sm: 'text-xl tracking-tight',
    md: 'text-2xl sm:text-3xl tracking-tight',
    lg: 'text-3xl sm:text-4xl md:text-5xl tracking-tight',
  }[size];

  return (
    <div
      className={`inline-flex ${
        wordmarkOrientation === 'vertical'
          ? 'flex-col items-center text-center gap-3'
          : 'flex-row items-center gap-3'
      } ${className}`}
    >
      {emblem}
      <div
        className={`font-serif font-bold select-none ${wordmarkSizes}`}
        style={{ color: colors.wordmarkPrimary }}
      >
        <span>Hut</span>
        <span style={{ color: colors.wordmarkAccent }}>4</span>
        <span>Devs</span>
      </div>
    </div>
  );
};
