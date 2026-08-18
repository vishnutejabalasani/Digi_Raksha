import React from 'react';
import { useGame } from '../context/GameContext';
import { Shield, Zap, Coins, LogOut, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useGame();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 border-b-2 border-indigo-100/80 py-2.5 px-3 sm:py-3.5 sm:px-6 flex justify-between items-center shadow-sm backdrop-blur-xl transition-all">
      <div className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group shrink-0" onClick={() => navigate('/dashboard')}>
        <div className="p-2 sm:p-2.5 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-2xl text-white font-bold flex items-center justify-center shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <span className="font-black text-base sm:text-xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent tracking-wide block leading-none">
            DIGI RAKSHA
          </span>
          <span className="hidden xs:block text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-black text-cyan-600 mt-0.5 sm:mt-1">
            Cyber Safety Mission
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-4">
        {/* XP Meter */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 border sm:border-2 border-indigo-200/80 px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-indigo-700 shadow-xs" title="Experience Points">
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 fill-indigo-500/30" />
          <span className="text-[11px] sm:text-xs font-black">
            {user.xp} <span className="hidden xs:inline text-slate-500 font-bold">XP</span>
          </span>
        </div>

        {/* Cyber Coins */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 border sm:border-2 border-emerald-200/80 px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-emerald-700 shadow-xs" title="Safety Coins">
          <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
          <span className="text-[11px] sm:text-xs font-black">
            {user.coins} <span className="hidden xs:inline text-slate-500 font-bold">COINS</span>
          </span>
        </div>

        {/* Student Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 pl-1 sm:pl-2 border-l border-slate-200">
          <div className="hidden md:flex flex-col text-right">
            <div className="text-xs font-black text-slate-800 flex items-center justify-end gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              {user.name}
            </div>
            <div className="text-[9px] text-cyan-600 font-black tracking-wider uppercase">
              {user.rank}
            </div>
          </div>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white text-xs font-black shadow-md shadow-indigo-500/20 ring-2 ring-indigo-200 shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-1.5 sm:p-2 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-slate-400 hover:text-red-600 rounded-xl transition-all duration-200 cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </header>
  );
};
