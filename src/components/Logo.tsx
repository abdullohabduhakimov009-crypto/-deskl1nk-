import React from 'react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", isDark = true }) => {
  return (
    <div className={`inline-flex items-center gap-3 group cursor-pointer ${className}`}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Premium Monogram Icon */}
        <svg viewBox="0 0 100 100" className="w-full h-full transition-all duration-700 group-hover:scale-110">
          <defs>
            <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          
          {/* Background Ring */}
          <circle 
            cx="50" cy="50" r="45" 
            fill="none" 
            stroke={isDark ? "#1e293b" : "#e2e8f0"} 
            strokeWidth="2" 
            className="opacity-50"
          />
          
          {/* Stylized 'D' and 'N' Intersection - More Rounded */}
          <path 
            d="M35 25 C30 25 30 30 30 35 V65 C30 70 30 75 35 75 H55 C70 75 80 65 80 50 C80 35 70 25 55 25 H35 Z" 
            fill="none" 
            stroke="url(#premiumGradient)" 
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_12px_rgba(45,212,191,0.6)]"
          />
          <path 
            d="M45 60 V40 L65 60 V40" 
            fill="none" 
            stroke={isDark ? "white" : "#0f172a"} 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="opacity-80 group-hover:opacity-100 transition-opacity"
          />
          
          {/* Animated Accent Dot */}
          <circle cx="80" cy="50" r="3" fill="#2dd4bf" className="animate-pulse" />
        </svg>
        
        {/* Outer Glow Aura */}
        <div className="absolute inset-0 bg-brand-teal/10 blur-2xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
      
      <span className="font-black text-xl tracking-tighter flex items-center">
        <span className={`${isDark ? 'text-white group-hover:text-slate-200' : 'text-slate-900 group-hover:text-slate-700'} transition-colors uppercase`}>Desk</span>
        <span className="text-brand-teal ml-0.5 uppercase">Net</span>
      </span>
    </div>
  );
};

export default Logo;
