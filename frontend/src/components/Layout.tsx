import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useGame } from '../context/GameContext';
import { AchievementPopup } from './AchievementPopup';
import { RakshaAI } from './RakshaAI';
import { Compass, Map, Flame, User, Award, Lock, Shield, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const FloatingDecorations: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-40">
      {/* Clouds */}
      <div className="absolute top-[8%] left-[-10%] animate-float-cloud text-slate-300/40 text-4xl">☁️</div>
      <div className="absolute top-[28%] left-[-15%] animate-float-cloud text-slate-300/35 text-5xl" style={{ animationDelay: '8s', animationDuration: '30s' }}>☁️</div>
      <div className="absolute top-[68%] left-[-10%] animate-float-cloud text-slate-300/30 text-3xl" style={{ animationDelay: '4s', animationDuration: '22s' }}>☁️</div>

      {/* Floating security items */}
      <div className="absolute top-[12%] right-[10%] animate-float-slow text-[#4F46E5] opacity-20">
        <Shield className="w-16 h-16" />
      </div>
      <div className="absolute top-[45%] left-[8%] animate-float-slow text-[#06B6D4] opacity-25" style={{ animationDelay: '2s' }}>
        <Lock className="w-12 h-12" />
      </div>
      <div className="absolute bottom-[20%] right-[12%] animate-float-slow text-[#22C55E] opacity-20" style={{ animationDelay: '4s' }}>
        <Shield className="w-14 h-14" />
      </div>
      <div className="absolute bottom-[35%] left-[15%] animate-float-slow text-[#FACC15] opacity-35" style={{ animationDelay: '1s' }}>
        <Sparkles className="w-10 h-10 animate-sparkle" />
      </div>
      <div className="absolute top-[50%] right-[18%] animate-float-slow text-[#F97316] opacity-30" style={{ animationDelay: '3s' }}>
        <Sparkles className="w-8 h-8 animate-sparkle" />
      </div>

      {/* Fun emojis */}
      <div className="absolute top-[25%] left-[22%] text-2xl animate-bounce-gentle">📱</div>
      <div className="absolute bottom-[10%] left-[45%] text-2xl animate-bounce-gentle" style={{ animationDelay: '1.5s' }}>🎓</div>
      <div className="absolute top-[15%] right-[35%] text-2xl animate-bounce-gentle" style={{ animationDelay: '2s' }}>🏆</div>
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useGame();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#EEF7FF] via-[#F5F3FF] to-[#FFFFFF] text-slate-800 relative overflow-hidden flex flex-col justify-center">
        <FloatingDecorations />
        <main className="relative z-10 w-full">{children}</main>
      </div>
    );
  }

  const mobileLinks = [
    { to: '/dashboard', label: 'Control', icon: Compass },
    { to: '/city-map', label: 'City Map', icon: Map },
    { to: '/escape-room', label: 'Escape', icon: Flame },
    { to: '/avatar', label: 'Avatar', icon: User },
    { to: '/graduation', label: 'Ceremony', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#EEF7FF] via-[#F5F3FF] to-[#FFFFFF] text-slate-800 flex flex-col relative overflow-x-hidden">
      <FloatingDecorations />
      
      <Navbar />

      <div className="flex flex-1 relative z-10">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 border-t border-[#E2E8F0] flex justify-around py-2 px-1 shadow-lg backdrop-blur-md">
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all duration-150
                ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Toast Notifications */}
      <AchievementPopup />

      {/* Floating AI Helper */}
      <RakshaAI />
    </div>
  );
};
