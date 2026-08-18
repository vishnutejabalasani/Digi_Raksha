import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Shield, Sparkles, Printer, User, Award, CheckCircle, Smartphone } from 'lucide-react';

export const QRLogin: React.FC = () => {
  const { user } = useGame();
  const [attendanceLogged, setAttendanceLogged] = useState(true);

  if (!user) return null;

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="max-w-md mx-auto font-sans relative z-10 print:m-0 print:p-0">
      
      {/* Visual Identity Card Container */}
      <div className="glass-panel-strong rounded-3xl border border-white/10 p-6 flex flex-col items-center gap-6 relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl text-center print:bg-white print:text-slate-950 print:border-slate-300 print:shadow-none">
        
        {/* Hologram top stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 to-cyan-400"></div>

        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center justify-center gap-1.5 print:text-slate-800">
            <Shield className="w-4 h-4 text-cyan-400" />
            Student Credentials Card
          </h2>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">
            Digi Raksha Safety Challenge
          </span>
        </div>

        {/* QR Code Graphic Section */}
        <div className="p-4 bg-white rounded-3xl shadow-inner border border-slate-200 flex flex-col items-center gap-2 relative">
          
          {/* Mock QR details */}
          <div className="w-44 h-44 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer boundary targets */}
              <rect x="10" y="10" width="25" height="25" fill="#000" />
              <rect x="15" y="15" width="15" height="15" fill="#fff" />
              <rect x="18" y="18" width="9" height="9" fill="#000" />

              <rect x="65" y="10" width="25" height="25" fill="#000" />
              <rect x="70" y="15" width="15" height="15" fill="#fff" />
              <rect x="73" y="18" width="9" height="9" fill="#000" />

              <rect x="10" y="65" width="25" height="25" fill="#000" />
              <rect x="15" y="70" width="15" height="15" fill="#fff" />
              <rect x="18" y="73" width="9" height="9" fill="#000" />

              {/* Data blocks */}
              <rect x="40" y="15" width="10" height="5" fill="#000" />
              <rect x="50" y="25" width="10" height="10" fill="#000" />
              <rect x="40" y="45" width="20" height="15" fill="#000" />
              <rect x="65" y="45" width="10" height="5" fill="#000" />
              <rect x="65" y="55" width="15" height="20" fill="#000" />
              <rect x="45" y="75" width="15" height="15" fill="#000" />
              <rect x="75" y="80" width="10" height="10" fill="#000" />
            </svg>
          </div>

          <span className="text-[8px] text-slate-500 font-mono tracking-widest uppercase">
            SECURE ACCESS: {user.name.substring(0,3).toUpperCase()}-{user.xp}XP
          </span>
        </div>

        {/* Cadet Data Description */}
        <div className="w-full flex flex-col gap-2 bg-slate-950/50 p-4 border border-white/5 rounded-2xl print:bg-slate-50 print:border-slate-300">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold print:text-slate-500">STUDENT NAME:</span>
            <span className="text-white font-black print:text-slate-900">{user.name.toUpperCase()}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold print:text-slate-500">DIVISION:</span>
            <span className="text-white font-black print:text-slate-900">{user.className} ({user.school})</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold print:text-slate-500">TOTAL SCORE:</span>
            <span className="text-cyan-400 font-black print:text-cyan-600">{user.xp} XP</span>
          </div>
        </div>

        {/* Attendance Verification Widget */}
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl w-full justify-center print:text-emerald-700 print:border-emerald-600 print:bg-emerald-50">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Workshop Attendance Registered</span>
        </div>

        {/* Print controls */}
        <button
          onClick={handlePrintCard}
          className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer print:hidden"
        >
          <Printer className="w-4 h-4" />
          <span>Print Access Card</span>
        </button>

      </div>

    </div>
  );
};
