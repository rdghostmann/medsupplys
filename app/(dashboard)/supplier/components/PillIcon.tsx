

import React from 'react';

interface PillIconProps {
  type: 'capsule-yellow-red' | 'pill-red' | 'pill-blue' | 'heart-red' | 'heart-blue' | 'pill-green' | 'tablet-white' | 'capsule-blue' | 'tablet-purple';
  size?: number;
  id?: string;
}

export const PillIcon: React.FC<PillIconProps> = ({ type, size = 32, id }) => {
  const renderedId = id || `pill-icon-${type}-${Math.random().toString(36).substr(2, 9)}`;

  switch (type) {
    case 'capsule-yellow-red':
      return (
        <svg
          id={renderedId}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm filter"
        >
          {/* Yellow half */}
          <path
            d="M9.17157 22.8284C6.82843 20.4853 6.82843 16.6863 9.17157 14.3431L16 7.51472L24.4853 16L17.6569 22.8284C15.3137 25.1716 11.5147 25.1716 9.17157 22.8284Z"
            fill="#FACC15"
          />
          {/* Red half */}
          <path
            d="M22.8284 9.17157C25.1716 11.5147 25.1716 15.3137 22.8284 17.6569L16 24.4853L7.51472 16L14.3431 9.17157C16.6863 6.82843 20.4853 6.82843 22.8284 9.17157Z"
            fill="#EF4444"
          />
          {/* Middle dividing line shadow */}
          <line x1="7.51472" y1="16" x2="24.4853" y2="16" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" transform="rotate(45 16 16)" />
        </svg>
      );

    case 'pill-red':
      return (
        <svg
          id={renderedId}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm filter"
        >
          <circle cx="16" cy="16" r="11" fill="#EF4444" />
          <circle cx="16" cy="16" r="11" stroke="#DC2626" strokeWidth="1.5" />
          {/* Scoring line down the pill center */}
          <line x1="16" y1="5" x2="16" y2="27" stroke="#DC2626" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />
          {/* Highlight shine */}
          <path d="M9 11C11.5 7.5 15.5 7 15.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
        </svg>
      );

    case 'pill-blue':
      return (
        <svg
          id={renderedId}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm filter"
        >
          <circle cx="16" cy="16" r="11" fill="#3B82F6" />
          <circle cx="16" cy="16" r="11" stroke="#2563EB" strokeWidth="1.5" />
          <line x1="16" y1="5" x2="16" y2="27" stroke="#2563EB" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />
          <path d="M9 11C11.5 7.5 15.5 7 15.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
        </svg>
      );

    case 'pill-green':
      return (
        <svg
          id={renderedId}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm filter"
        >
          <circle cx="16" cy="16" r="11" fill="#10B981" />
          <circle cx="16" cy="16" r="11" stroke="#059669" strokeWidth="1.5" />
          <line x1="16" y1="5" x2="16" y2="27" stroke="#059669" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />
          <path d="M9 11C11.5 7.5 15.5 7 15.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
        </svg>
      );

    case 'heart-red':
      return (
        <svg
          id={renderedId}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm filter"
        >
          <path
            d="M16 27C16 27 6 20 6 13C6 9 9 6 13 6C14.7 6 15.5 6.8 16 7.5C16.5 6.8 17.3 6 19 6C23 6 26 9 26 13C26 20 16 27 16 27Z"
            fill="#EF4444"
            stroke="#DC2626"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Scoring indentation */}
          <path d="M16 8V25" stroke="#B91C1C" strokeWidth="1" strokeDasharray="2 1" strokeOpacity="0.4" />
          {/* Highlight shine */}
          <path d="M10 9.5C11 8.5 12.5 8 13 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
        </svg>
      );

    case 'heart-blue':
      return (
        <svg
          id={renderedId}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm filter"
        >
          <path
            d="M16 27C16 27 6 20 6 13C6 9 9 6 13 6C14.7 6 15.5 6.8 16 7.5C16.5 6.8 17.3 6 19 6C23 6 26 9 26 13C26 20 16 27 16 27Z"
            fill="#3B82F6"
            stroke="#2563EB"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Scoring indentation */}
          <path d="M16 8V25" stroke="#1D4ED8" strokeWidth="1" strokeDasharray="2 1" strokeOpacity="0.4" />
          {/* Highlight shine */}
          <path d="M10 9.5C11 8.5 12.5 8 13 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
        </svg>
      );

    case 'tablet-white':
      return (
        <svg
          id={renderedId}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm filter"
        >
          {/* Oval tablet horizontal */}
          <rect x="5" y="10" width="22" height="12" rx="6" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1.5" />
          {/* Divider line in middle */}
          <line x1="16" y1="10" x2="16" y2="22" stroke="#9CA3AF" strokeWidth="1.5" />
          <path d="M8 13C12 11.5 15 12 15 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
        </svg>
      );

    case 'capsule-blue':
      return (
        <svg
          id={renderedId}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm filter"
        >
          {/* Blue capsule split */}
          <path
            d="M9.17157 22.8284C6.82843 20.4853 6.82843 16.6863 9.17157 14.3431L16 7.51472L24.4853 16L17.6569 22.8284C15.3137 25.1716 11.5147 25.1716 9.17157 22.8284Z"
            fill="#60A5FA"
          />
          <path
            d="M22.8284 9.17157C25.1716 11.5147 25.1716 15.3137 22.8284 17.6569L16 24.4853L7.51472 16L14.3431 9.17157C16.6863 6.82843 20.4853 6.82843 22.8284 9.17157Z"
            fill="#1E40AF"
          />
          <line x1="7.51472" y1="16" x2="24.4853" y2="16" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" transform="rotate(45 16 16)" />
        </svg>
      );

    case 'tablet-purple':
      return (
        <svg
          id={renderedId}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm filter"
        >
          {/* Circular tablet */}
          <circle cx="16" cy="16" r="11" fill="#C084FC" />
          <circle cx="16" cy="16" r="11" stroke="#A855F7" strokeWidth="1.5" />
          <line x1="16" y1="5" x2="16" y2="27" stroke="#A855F7" strokeWidth="1.5" />
          <path d="M9 11C11.5 7.5 15.5 7 15.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
        </svg>
      );

    default:
      return (
        <span id={renderedId} className="w-8 h-8 rounded-full bg-slate-200 inline-block" />
      );
  }
};
