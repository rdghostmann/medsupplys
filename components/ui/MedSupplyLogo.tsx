import React from 'react';

interface MedSupplyLogoProps {
  variant?: 'full' | 'horizontal' | 'iconOnly';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const MedSupplyLogo: React.FC<MedSupplyLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showTagline = false,
  className = ''
}) => {
  // Dimension definitions
  const iconSizes = {
    sm: 28,
    md: 38,
    lg: 52,
    xl: 72
  };

  const currentIconSize = iconSizes[size];

  // SVG Icon Component of the Pill / Capsule with Network and Checkmark
  const LogoIcon = (
    <svg 
      width={currentIconSize} 
      height={currentIconSize} 
      viewBox="0 0 320 320" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
    >
      <defs>
        <linearGradient id="capsuleGrad" x1="10%" y1="90%" x2="90%" y2="10%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="30%" stopColor="#1d4ed8" />
          <stop offset="60%" stopColor="#0284c7" />
          <stop offset="85%" stopColor="#059669" />
          <stop offset="100%" stopColor="#00b87c" />
        </linearGradient>

        <clipPath id="innerCapsuleClip">
          <rect x="-115" y="-55" width="230" height="110" rx="55" ry="55" />
        </clipPath>

        <filter id="capsuleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#1d4ed8" floodOpacity="0.22" />
        </filter>
      </defs>

      <g transform="translate(160, 160) rotate(-45)">
        {/* Capsule Base */}
        <rect 
          x="-115" 
          y="-55" 
          width="230" 
          height="110" 
          rx="55" 
          ry="55" 
          fill="url(#capsuleGrad)"
          filter="url(#capsuleShadow)"
        />

        {/* Constellation Network Nodes & Interconnecting Lines */}
        <g clipPath="url(#innerCapsuleClip)" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.45" fill="#ffffff">
          <line x1="-90" y1="-15" x2="-65" y2="18" />
          <line x1="-65" y1="18" x2="-30" y2="-8" />
          <line x1="-30" y1="-8" x2="-5" y2="25" />
          <line x1="-5" y1="25" x2="28" y2="-15" />
          <line x1="28" y1="-15" x2="60" y2="12" />
          <line x1="60" y1="12" x2="90" y2="-8" />

          <line x1="-75" y1="-32" x2="-30" y2="-8" />
          <line x1="-30" y1="-8" x2="18" y2="-38" />
          <line x1="18" y1="-38" x2="60" y2="-22" />
          <line x1="60" y1="-22" x2="90" y2="-8" />

          <line x1="-55" y1="36" x2="-5" y2="25" />
          <line x1="-5" y1="25" x2="42" y2="32" />
          <line x1="42" y1="32" x2="75" y2="20" />

          <line x1="-90" y1="-15" x2="-75" y2="-32" />
          <line x1="-65" y1="18" x2="-55" y2="36" />
          <line x1="28" y1="-15" x2="60" y2="-22" />

          {/* Dots */}
          <circle cx="-90" cy="-15" r="3" fillOpacity="0.7" />
          <circle cx="-75" cy="-32" r="3.5" fillOpacity="0.85" />
          <circle cx="-65" cy="18" r="3.5" fillOpacity="0.85" />
          <circle cx="-55" cy="36" r="2.8" fillOpacity="0.6" />
          <circle cx="-30" cy="-8" r="4.2" fillOpacity="0.95" />
          <circle cx="-5" cy="25" r="3.5" fillOpacity="0.85" />
          <circle cx="18" cy="-38" r="3" fillOpacity="0.75" />
          <circle cx="28" cy="-15" r="4.2" fillOpacity="0.95" />
          <circle cx="42" cy="32" r="2.5" fillOpacity="0.55" />
          <circle cx="60" cy="-22" r="3.8" fillOpacity="0.9" />
          <circle cx="60" cy="12" r="3.5" fillOpacity="0.8" />
          <circle cx="75" cy="20" r="3" fillOpacity="0.7" />
          <circle cx="90" cy="-8" r="3.8" fillOpacity="0.9" />
        </g>

        {/* Bold Modern Checkmark */}
        <path 
          d="M -50 -1 L -15 34 L 105 -34 L 90 -34 L -15 17 L -38 -12 Z" 
          fill="#ffffff"
        />
      </g>
    </svg>
  );

  if (variant === 'iconOnly') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {LogoIcon}
      </div>
    );
  }

  // Text sizes corresponding to size prop
  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl'
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px] sm:text-xs',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm sm:text-base'
  };

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {LogoIcon}
        <div className="mt-3">
          <span className={`${titleSizes[size]} font-extrabold tracking-tight leading-none`}>
            <span className="text-[#1e3a8a]">Med</span>
            <span className="text-[#00b87c]">Supply</span>
          </span>
          <p className={`${subSizes[size]} text-slate-500 font-medium tracking-wide mt-1`}>
            Procurement &amp; Verification
          </p>
        </div>
      </div>
    );
  }

  // Default: Horizontal
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {LogoIcon}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`${titleSizes[size]} font-extrabold tracking-tight leading-none`}>
            <span className="text-[#1e3a8a]">Med</span>
            <span className="text-[#00b87c]">Supply</span>
          </span>
          <span className="hidden sm:inline-flex text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            B2B
          </span>
        </div>
        {(showTagline || size === 'lg' || size === 'xl') && (
          <span className={`${subSizes[size]} text-slate-500 font-medium tracking-tight mt-0.5`}>
            Procurement &amp; Verification
          </span>
        )}
      </div>
    </div>
  );
};
