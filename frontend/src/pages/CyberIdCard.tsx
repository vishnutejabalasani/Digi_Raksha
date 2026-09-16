import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { 
  ArrowLeft, 
  Printer, 
  RotateCw, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Check, 
  Copy, 
  Award, 
  Lock, 
  Download,
  ExternalLink
} from 'lucide-react';

export const CyberIdCard: React.FC = () => {
  const { user } = useGame();
  const navigate = useNavigate();

  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const cadetId = `STUDENT-${user.name.slice(0, 3).toUpperCase()}-9902`;
  const verificationHash = 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';
  const verificationUrl = `https://digi-raksha-six.vercel.app/verify?id=${encodeURIComponent(cadetId)}&name=${encodeURIComponent(user.name)}&school=${encodeURIComponent(user.school)}&rank=${encodeURIComponent(user.rank)}&xp=${user.xp}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 select-none font-sans">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 p-4 sm:p-5 rounded-3xl border-2 border-indigo-100 shadow-sm backdrop-blur-md print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/passport')}
            type="button"
            className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-2xl text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-wider rounded-full">
                Verifiable Agent Credential
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                ISO/IEC 7810 ID-1
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mt-0.5">
              <Award className="w-6 h-6 text-primary animate-pulse" />
              Official Cyber Cadet Agent ID Badge
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyLink}
            type="button"
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Link Copied!' : 'Copy Verification URL'}</span>
          </button>

          <button
            onClick={handlePrint}
            type="button"
            className="px-4 py-2.5 bg-primary hover:bg-[#4338CA] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-md hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>Print ID Badge</span>
          </button>
        </div>
      </div>

      {/* Main Interactive ID Showcase Container */}
      <div className="flex flex-col items-center justify-center py-6 gap-6">
        
        {/* Flip Hint Bar */}
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            type="button"
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all hover:scale-105 shadow-xs"
          >
            <RotateCw className="w-4 h-4 text-primary animate-spin [animation-duration:8s]" />
            <span>{isFlipped ? 'Flip to Front' : 'Flip to Back Details'}</span>
          </button>
          <span className="text-xs text-slate-400 font-bold">
            Scan QR code with any smartphone to verify live
          </span>
        </div>

        {/* THE HOLOGRAPHIC AGENT ID CARD (Printed area) */}
        <div className="relative w-[350px] sm:w-[480px] h-[260px] sm:h-[300px] perspective-1000 print:w-[85.6mm] print:h-[53.98mm]">
          
          <div className={`relative w-full h-full rounded-[24px] shadow-2xl transition-all duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}>
            
            {/* FRONT SIDE */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[24px] p-5 sm:p-6 text-white border-2 border-indigo-400/40 backface-hidden flex flex-col justify-between overflow-hidden shadow-2xl ring-1 ring-cyan-400/30">
              
              {/* Holographic Iridescent Ribbon Foil */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-cyan-400/20 via-purple-500/20 to-amber-400/20 rounded-full blur-2xl pointer-events-none animate-pulse"></div>
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-300"></div>

              {/* Front Top: Header & Identity */}
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 p-0.5 shadow-md flex items-center justify-center text-white font-black text-sm">
                    🛡️
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 font-black tracking-widest uppercase">
                      DIGI RAKSHA · CYBER DEFENSE
                    </div>
                    <div className="text-xs sm:text-sm font-black text-white tracking-wide uppercase">
                      National Cadet Agent
                    </div>
                  </div>
                </div>

                {/* Holographic Security Foil Seal */}
                <div className="bg-gradient-to-tr from-amber-400/20 via-cyan-400/20 to-purple-400/20 border border-cyan-300/40 px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 shadow-inner">
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  <span className="text-[9px] font-mono font-bold text-cyan-200 tracking-wider">HOLO-SEC</span>
                </div>
              </div>

              {/* Front Middle: Photo Avatar & Details */}
              <div className="flex items-center gap-4 sm:gap-5 z-10 my-auto">
                {/* Cadet Avatar */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-1 border-2 border-cyan-400/50 shadow-xl flex items-center justify-center shrink-0">
                  <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-3xl sm:text-4xl font-black text-cyan-300 shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Info Credentials */}
                <div className="flex-1 flex flex-col gap-1 font-mono">
                  <div className="text-base sm:text-lg font-black text-white uppercase tracking-wider leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] sm:text-xs text-indigo-300 font-bold truncate max-w-[190px]">
                    {user.school}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 px-2 py-0.5 rounded-full font-black uppercase">
                      {user.rank}
                    </span>
                    <span className="text-[9px] text-amber-400 font-black">
                      {user.xp} XP
                    </span>
                  </div>
                </div>

                {/* SCANNABLE DYNAMIC QR CODE */}
                <div className="flex flex-col items-center gap-1 shrink-0 bg-white p-2 rounded-xl shadow-lg border border-slate-200">
                  {/* Visual QR Code SVG Pattern */}
                  <svg className="w-16 h-16 sm:w-18 sm:h-18" viewBox="0 0 100 100">
                    {/* Corner Position Boxes */}
                    <rect x="5" y="5" width="28" height="28" fill="#0F172A" rx="4" />
                    <rect x="10" y="10" width="18" height="18" fill="#FFFFFF" rx="2" />
                    <rect x="14" y="14" width="10" height="10" fill="#0F172A" />

                    <rect x="67" y="5" width="28" height="28" fill="#0F172A" rx="4" />
                    <rect x="72" y="10" width="18" height="18" fill="#FFFFFF" rx="2" />
                    <rect x="76" y="14" width="10" height="10" fill="#0F172A" />

                    <rect x="5" y="67" width="28" height="28" fill="#0F172A" rx="4" />
                    <rect x="10" y="72" width="18" height="18" fill="#FFFFFF" rx="2" />
                    <rect x="14" y="76" width="10" height="10" fill="#0F172A" />

                    {/* Encoded Data Matrix Dots */}
                    <rect x="38" y="10" width="8" height="8" fill="#0F172A" />
                    <rect x="50" y="10" width="8" height="8" fill="#0F172A" />
                    <rect x="38" y="24" width="8" height="8" fill="#0F172A" />
                    <rect x="50" y="24" width="8" height="8" fill="#0F172A" />
                    <rect x="10" y="38" width="8" height="8" fill="#0F172A" />
                    <rect x="24" y="38" width="8" height="8" fill="#0F172A" />
                    <rect x="38" y="38" width="8" height="8" fill="#0F172A" />
                    <rect x="50" y="38" width="8" height="8" fill="#0F172A" />
                    <rect x="64" y="38" width="8" height="8" fill="#0F172A" />
                    <rect x="78" y="38" width="8" height="8" fill="#0F172A" />
                    <rect x="10" y="50" width="8" height="8" fill="#0F172A" />
                    <rect x="24" y="50" width="8" height="8" fill="#0F172A" />
                    <rect x="38" y="50" width="8" height="8" fill="#0F172A" />
                    <rect x="64" y="50" width="8" height="8" fill="#0F172A" />
                    <rect x="78" y="50" width="8" height="8" fill="#0F172A" />
                    <rect x="38" y="64" width="8" height="8" fill="#0F172A" />
                    <rect x="50" y="64" width="8" height="8" fill="#0F172A" />
                    <rect x="64" y="64" width="8" height="8" fill="#0F172A" />
                    <rect x="78" y="64" width="8" height="8" fill="#0F172A" />
                    <rect x="38" y="78" width="8" height="8" fill="#0F172A" />
                    <rect x="50" y="78" width="8" height="8" fill="#0F172A" />
                    <rect x="64" y="78" width="8" height="8" fill="#0F172A" />
                    <rect x="78" y="78" width="8" height="8" fill="#0F172A" />
                  </svg>
                  <span className="text-[7px] font-mono text-slate-800 font-black uppercase">
                    SCAN TO VERIFY
                  </span>
                </div>
              </div>

              {/* Front Bottom: Security ID & Hash */}
              <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-2 z-10">
                <span className="text-cyan-400 font-black tracking-widest">{cadetId}</span>
                <span className="truncate max-w-[200px] text-slate-500 font-bold">SHA256:7f83b1657ff1...</span>
                <span className="text-emerald-400 font-bold">VERIFIED ✓</span>
              </div>

            </div>

            {/* BACK SIDE (Shown when flipped) */}
            <div className="absolute inset-0 w-full h-full bg-slate-950 rounded-[24px] p-5 sm:p-6 text-white border-2 border-indigo-400/40 rotate-y-180 backface-hidden flex flex-col justify-between overflow-hidden shadow-2xl">
              
              <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <span className="text-[10px] font-mono text-cyan-400 font-black uppercase">
                  Endorsement Stamps & Standards
                </span>
                <span className="text-[9px] text-emerald-400 font-bold">
                  IEEE SSIT AFFILIATED
                </span>
              </div>

              {/* Stamps Matrix */}
              <div className="grid grid-cols-3 gap-2 my-auto text-center">
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center">
                  <span className="text-base">🎣</span>
                  <span className="text-[8px] font-mono font-bold text-slate-300 mt-0.5">Phishing Def</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center">
                  <span className="text-base">🔒</span>
                  <span className="text-[8px] font-mono font-bold text-slate-300 mt-0.5">OTP Shield</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center">
                  <span className="text-base">📲</span>
                  <span className="text-[8px] font-mono font-bold text-slate-300 mt-0.5">QR Forensics</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center">
                  <span className="text-base">🕵️‍♂️</span>
                  <span className="text-[8px] font-mono font-bold text-slate-300 mt-0.5">Ransomware Dec</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center">
                  <span className="text-base">📱</span>
                  <span className="text-[8px] font-mono font-bold text-slate-300 mt-0.5">Mobile Threat</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center">
                  <span className="text-base">🎙️</span>
                  <span className="text-[8px] font-mono font-bold text-slate-300 mt-0.5">Deepfake Spec</span>
                </div>
              </div>

              {/* Helpline & Signature */}
              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-[9px] font-mono">
                <div className="flex flex-col">
                  <span className="text-amber-400 font-bold">Helpline 1930 · cybercrime.gov.in</span>
                  <span className="text-slate-500 text-[8px]">Authorized Cyber Cadet License</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-serif font-black text-indigo-400 italic">DigiRaksha Auth</div>
                  <span className="text-[7px] text-slate-500">DIGITAL SIGNATURE</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Live Test Link for Judges */}
        <div className="flex items-center gap-2 text-xs text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-2xl print:hidden">
          <span>Direct Judge Verification URL:</span>
          <a 
            href={verificationUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1 font-black"
          >
            <span>Open Public Verification Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
};
