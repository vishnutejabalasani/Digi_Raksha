import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Shield, Lock, Unlock, Star, Coins, Zap, Trophy, Play, Info } from 'lucide-react';
import { RakshaMascot } from '../components/RakshaMascot';

interface Building {
  id: string;
  name: string;
  subName: string;
  path: string;
  rewardXP: number;
  rewardCoins: number;
  x: number;
  y: number;
  icon: string;
  description: string;
}

export const CyberCityMap: React.FC = () => {
  const { user } = useGame();
  const navigate = useNavigate();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  if (!user) return null;

  const buildings: Building[] = [
    {
      id: 'otp',
      name: '🏦 Federal Bank',
      subName: 'OTP Security',
      path: '/mission/otp',
      rewardXP: 100,
      rewardCoins: 50,
      x: 15,
      y: 60,
      icon: '🏦',
      description: 'Defend incoming smartphone calls requesting secret verification pins and passwords.'
    },
    {
      id: 'phishing',
      name: '🏤 Cyber Post Office',
      subName: 'Phishing Detector',
      path: '/mission/phishing',
      rewardXP: 100,
      rewardCoins: 50,
      x: 45,
      y: 75,
      icon: '🏤',
      description: 'Sort inbox messages, WhatsApp requests, and links into Safe or Dangerous piles.'
    },
    {
      id: 'vishing',
      name: '📱 Telecom Station',
      subName: 'Vishing Scanner',
      path: '/mission/vishing',
      rewardXP: 100,
      rewardCoins: 50,
      x: 75,
      y: 60,
      icon: '📱',
      description: 'Listen to phone logs. Hit the FRAUD ALERT buzzer the millisecond you hear scam pressure.'
    },
    {
      id: 'upi',
      name: '🏪 Digital Mall',
      subName: 'UPI Payment Safety',
      path: '/mission/upi',
      rewardXP: 100,
      rewardCoins: 50,
      x: 80,
      y: 25,
      icon: '🏪',
      description: 'Analyze collection notifications and fake QR code scanner displays before sending funds.'
    },
    {
      id: 'quiz',
      name: '🏫 Cyber Academy',
      subName: 'Safety Trivia',
      path: '/quiz',
      rewardXP: 150,
      rewardCoins: 100,
      x: 48,
      y: 45,
      icon: '🏫',
      description: 'Demonstrate your safety knowledge by completing a self-paced safety trivia module.'
    },
    {
      id: 'escape',
      name: '🕵️‍♂️ Hacker\'s Hideout',
      subName: 'CYBER ESCAPE ROOM',
      path: '/escape-room',
      rewardXP: 300,
      rewardCoins: 150,
      x: 50,
      y: 12,
      icon: '🕵️‍♂️',
      description: 'WARNING: City network infected! Decrypt codes and stop fake transfers at your own pace!'
    }
  ];

  // Helper to determine lock state
  const isBuildingUnlocked = (id: string): boolean => {
    if (user.role === 'admin' || user.role === 'volunteer') return true;
    
    switch (id) {
      case 'otp':
        return true; // Bank is always open
      case 'phishing':
        return user.completedMissions.includes('otp'); // Unlocked after Bank
      case 'vishing':
        return user.completedMissions.includes('phishing'); // Unlocked after Phishing
      case 'upi':
        return user.completedMissions.includes('vishing'); // Unlocked after Vishing
      case 'quiz':
        return user.completedMissions.length >= 1; // Unlocked after any 1 mission
      case 'escape':
        // Locked until all 4 core missions are completed
        return (
          user.completedMissions.includes('otp') &&
          user.completedMissions.includes('phishing') &&
          user.completedMissions.includes('vishing') &&
          user.completedMissions.includes('upi')
        );
      default:
        return true;
    }
  };

  const getLockWarning = (id: string): string => {
    switch (id) {
      case 'phishing': return 'Complete 🏦 Federal Bank (OTP Safety) to unlock!';
      case 'vishing': return 'Complete 🏤 Cyber Post Office (Phishing) to unlock!';
      case 'upi': return 'Complete 📱 Telecom Station (Vishing) to unlock!';
      case 'quiz':
      case 'poster': return 'Complete at least 1 mission to unlock!';
      case 'escape': return 'Complete all 4 main missions to unlock the Escape Room!';
      default: return '';
    }
  };

  return (
    <div className="relative w-full h-[620px] bg-slate-950/60 rounded-3xl border border-white/5 overflow-hidden flex flex-col font-sans">
      
      {/* City Map Header */}
      <div className="p-4 sm:p-5 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between bg-slate-900/30 relative z-20 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400 animate-pulse" />
            Cyber City Map
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Explore buildings to deploy safety mission protocols</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 px-3 py-1.5 rounded-xl text-xs font-bold text-violet-300">
            <Zap className="w-4 h-4 text-violet-400" />
            <span>{user.xp} XP</span>
          </div>
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{user.coins} Coins</span>
          </div>
        </div>
      </div>

      {/* Map Content View */}
      <div className="flex-1 relative overflow-hidden bg-slate-950/70 select-none">
        
        {/* Animated Background Grids & Particle overlays */}
        <div className="absolute inset-0 cyber-grid opacity-25"></div>
        <div className="absolute inset-0 cyber-grid-dots opacity-40"></div>

        {/* Isometric SVG roads mapping */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* Animated path roads connecting the buildings */}
          <path 
            d="M 15 60 L 48 45 L 45 75 L 75 60 L 80 25 L 50 12 L 20 25 L 48 45" 
            fill="none" 
            stroke="rgba(6, 182, 212, 0.25)" 
            strokeWidth="4" 
            strokeDasharray="8 8"
            className="animate-pulse"
          />
          <path 
            d="M 15 60 L 48 45 L 45 75 L 75 60 L 80 25 L 50 12 L 20 25 L 48 45" 
            fill="none" 
            stroke="url(#roadGrad)" 
            strokeWidth="4" 
            strokeDasharray="15 30"
            className="animate-[scanline_12s_linear_infinite]"
          />
          <defs>
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Render Buildings */}
        {buildings.map((b) => {
          const unlocked = isBuildingUnlocked(b.id);
          const completed = user.completedMissions.includes(b.id) || (b.id === 'quiz' && user.quizScore !== null);
          const starCount = user.stars[b.id] || 0;

          return (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBuilding(b);
              }}
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-300 z-10`}
            >
              {/* Holographic Glowing Base Ring */}
              <div 
                className={`w-16 h-16 rounded-full absolute -bottom-1 -z-10 blur-md transition-all duration-300
                  ${unlocked 
                    ? completed 
                      ? 'bg-emerald-500/20 group-hover:bg-emerald-500/40 shadow-emerald-500/20' 
                      : 'bg-cyan-500/20 group-hover:bg-cyan-500/40 shadow-cyan-500/20' 
                    : 'bg-rose-500/10 group-hover:bg-rose-500/20 shadow-rose-500/10'
                  }
                `}
              />

              {/* Building Icon Cylinder */}
              <div 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border text-2xl shadow-xl transition-all duration-300 relative
                  ${unlocked 
                    ? completed 
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-white animate-float' 
                      : 'bg-slate-900/90 border-cyan-500/60 text-white group-hover:scale-110' 
                    : 'bg-slate-950/95 border-rose-950 text-slate-600 cursor-not-allowed'
                  }
                `}
              >
                {b.icon}
                
                {/* Status Indicator Overlays */}
                {!unlocked && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 border border-rose-400 p-0.5 rounded-full text-white">
                    <Lock className="w-2.5 h-2.5" />
                  </span>
                )}
                {unlocked && completed && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 border border-emerald-400 p-0.5 rounded-full text-white animate-scale-in">
                    <Unlock className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              {/* Star Rating display (for missions) */}
              {unlocked && completed && starCount > 0 && (
                <div className="flex gap-0.5 mt-1 bg-slate-950/90 px-1.5 py-0.5 border border-white/10 rounded-full">
                  {[...Array(3)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-2.5 h-2.5 ${i < starCount ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} 
                    />
                  ))}
                </div>
              )}

              {/* Building Name Tag */}
              <span 
                className={`mt-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border transition-colors
                  ${unlocked 
                    ? completed 
                      ? 'bg-emerald-950/50 border-emerald-500/20 text-emerald-300' 
                      : 'bg-slate-900/60 border-cyan-500/20 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950'
                    : 'bg-slate-950/80 border-slate-900 text-slate-500'
                  }
                `}
              >
                {b.subName}
              </span>
            </button>
          );
        })}

        {/* Floating Clouds Overlay */}
        <div className="absolute top-8 left-10 w-24 h-6 bg-white/5 blur-md rounded-full animate-float"></div>
        <div className="absolute top-24 right-20 w-32 h-8 bg-white/5 blur-md rounded-full animate-float [animation-delay:2s]"></div>

      </div>

      {/* Dynamic Raksha Advisor Speech Box */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden md:block">
        <RakshaMascot 
          expression={selectedBuilding ? 'talk' : 'idle'}
          message={
            selectedBuilding 
              ? `Check out ${selectedBuilding.name}! Unlocks safety badges!` 
              : "Welcome to Cyber City, Student! Select a building to start your missions."
          }
          className="!gap-2.5 scale-90"
        />
      </div>

      {/* Building Inspector Modal Overlay */}
      {selectedBuilding && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-filter backdrop-blur-sm z-30 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md glass-panel-strong rounded-3xl border border-white/10 p-6 flex flex-col gap-4 relative animate-scale-in">
            
            {/* Hologram top stripe */}
            <div className="h-1 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-t-full absolute top-0 left-0 right-0"></div>

            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <span className="text-3xl p-3 bg-white/5 rounded-2xl border border-white/5">
                  {selectedBuilding.icon}
                </span>
                <div>
                  <h3 className="font-extrabold text-white text-base sm:text-lg">
                    {selectedBuilding.name}
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded-md">
                    {selectedBuilding.subName}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedBuilding(null)}
                className="p-1 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all text-xs"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-900/40 p-3 rounded-2xl border border-white/5">
              {selectedBuilding.description}
            </p>

            {/* Reward Badges */}
            <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-300">
                <Zap className="w-4 h-4 text-violet-400 shrink-0" />
                <span>+{selectedBuilding.rewardXP} XP</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-300">
                <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+{selectedBuilding.rewardCoins} Coins</span>
              </div>
            </div>

            {/* Launch / Locked Action button */}
            {isBuildingUnlocked(selectedBuilding.id) ? (
              <button
                onClick={() => {
                  setSelectedBuilding(null);
                  navigate(selectedBuilding.path);
                }}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-white" />
                Launch Safety Protocol
              </button>
            ) : (
              <div className="flex flex-col gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-bold">
                  <Lock className="w-4 h-4" />
                  <span>LOCATION LOCKED</span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  {getLockWarning(selectedBuilding.id)}
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
