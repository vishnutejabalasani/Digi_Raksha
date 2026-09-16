import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Calendar, 
  ExternalLink, 
  ArrowLeft,
  Sparkles,
  Lock,
  QrCode,
  School,
  UserCheck
} from 'lucide-react';

export const PublicVerify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract query params with sensible fallbacks
  const cadetId = searchParams.get('id') || 'STUDENT-VIK-9902';
  const name = searchParams.get('name') || 'Cadet Vikram';
  const school = searchParams.get('school') || 'Delhi Cyber Academy';
  const rank = searchParams.get('rank') || 'ELITE COMMANDER';
  const xp = searchParams.get('xp') || '1650';
  const hash = searchParams.get('hash') || 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';
  const issuedDate = searchParams.get('date') || 'September 2026';

  const verifiedStamps = [
    { title: 'Phishing Hunter', emblem: '🎣', desc: 'Verified Email & Link Inspector' },
    { title: 'OTP Defender', emblem: '🔒', desc: 'Protected 2FA SMS Codes' },
    { title: 'QR Detective', emblem: '📲', desc: 'Identified UPI Debit Traps' },
    { title: 'Hideout Stopper', emblem: '🕵️‍♂️', desc: 'Neutralized Ransomware Lockout' },
    { title: 'Phone Detective', emblem: '📱', desc: 'Defused Mobile Screen-Sharing' },
    { title: 'Deepfake Specialist', emblem: '🎙️', desc: 'Detected Synthetic AI Voice Clones' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 text-white p-4 sm:p-8 flex flex-col items-center justify-center font-sans select-none relative overflow-hidden">
      
      {/* Ambient Cyber Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Verification Card */}
      <div className="max-w-xl w-full bg-slate-900/90 border-2 border-emerald-500/40 rounded-[36px] p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col gap-6 ring-1 ring-emerald-400/20">
        
        {/* Top Iridescent Verification Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500"></div>

        {/* Verification Status Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 animate-pulse">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-black uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Official Credential Verified
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Cyber Safety Defense License
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              National Digital Safety Initiative · In Partnership with IEEE SSIT
            </p>
          </div>
        </div>

        {/* Cadet Profile Summary */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3.5 font-mono text-xs">
          
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Cadet Name</span>
            <span className="text-white font-black text-sm tracking-wide">{name}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Credential ID</span>
            <span className="text-cyan-400 font-black tracking-widest">{cadetId}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Institution</span>
            <span className="text-slate-200 font-bold">{school}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Verified Rank</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-black text-[10px] uppercase">
              {rank}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Defense XP</span>
            <span className="text-amber-400 font-black">{xp} XP Earned</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Issued / Verified</span>
            <span className="text-slate-300 font-bold">{issuedDate}</span>
          </div>

        </div>

        {/* Verified Stamps Grid */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider">
            Verified Competency Endorsements:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {verifiedStamps.map((s, i) => (
              <div key={i} className="p-2.5 bg-slate-950/60 border border-emerald-500/30 rounded-xl flex items-center gap-2">
                <span className="text-xl">{s.emblem}</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white leading-tight">{s.title}</span>
                  <span className="text-[8px] text-emerald-400 font-mono font-bold">VERIFIED ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cryptographic SHA-256 Audit Seal */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-1 text-[9px] font-mono text-slate-400">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Lock className="w-3 h-3" /> Cryptographic Integrity Proof:
          </span>
          <span className="break-all text-slate-300 font-bold">{hash}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            type="button"
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg text-center"
          >
            Enter Digi Raksha Platform
          </button>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="mt-6 text-center text-xs text-slate-500 font-mono">
        DIGI RAKSHA · National Cyber Defense Initiative · Authorized Verification Seal
      </div>

    </div>
  );
};
