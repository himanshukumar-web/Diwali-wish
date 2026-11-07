import React from 'react';

export const CornerOrnament: React.FC<{ className?: string; position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({
  className = "w-10 h-10",
  position = 'top-left'
}) => {
  const getRotation = () => {
    switch (position) {
      case 'top-right': return 'scale-x-[-1]';
      case 'bottom-left': return 'scale-y-[-1]';
      case 'bottom-right': return 'scale-[-1]';
      default: return '';
    }
  };

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${getRotation()} text-gold-500`}
    >
      <path 
        d="M5 5 H45 C50 25 25 50 5 45 V5 Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="currentColor" 
        fillOpacity="0.12" 
      />
      <path 
        d="M5 5 Q 35 15, 60 5 Q 50 30, 65 65 Q 30 50, 5 60 Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
      />
      <circle cx="15" cy="15" r="4" fill="currentColor" />
      <circle cx="28" cy="28" r="2.5" fill="currentColor" />
      <circle cx="8" cy="38" r="2" fill="currentColor" />
      <circle cx="38" cy="8" r="2" fill="currentColor" />
      <path d="M5 5 L20 20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

export const OrnateDivider: React.FC<{ className?: string; text?: string }> = ({ className = "my-6", text }) => {
  return (
    <div className={`flex items-center justify-center space-x-3 w-full ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold-500/60 to-gold-400"></div>
      <div className="flex items-center space-x-2 text-gold-400">
        <svg className="w-4 h-4 transform rotate-45" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
        {text ? (
          <span className="font-heading font-semibold text-xs tracking-widest uppercase px-2 text-gold-300">
            {text}
          </span>
        ) : (
          <div className="relative">
            {/* Small center Diya / Lotus motif */}
            <svg className="w-6 h-6 text-saffron-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C10.5 5 9 8 9 11C9 13.5 10.5 15 12 15C13.5 15 15 13.5 15 11C15 8 13.5 5 12 2Z" fill="#FFAA55" />
              <path d="M4 14C4 18 7.5 21 12 21C16.5 21 20 18 20 14H4Z" fill="#D4AF37" />
            </svg>
          </div>
        )}
        <svg className="w-4 h-4 transform rotate-45" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gold-500/60 to-gold-400"></div>
    </div>
  );
};

export const ToranGarland: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`w-full overflow-hidden select-none pointer-events-none flex justify-center ${className}`}>
      <div className="flex items-start justify-between w-full max-w-7xl px-2">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center animate-pulse-subtle" style={{ animationDelay: `${i * 180}ms` }}>
            {/* Mango Leaf */}
            <svg viewBox="0 0 24 40" className="w-5 h-8 text-emerald-700/80 drop-shadow">
              <path d="M12 0 C18 10 24 25 12 40 C0 25 6 10 12 0 Z" fill="currentColor" stroke="#D4AF37" strokeWidth="0.8" />
            </svg>
            {/* Marigold Flower */}
            <div className="relative -mt-2">
              <div className={`w-6 h-6 rounded-full shadow-md flex items-center justify-center ${
                i % 2 === 0 ? 'bg-gradient-to-br from-amber-400 via-saffron-500 to-amber-600' : 'bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500'
              } border border-gold-400/60`}>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-700/60"></div>
              </div>
              {/* Golden bead drop */}
              {i % 2 === 0 && (
                <div className="w-1 h-3 bg-gold-400 mx-auto rounded-b"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MandalaOrnament: React.FC<{ className?: string; glow?: boolean }> = ({ 
  className = "w-64 h-64", 
  glow = true 
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-gold-500/15 rounded-full filter blur-2xl transform scale-110"></div>
      )}
      <svg 
        viewBox="0 0 300 300" 
        className="w-full h-full spin-mandala text-gold-500/80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="150" cy="150" r="130" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="150" cy="150" r="118" stroke="currentColor" strokeWidth="0.8" strokeDasharray="6 4" />
        
        {/* 16 Lotus Petals Outer */}
        {Array.from({ length: 16 }).map((_, idx) => {
          const angle = (idx * 360) / 16;
          return (
            <g key={`outer-${idx}`} transform={`rotate(${angle} 150 150)`}>
              <path 
                d="M150 20 C140 50 120 75 150 95 C180 75 160 50 150 20 Z" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                fill="currentColor" 
                fillOpacity="0.06" 
              />
              <circle cx="150" cy="20" r="2.5" fill="currentColor" />
            </g>
          );
        })}

        {/* 12 Mid Petals */}
        {Array.from({ length: 12 }).map((_, idx) => {
          const angle = (idx * 360) / 12 + 15;
          return (
            <g key={`mid-${idx}`} transform={`rotate(${angle} 150 150)`}>
              <path 
                d="M150 65 C138 85 130 100 150 115 C170 100 162 85 150 65 Z" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                fill="currentColor" 
                fillOpacity="0.12" 
              />
            </g>
          );
        })}

        {/* Center Ring & Star */}
        <circle cx="150" cy="150" r="35" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
        <circle cx="150" cy="150" r="22" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="150" cy="150" r="8" fill="currentColor" />
      </svg>
    </div>
  );
};

export const TempleBell: React.FC<{ className?: string; isSwinging?: boolean; onClick?: () => void }> = ({
  className = "w-8 h-8",
  isSwinging = false,
  onClick
}) => {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`group cursor-pointer p-2 rounded-full hover:bg-gold-500/10 transition-transform ${isSwinging ? 'animate-bounce' : ''}`}
      title="Ring Sacred Temple Bell"
      aria-label="Ring Temple Bell"
    >
      <svg viewBox="0 0 32 32" className={`${className} text-gold-400 group-hover:text-gold-300 transition-colors`} fill="currentColor">
        {/* Ring chain */}
        <line x1="16" y1="2" x2="16" y2="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Bell body */}
        <path d="M16 8 C11 8 9 12 9 18 C9 22 7 24 6 25 H26 C25 24 23 22 23 18 C23 12 21 8 16 8 Z" fill="currentColor" stroke="#947214" strokeWidth="0.8" />
        {/* Clapper */}
        <circle cx="16" cy="27" r="2.5" fill="#FFE599" />
      </svg>
    </button>
  );
};

export const DiyaGraphic: React.FC<{
  isLit?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ isLit = true, size = 'md', className = '' }) => {
  const sizeMap = {
    xs: 'w-7 h-7 sm:w-8 sm:h-8',
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      {/* Radiant Glow when lit */}
      {isLit && (
        <>
          <div className={`absolute ${size === 'xs' ? '-top-1.5 w-6 h-7 filter blur-sm opacity-70' : '-top-3 w-12 h-14 filter blur-md opacity-80'} bg-gradient-to-t from-saffron-500 to-amber-300 rounded-full animate-pulse pointer-events-none`}></div>
          <div className={`absolute ${size === 'xs' ? '-top-2 w-8 h-9 filter blur-md opacity-40' : '-top-5 w-16 h-18 filter blur-xl'} bg-gold-400/30 rounded-full animate-pulse pointer-events-none`}></div>
        </>
      )}

      <svg viewBox="0 0 100 80" className="w-full h-full filter drop-shadow-md">
        {/* Diya Flame */}
        {isLit ? (
          <g className="flame-core">
            {/* Outer Flame (Orange) */}
            <path 
              d="M50 2 C44 14 38 24 38 34 C38 43 43 49 50 49 C57 49 62 43 62 34 C62 24 56 14 50 2 Z" 
              fill="url(#outerFlame)" 
            />
            {/* Mid Flame (Gold) */}
            <path 
              d="M50 10 C46 19 42 27 42 35 C42 42 45 46 50 46 C55 46 58 42 58 35 C58 27 54 19 50 10 Z" 
              fill="url(#midFlame)" 
            />
            {/* Core Flame (Warm White) */}
            <path 
              d="M50 20 C48 26 46 31 46 37 C46 41 48 44 50 44 C52 44 54 41 54 37 C54 31 52 26 50 20 Z" 
              fill="#FFF8E7" 
            />
          </g>
        ) : (
          /* Unlit cotton wick */
          <path d="M50 45 C49 38 48 34 50 32" stroke="#4A3B32" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Diya Clay/Brass Lamp Bowl */}
        {/* Oil Rim */}
        <ellipse cx="50" cy="46" rx="34" ry="7" fill="#42141C" />
        <ellipse cx="50" cy="47" rx="31" ry="5" fill={isLit ? "#B25900" : "#240A0F"} />

        {/* Brass Diya Base Body */}
        <path 
          d="M16 46 C16 62 30 72 50 72 C70 72 84 62 84 46 C75 51 63 53 50 53 C37 53 25 51 16 46 Z" 
          fill="url(#diyaBrassGrad)" 
          stroke="#947214" 
          strokeWidth="1.2" 
        />
        {/* Foot Base */}
        <path d="M38 71 H62 L66 77 H34 L38 71 Z" fill="#947214" />
        {/* Traditional Engraved Pattern on Bowl */}
        <path 
          d="M26 53 Q 50 64, 74 53" 
          stroke="#FFE599" 
          strokeWidth="1" 
          strokeDasharray="2 3" 
          fill="none" 
        />
        <circle cx="50" cy="62" r="2" fill="#FFE599" />
        <circle cx="42" cy="60" r="1.5" fill="#FFE599" />
        <circle cx="58" cy="60" r="1.5" fill="#FFE599" />

        {/* Gradients */}
        <defs>
          <linearGradient id="outerFlame" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF3DC" />
            <stop offset="30%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#CC3300" />
          </linearGradient>
          <linearGradient id="midFlame" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="#FF9933" />
          </linearGradient>
          <linearGradient id="diyaBrassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5D77F" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#8A6710" />
            <stop offset="100%" stopColor="#5E4306" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

