import React from 'react';

interface Hut4DevsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
}

export const Hut4DevsLogo: React.FC<Hut4DevsLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
}) => {
  const sizeMap = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  const chosenHeight = sizeMap[size];

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 400 330"
        className={`${chosenHeight} w-auto aspect-[400/330] fill-current select-none shrink-0 transition-colors duration-200`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Hut4Devs Mark"
        role="img"
      >
        {/* Thatched Roof with 3-tier fronds */}
        <path d="M 200 12
                 C 195 26, 188 44, 176 60 L 186 64 L 164 86 L 178 90 L 152 114 L 168 118 L 136 145 L 154 149 L 120 178 L 140 181 L 102 214 L 124 217 L 84 250 L 108 253 L 64 282
                 L 86 276 L 106 288 L 128 272 L 150 286 L 172 270 L 194 286 L 206 270 L 228 286 L 250 270 L 272 286 L 294 272 L 314 288 L 334 276 L 356 282
                 L 312 253 L 336 250 L 296 217 L 318 214 L 280 181 L 300 178 L 266 149 L 284 145 L 252 118 L 268 114 L 242 90 L 256 86 L 234 64 L 244 60
                 C 232 44, 225 26, 220 12 Z" />

        {/* Supporting Pillars */}
        <path d="M 125 265 L 139 263 L 138 330 L 124 330 Z" />
        <path d="M 261 263 L 275 265 L 276 330 L 262 330 Z" />

        {/* Inside Code Mark: < / > */}
        {/* Left chevron '<' */}
        <path d="M 188 276 L 156 295 L 188 314 L 181 326 L 136 299 L 136 291 L 181 264 Z" />
        {/* Center slash '/' */}
        <path d="M 216 260 L 198 332 L 184 328 L 202 256 Z" />
        {/* Right chevron '>' */}
        <path d="M 212 276 L 244 295 L 212 314 L 219 326 L 264 299 L 264 291 L 219 264 Z" />
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 540 460"
        className={`${chosenHeight} w-auto aspect-[540/460] fill-current select-none shrink-0 transition-colors duration-200`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Hut4Devs Logo"
        role="img"
      >
        {/* Thatched Roof with 3-tier jagged straw silhouette */}
        <path d="M 270 14 
                 C 264 30, 256 50, 242 70 L 254 75 L 230 98 L 246 103 L 218 128 L 234 133 L 200 162 L 218 166 L 182 197 L 202 201 L 160 236 L 182 240 L 140 274 L 164 278 L 118 310
                 L 144 303 L 166 317 L 190 300 L 214 316 L 238 298 L 264 316 L 276 298 L 302 316 L 326 298 L 350 316 L 374 300 L 398 317 L 420 303 L 446 310
                 L 400 278 L 424 274 L 382 240 L 404 236 L 362 201 L 382 197 L 346 166 L 364 162 L 330 133 L 346 128 L 318 103 L 334 98 L 310 75 L 322 70
                 C 308 50, 300 30, 294 14 Z" />

        {/* Left Wooden Stilt Pillar */}
        <path d="M 174 290 L 190 288 L 188 368 L 172 368 Z" />

        {/* Right Wooden Stilt Pillar */}
        <path d="M 334 288 L 350 290 L 352 368 L 336 368 Z" />

        {/* Inside Code Mark: < / > */}
        {/* Left chevron '<' */}
        <path d="M 252 308 L 216 328 L 252 348 L 244 362 L 194 334 L 194 322 L 244 294 Z" />
        {/* Center slash '/' */}
        <path d="M 284 290 L 262 370 L 246 366 L 268 286 Z" />
        {/* Right chevron '>' */}
        <path d="M 272 308 L 308 328 L 272 348 L 280 362 L 330 334 L 330 322 L 280 294 Z" />

        {/* Typography: "Hut4Devs" underneath posts */}
        <text
          x="270"
          y="432"
          textAnchor="middle"
          fontSize="68"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          letterSpacing="-1.8px"
        >
          Hut4Devs
        </text>
      </svg>
    </div>
  );
};
