import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Shield, Award, Users, Star, Sparkles, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface House {
  name: string;
  points: number;
  color: string;
  crest: string;
  motto: string;
}

interface ClassStanding {
  section: string;
  points: number;
  memberCount: number;
}

export const HouseChampionship: React.FC = () => {
  const { user } = useGame();
  
  const [houses, setHouses] = useState<House[]>([
    { name: 'Agni (Fire)', points: 4320, color: 'from-orange-500 to-rose-600', crest: '🔥', motto: 'Courage and Vigor in online defense' },
    { name: 'Trishul (Trident)', points: 3950, color: 'from-cyan-500 to-blue-600', crest: '🔱', motto: 'Piercing scams with intellect' },
    { name: 'Prithvi (Earth)', points: 3820, color: 'from-emerald-500 to-teal-600', crest: '🌱', motto: 'Solid grounding in safety habits' },
    { name: 'Akash (Space)', points: 3410, color: 'from-purple-500 to-indigo-600', crest: '🌌', motto: 'Vast knowledge blocks threat vectors' }
  ]);

  const [classes] = useState<ClassStanding[]>([
    { section: 'Class 8-B', points: 2840, memberCount: 32 },
    { section: 'Class 9-A', points: 2510, memberCount: 28 },
    { section: 'Class 8-A', points: 2420, memberCount: 30 },
    { section: 'Class 7-C', points: 1980, memberCount: 26 },
    { section: 'Class 10-B', points: 1850, memberCount: 24 }
  ]);

  if (!user) return null;

  const triggerFireworks = () => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
    }, 300);
  };

  return (
    <div className="max-w-5xl mx-auto font-sans relative z-10 flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl border border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between bg-slate-900/30 gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500"></div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
            House Championship Arena
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Every student's XP contribution boosts their school house standing in the regional leaderboard!</p>
        </div>

        <button 
          onClick={triggerFireworks}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          💥 Celebrate Champions
        </button>
      </div>

      {/* Victor Podiums */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* House standings cards */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-400" />
            Current House Standings
          </h3>

          <div className="flex flex-col gap-3">
            {houses.map((house, idx) => (
              <div 
                key={house.name}
                className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3 relative overflow-hidden"
              >
                {/* Ranking marker overlay */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b ${house.color}`}></div>

                <div className="flex items-center gap-3.5 pl-2">
                  <span className="text-2xl">{house.crest}</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">{house.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold italic mt-0.5">{house.motto}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-white flex items-center gap-1">
                    <Zap className="w-4 h-4 text-amber-400" />
                    {house.points} pts
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 block">
                    Rank #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Standings */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-violet-400" />
            Top Class Divisions
          </h3>

          <div className="flex flex-col gap-3">
            {classes.map((cls, idx) => (
              <div 
                key={cls.section}
                className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black
                    ${idx === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/35' : ''}
                    ${idx === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/35' : ''}
                    ${idx === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/35' : ''}
                    ${idx > 2 ? 'bg-white/5 text-slate-400 border border-white/5' : ''}
                  `}>
                    #{idx + 1}
                  </span>

                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">{cls.section}</h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">
                      {cls.memberCount} Active Students
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-cyan-400 flex items-center gap-1">
                    <Star className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                    {cls.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Championship Podium Animation */}
      <div className="glass-panel rounded-3xl border border-white/10 p-6 flex flex-col items-center gap-6 bg-slate-900/25 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-cyan-400"></div>

        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin [animation-duration:8s]" />
          Weekly Victory Podium
        </h3>

        {/* Podium visualization */}
        <div className="flex items-end justify-center gap-3 sm:gap-6 mt-8 w-full max-w-md h-48 select-none">
          
          {/* Rank 2 (Left) */}
          <div className="flex flex-col items-center w-24">
            <span className="text-2xl animate-float">🔱</span>
            <span className="text-[10px] font-black text-slate-300 mt-1">Trishul</span>
            <div className="w-full h-20 bg-slate-800 border-t-2 border-slate-300 rounded-t-xl flex flex-col items-center justify-center shadow-lg">
              <span className="text-lg font-black text-slate-300">#2</span>
              <span className="text-[9px] font-extrabold text-slate-400">3,950 pts</span>
            </div>
          </div>

          {/* Rank 1 (Center) */}
          <div className="flex flex-col items-center w-28">
            <span className="text-4xl animate-bounce [animation-duration:2s]">🔥</span>
            <span className="text-xs font-black text-amber-300 mt-1">Agni House</span>
            <div className="w-full h-28 bg-slate-900 border-t-4 border-amber-500 rounded-t-xl flex flex-col items-center justify-center shadow-2xl relative">
              {/* Gold star */}
              <span className="absolute -top-3 right-2 text-amber-400 text-lg animate-pulse">⭐</span>
              <span className="text-2xl font-black text-amber-400">#1</span>
              <span className="text-[10px] font-black text-amber-300">4,320 pts</span>
            </div>
          </div>

          {/* Rank 3 (Right) */}
          <div className="flex flex-col items-center w-24">
            <span className="text-2xl animate-float [animation-delay:1s]">🌱</span>
            <span className="text-[10px] font-black text-slate-300 mt-1">Prithvi</span>
            <div className="w-full h-16 bg-slate-800 border-t-2 border-amber-800 rounded-t-xl flex flex-col items-center justify-center shadow-lg">
              <span className="text-lg font-black text-amber-600">#3</span>
              <span className="text-[9px] font-extrabold text-slate-400">3,820 pts</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
