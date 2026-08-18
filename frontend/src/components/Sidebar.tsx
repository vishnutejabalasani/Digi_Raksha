import React from 'react';
import { NavLink } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { 
  Compass, 
  Map,
  Flame,
  User,
  Award,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useGame();

  if (!user) return null;

  const links = [
    { to: '/dashboard', label: 'Mission Control', icon: Compass },
    { to: '/city-map', label: 'Cyber City Map', icon: Map },
    { to: '/escape-room', label: 'Escape Room', icon: Flame },
    { to: '/avatar', label: 'Avatar Shop', icon: User },
    { to: '/graduation', label: 'Hero Ceremony', icon: Award },
  ];

  return (
    <aside className="w-64 bg-white/90 border-r-2 border-indigo-100/80 hidden md:flex flex-col min-h-[calc(100vh-73px)] justify-between p-4 select-none shrink-0 shadow-xs backdrop-blur-xl">
      <div className="flex flex-col gap-6">
        
        {/* Mission Status Cyber Widget */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/30 rounded-2xl p-4 shadow-md text-white relative overflow-hidden">
          <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest flex justify-between">
            <span>Student Rank</span>
            <span className="text-cyan-400 font-black">{user.rank.split(' ')[0]}</span>
          </div>
          <div className="text-sm font-black text-white mt-1 leading-tight uppercase tracking-wide">
            {user.rank}
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full mt-3 overflow-hidden border border-slate-700">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(100, (user.xp / 1500) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-slate-300 mt-2 flex justify-between font-bold">
            <span>{user.xp} / 1500 XP</span>
            <span className="text-cyan-400 font-extrabold">{Math.round(Math.min(100, (user.xp / 1500) * 100))}% to Hero</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          <span className="px-3 text-[10px] uppercase tracking-[0.2em] font-black text-indigo-400 mb-1">
            Missions & Safety
          </span>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 group cursor-pointer
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 scale-102' 
                    : 'text-slate-600 hover:bg-indigo-50/70 hover:text-indigo-700'
                  }
                `}
              >
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

      </div>

      {/* Cyber Pledge Signature Status */}
      <div className="mt-auto pt-4 border-t border-slate-200">
        {user.signedPledge ? (
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl text-emerald-700 text-[11px] font-black uppercase tracking-wider justify-center shadow-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Pledge Verified</span>
          </div>
        ) : (
          <NavLink
            to="/pledge"
            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wider text-center shadow-sm cursor-pointer transition-all"
          >
            <span>Sign Safety Pledge</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
};
