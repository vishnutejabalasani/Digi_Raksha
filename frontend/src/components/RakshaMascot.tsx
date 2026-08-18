import React from 'react';

interface RakshaProps {
  expression?: 'idle' | 'warning' | 'celebrate' | 'sad' | 'talk';
  message?: string;
  className?: string;
}

export const RakshaMascot: React.FC<RakshaProps> = ({ 
  expression = 'idle', 
  message, 
  className = '' 
}) => {
  
  // Custom eye colors and shapes based on mood
  const getEyeDetails = () => {
    switch (expression) {
      case 'warning':
        return { color: '#EF4444', height: 4, glow: 'drop-shadow(0 0 8px #EF4444)' };
      case 'celebrate':
        return { color: '#22C55E', height: 8, glow: 'drop-shadow(0 0 10px #22C55E)' };
      case 'sad':
        return { color: '#64748B', height: 2, glow: 'none' };
      case 'talk':
      default:
        return { color: '#06B6D4', height: 7, glow: 'drop-shadow(0 0 8px #06B6D4)' };
    }
  };

  const eyes = getEyeDetails();

  return (
    <div className={`flex items-center gap-4 select-none ${className}`}>
      
      {/* Playful Speech Bubble */}
      {message && (
        <div className="relative bg-white border-2 border-[#E0F2FE] rounded-2xl p-3.5 text-xs text-slate-700 max-w-[200px] leading-relaxed shadow-sm font-black animate-fade-in">
          {/* Bubble Arrow */}
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-r-2 border-t-2 border-[#E0F2FE] transform rotate-45"></div>
          {message}
        </div>
      )}

      {/* SVG Vector Mascot */}
      <div className={`relative w-24 h-24 flex items-center justify-center shrink-0`}>
        <svg 
          viewBox="0 0 100 100" 
          className={`w-full h-full 
            ${expression === 'idle' ? 'animate-bounce [animation-duration:3s]' : ''}
            ${expression === 'celebrate' ? 'animate-bounce [animation-duration:1s]' : ''}
          `}
        >
          {/* Glowing Wings Backing */}
          <path 
            d="M 15 50 Q 5 25 30 35 M 85 50 Q 95 25 70 35" 
            fill="none" 
            stroke={expression === 'warning' ? '#EF4444' : '#06B6D4'} 
            strokeWidth="5" 
            strokeLinecap="round"
            style={{ filter: expression === 'warning' ? 'drop-shadow(0 0 6px #EF4444)' : 'drop-shadow(0 0 6px #06B6D4)' }}
          />

          {/* Body Block (Blue feathers base) */}
          <ellipse cx="50" cy="55" rx="26" ry="24" fill="#3B82F6" stroke="#2563EB" strokeWidth="2" />
          
          {/* Inner Belly Patch (Light blue chest) */}
          <ellipse cx="50" cy="58" rx="16" ry="14" fill="#EEF7FF" />
          
          {/* Hoodie Strings */}
          <line x1="46" y1="62" x2="46" y2="72" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="54" y1="62" x2="54" y2="70" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />

          {/* Goggles Strap */}
          <rect x="23" y="32" width="54" height="6" rx="2" fill="#1E293B" />

          {/* Cyber Goggles Rim */}
          <circle cx="38" cy="35" r="13" fill="#0F172A" stroke="#4F46E5" strokeWidth="3" />
          <circle cx="62" cy="35" r="13" fill="#0F172A" stroke="#4F46E5" strokeWidth="3" />

          {/* Glowing Goggle Screen Eyes */}
          <ellipse 
            cx="38" 
            cy="35" 
            rx="9" 
            ry={eyes.height} 
            fill={eyes.color} 
            style={{ filter: eyes.glow }} 
          />
          <ellipse 
            cx="62" 
            cy="35" 
            rx="9" 
            ry={eyes.height} 
            fill={eyes.color} 
            style={{ filter: eyes.glow }} 
          />

          {/* Cute Orange Beak */}
          <polygon 
            points="46,45 54,45 50,53" 
            fill="#FACC15"
          />

          {/* Owl Feathers Tuft Ears */}
          <path d="M 28 25 L 20 12 L 35 19" fill="#1D4ED8" />
          <path d="M 72 25 L 80 12 L 65 19" fill="#1D4ED8" />

          {/* Talons (feet) */}
          <circle cx="43" cy="78" r="3" fill="#F97316" />
          <circle cx="57" cy="78" r="3" fill="#F97316" />
        </svg>

        {/* Small mascot badge */}
        <span className="absolute -bottom-1.5 bg-[#4F46E5] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-indigo-200 tracking-wider">
          RAKSHA
        </span>
      </div>

    </div>
  );
};
